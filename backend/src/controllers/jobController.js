import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { User } from "../models/User.js";

export async function createJob(req, res) {
  const payload = {
    recruiterId: req.user.id,
    title: req.body.title,
    description: req.body.description,
    requiredSkills: Array.isArray(req.body.requiredSkills)
      ? req.body.requiredSkills
      : typeof req.body.requiredSkills === "string"
        ? req.body.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    salaryMin: Number(req.body.salaryMin || 0),
    salaryMax: Number(req.body.salaryMax || 0),
    experienceLevel: req.body.experienceLevel,
    category: req.body.category,
    location: req.body.location,
    workMode: ["onsite", "remote", "hybrid"].includes((req.body.workMode || "").toString())
      ? req.body.workMode
      : "onsite",
    isActive: req.body.isActive ?? true,
  };
  const job = await Job.create(payload);
  return res.status(201).json({ job });
}

export async function updateJob(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid job id" });

  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiterId) !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const fields = [
    "title",
    "description",
    "salaryMin",
    "salaryMax",
    "experienceLevel",
    "category",
    "location",
    "workMode",
    "isActive",
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  }
  if (job.workMode && !["onsite", "remote", "hybrid"].includes(job.workMode)) job.workMode = "onsite";
  if (req.body.requiredSkills !== undefined) {
    job.requiredSkills = Array.isArray(req.body.requiredSkills)
      ? req.body.requiredSkills
      : typeof req.body.requiredSkills === "string"
        ? req.body.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
  }
  await job.save();
  return res.json({ job });
}

export async function deleteJob(req, res) {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiterId) !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  await Application.deleteMany({ jobId: job._id });
  await job.deleteOne();
  return res.json({ ok: true });
}

export async function getJob(req, res) {
  const { id } = req.params;
  const job = await Job.findById(id).populate("recruiterId", "name email company").lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json({ job });
}

export async function listJobs(req, res) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
  const skip = (page - 1) * limit;

  const q = (req.query.q || "").toString().trim();
  const category = (req.query.category || "").toString().trim();
  const location = (req.query.location || "").toString().trim();
  const experience = (req.query.experience || "").toString().trim();
  const minSalary = req.query.minSalary !== undefined ? Number(req.query.minSalary) : undefined;
  const maxSalary = req.query.maxSalary !== undefined ? Number(req.query.maxSalary) : undefined;
  const skills = (req.query.skills || "")
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const workMode = (req.query.workMode || "").toString().trim().toLowerCase();

  const filter = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (experience) filter.experienceLevel = experience;
  if (["onsite", "remote", "hybrid"].includes(workMode)) filter.workMode = workMode;
  if (skills.length) filter.requiredSkills = { $all: skills };
  if (!Number.isNaN(minSalary) && minSalary !== undefined) filter.salaryMax = { $gte: minSalary };
  if (!Number.isNaN(maxSalary) && maxSalary !== undefined)
    filter.salaryMin = { ...(filter.salaryMin || {}), $lte: maxSalary };

  const [items, total] = await Promise.all([
    Job.find(filter)
      .sort(q ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("recruiterId", "name company")
      .lean(),
    Job.countDocuments(filter),
  ]);

  return res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items,
  });
}

/** Personalized suggestions for candidates (skills / preferred category). */
export async function recommendedJobs(req, res) {
  const user = await User.findById(req.user.id).lean();
  if (!user || user.role !== "candidate") return res.status(403).json({ message: "Forbidden" });

  const filter = { isActive: true };
  if (user.preferredCategory?.trim()) {
    filter.category = user.preferredCategory.trim();
  } else if (Array.isArray(user.skills) && user.skills.length) {
    filter.requiredSkills = { $in: user.skills };
  }

  let jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(16).populate("recruiterId", "name company").lean();

  if (jobs.length < 8) {
    const exclude = jobs.map((j) => j._id);
    const more = await Job.find({ isActive: true, ...(exclude.length ? { _id: { $nin: exclude } } : {}) })
      .sort({ createdAt: -1 })
      .limit(16 - jobs.length)
      .populate("recruiterId", "name company")
      .lean();
    jobs = [...jobs, ...more];
  }

  return res.json({ jobs });
}

export async function listRecruiterJobs(req, res) {
  const recruiterId = req.user.id;
  const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 }).lean();
  return res.json({ jobs });
}

/**
 * Aggregated metrics, pipeline counts, and recent applications for recruiter dashboard UI.
 */
export async function getRecruiterDashboard(req, res) {
  const recruiterId = req.user.id;
  const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 }).lean();
  const jobIds = jobs.map((j) => j._id);

  if (jobIds.length === 0) {
    return res.json({
      jobs: [],
      stats: {
        activeJobs: 0,
        totalJobs: 0,
        totalApplicants: 0,
        interviewsScheduled: 0,
        hiredCandidates: 0,
      },
      pipeline: {
        applied: 0,
        screening: 0,
        interview: 0,
        offer: 0,
        hired: 0,
      },
      recentApplications: [],
    });
  }

  const [countsByJob, statusBreakdown] = await Promise.all([
    Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = Object.fromEntries(countsByJob.map((c) => [String(c._id), c.count]));
  const byStatus = Object.fromEntries(statusBreakdown.map((s) => [s._id, s.count]));

  const applied = byStatus.applied || 0;
  const underReview = byStatus.under_review || 0;
  const shortlisted = byStatus.shortlisted || 0;
  const interview = byStatus.interview || 0;
  const rejected = byStatus.rejected || 0;
  const selected = byStatus.selected || 0;
  const totalApplicants = statusBreakdown.reduce((n, s) => n + (s.count || 0), 0);

  const recentApplications = await Application.find({ jobId: { $in: jobIds } })
    .sort({ appliedDate: -1 })
    .limit(10)
    .populate("candidateId", "name email skills qualification resume")
    .populate("jobId", "title isActive")
    .lean();

  const activeJobs = jobs.filter((j) => j.isActive).length;

  const jobsWithCounts = jobs.map((j) => ({
    ...j,
    applicantCount: countMap[String(j._id)] || 0,
  }));

  return res.json({
    jobs: jobsWithCounts,
    stats: {
      activeJobs,
      totalJobs: jobs.length,
      totalApplicants,
      interviewsScheduled: interview + shortlisted,
      hiredCandidates: selected,
    },
    pipeline: {
      applied,
      screening: underReview,
      interview,
      offer: shortlisted,
      hired: selected,
    },
    recentApplications,
  });
}

