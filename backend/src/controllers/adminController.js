import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Feedback, FEEDBACK_STATUS } from "../models/Feedback.js";
import mongoose from "mongoose";

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listUsers(req, res) {
  const role = (req.query.role || "").toString().trim();
  const search = (req.query.search || "").toString().trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return res.json({
    users,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
  });
}

export async function blockUser(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true }).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}

export async function unblockUser(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true }).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}

export async function removeJob(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json({ job });
}

export async function listJobsAdmin(req, res) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const [itemsRaw, total] = await Promise.all([
    Job.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("recruiterId", "name email company")
      .lean(),
    Job.countDocuments({}),
  ]);

  const ids = itemsRaw.map((j) => j._id);
  const countRows =
    ids.length === 0
      ? []
      : await Application.aggregate([
          { $match: { jobId: { $in: ids } } },
          { $group: { _id: "$jobId", n: { $sum: 1 } } },
        ]);
  const countMap = Object.fromEntries(countRows.map((r) => [String(r._id), r.n]));
  const items = itemsRaw.map((j) => ({
    ...j,
    applicantCount: countMap[String(j._id)] || 0,
  }));

  return res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
    items,
  });
}

function weekSeriesAgg() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 56);
  return [
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          y: { $isoWeekYear: "$createdAt" },
          w: { $isoWeek: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.w": 1 } },
  ];
}

export async function analytics(req, res) {
  const [
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalJobs,
    totalApplications,
    topCompaniesAgg,
    mostAppliedAgg,
    jobsPerWeekAgg,
    registrationsPerWeekAgg,
    applicationsByCategoryAgg,
    recruiterActivityAgg,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "recruiter" }),
    User.countDocuments({ role: "candidate" }),
    Job.countDocuments({}),
    Application.countDocuments({}),
    Job.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "users",
          localField: "recruiterId",
          foreignField: "_id",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "apps",
        },
      },
      {
        $group: {
          _id: {
            $ifNull: ["$recruiter.company.name", "$recruiter.name"],
          },
          jobs: { $sum: 1 },
          applicants: { $sum: { $size: "$apps" } },
        },
      },
      { $match: { _id: { $nin: [null, ""] } } },
      { $sort: { jobs: -1 } },
      { $limit: 5 },
    ]),
    Application.aggregate([
      { $group: { _id: "$jobId", applications: { $sum: 1 } } },
      { $sort: { applications: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $project: { _id: 0, jobId: "$_id", applications: 1, title: "$job.title" } },
    ]),
    Job.aggregate(weekSeriesAgg()),
    User.aggregate(weekSeriesAgg()),
    Application.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $group: {
          _id: { $ifNull: ["$job.category", "Uncategorized"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    User.aggregate([
      { $match: { role: "recruiter" } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "recruiterId",
          as: "jobs",
        },
      },
      {
        $lookup: {
          from: "applications",
          let: { jids: "$jobs._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $gt: [{ $size: "$$jids" }, 0] }, { $in: ["$jobId", "$$jids"] }],
                },
              },
            },
          ],
          as: "allApps",
        },
      },
      {
        $addFields: {
          jobsPosted: { $size: "$jobs" },
          applicants: { $size: "$allApps" },
          lastJobAt: { $max: "$jobs.updatedAt" },
        },
      },
      {
        $project: {
          _id: 0,
          recruiterId: "$_id",
          name: 1,
          email: 1,
          jobsPosted: 1,
          applicants: 1,
          lastActive: {
            $cond: [{ $gt: ["$lastJobAt", "$updatedAt"] }, "$lastJobAt", "$updatedAt"],
          },
        },
      },
      { $sort: { applicants: -1, jobsPosted: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const topCompanies = topCompaniesAgg
    .filter((x) => x._id)
    .map((x) => ({
      company: x._id,
      jobs: x.jobs,
      applicants: x.applicants ?? 0,
    }));

  const formatWeek = (id) => {
    if (!id || id.w == null) return "?";
    return `W${String(id.w).padStart(2, "0")} ${id.y}`;
  };

  const mapWeekSeries = (rows) =>
    rows.map((r) => ({
      label: formatWeek(r._id),
      count: r.count,
      y: r._id?.y,
      w: r._id?.w,
    }));

  return res.json({
    totals: {
      totalUsers,
      totalRecruiters,
      totalJobSeekers: totalCandidates,
      totalJobsPosted: totalJobs,
      totalJobApplications: totalApplications,
    },
    topCompanies,
    mostAppliedJobs: mostAppliedAgg,
    jobsPerWeek: mapWeekSeries(jobsPerWeekAgg),
    registrationsPerWeek: mapWeekSeries(registrationsPerWeekAgg),
    applicationsByCategory: applicationsByCategoryAgg.map((r) => ({
      category: r._id || "Uncategorized",
      count: r.count,
    })),
    recruiterActivity: recruiterActivityAgg.map((r) => ({
      recruiterId: String(r.recruiterId),
      name: r.name,
      email: r.email,
      jobsPosted: r.jobsPosted,
      applicants: r.applicants,
      lastActive: r.lastActive || null,
    })),
  });
}

export async function listRecruiters(req, res) {
  const recruiters = await User.find({ role: "recruiter" }).sort({ updatedAt: -1 }).lean();
  const ids = recruiters.map((r) => r._id);
  if (!ids.length) return res.json({ recruiters: [] });

  const [jobRows, appRows] = await Promise.all([
    Job.aggregate([
      { $match: { recruiterId: { $in: ids } } },
      { $group: { _id: "$recruiterId", jobsPosted: { $sum: 1 } } },
    ]),
    Application.aggregate([
      { $lookup: { from: "jobs", localField: "jobId", foreignField: "_id", as: "job" } },
      { $unwind: "$job" },
      { $match: { "job.recruiterId": { $in: ids } } },
      { $group: { _id: "$job.recruiterId", applicants: { $sum: 1 } } },
    ]),
  ]);
  const jobMap = Object.fromEntries(jobRows.map((r) => [String(r._id), r.jobsPosted]));
  const appMap = Object.fromEntries(appRows.map((r) => [String(r._id), r.applicants]));

  const recruitersOut = recruiters.map((u) => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    company: u.company?.name || "",
    jobsPosted: jobMap[String(u._id)] || 0,
    applicants: appMap[String(u._id)] || 0,
    recruiterVerified: u.recruiterVerified !== false,
    isBlocked: !!u.isBlocked,
    moderationFlagged: !!u.moderationFlagged,
    updatedAt: u.updatedAt,
    createdAt: u.createdAt,
  }));

  return res.json({ recruiters: recruitersOut });
}

export async function verifyRecruiter(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  const user = await User.findById(id).lean();
  if (!user || user.role !== "recruiter") return res.status(404).json({ message: "Recruiter not found" });
  const updated = await User.findByIdAndUpdate(id, { recruiterVerified: true }, { new: true }).lean();
  return res.json({ user: updated });
}

export async function listApplicationsAdmin(req, res) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
  const skip = (page - 1) * limit;
  const emptyPaged = () =>
    res.json({ applications: [], total: 0, page: 1, pages: 1, limit });

  const filter = {};
  if (mongoose.isValidObjectId(req.query.jobId)) filter.jobId = req.query.jobId;
  if (mongoose.isValidObjectId(req.query.candidateId)) filter.candidateId = req.query.candidateId;
  if (req.query.recruiterId) {
    if (!mongoose.isValidObjectId(req.query.recruiterId)) {
      return emptyPaged();
    }
    const jobs = await Job.find({ recruiterId: req.query.recruiterId }).select("_id").lean();
    const jobIds = jobs.map((j) => j._id);
    filter.jobId = jobIds.length ? { $in: jobIds } : { $in: [] };
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "jobId",
        select: "title category location recruiterId",
        populate: { path: "recruiterId", select: "name company email" },
      })
      .populate("candidateId", "name email")
      .lean(),
    Application.countDocuments(filter),
  ]);

  return res.json({
    applications,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
  });
}

export async function listFeedbackAdmin(req, res) {
  const status = (req.query.status || "").toString().trim();
  const filter = {};
  if (status === FEEDBACK_STATUS.NEW || status === FEEDBACK_STATUS.RESOLVED) filter.status = status;
  const items = await Feedback.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  return res.json({ feedback: items });
}

export async function resolveFeedback(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
  const doc = await Feedback.findByIdAndUpdate(
    id,
    { status: FEEDBACK_STATUS.RESOLVED },
    { new: true }
  ).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ feedback: doc });
}

export async function deleteFeedback(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
  const doc = await Feedback.findByIdAndDelete(id).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ ok: true });
}

export async function moderationOverview(req, res) {
  const [flaggedJobs, pendingRecruiters, flaggedUsers] = await Promise.all([
    Job.find({ isFlagged: true })
      .sort({ updatedAt: -1 })
      .limit(30)
      .populate("recruiterId", "name email company")
      .lean(),
    User.find({ role: "recruiter", recruiterVerified: false }).sort({ createdAt: -1 }).limit(30).lean(),
    User.find({ moderationFlagged: true, role: { $ne: "admin" } })
      .sort({ updatedAt: -1 })
      .limit(30)
      .lean(),
  ]);
  return res.json({ flaggedJobs, pendingRecruiters, flaggedUsers });
}

export async function flagJob(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findByIdAndUpdate(id, { isFlagged: true }, { new: true }).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json({ job });
}

export async function unflagJob(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findByIdAndUpdate(id, { isFlagged: false }, { new: true }).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.json({ job });
}

export async function flagUser(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  if (String(id) === String(req.user.id)) return res.status(400).json({ message: "Cannot flag yourself" });
  const user = await User.findById(id).lean();
  if (!user || user.role === "admin") return res.status(404).json({ message: "User not found" });
  const updated = await User.findByIdAndUpdate(id, { moderationFlagged: true }, { new: true }).lean();
  return res.json({ user: updated });
}

export async function unflagUser(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  const updated = await User.findByIdAndUpdate(id, { moderationFlagged: false }, { new: true }).lean();
  if (!updated) return res.status(404).json({ message: "User not found" });
  return res.json({ user: updated });
}

export async function updateUserAdmin(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  const name = (req.body?.name || "").toString().trim();
  const email = (req.body?.email || "").toString().trim().toLowerCase();
  const patch = {};
  if (name.length) patch.name = name.slice(0, 80);
  if (email.length) {
    const taken = await User.findOne({ email, _id: { $ne: id } }).lean();
    if (taken) return res.status(409).json({ message: "Email already in use" });
    patch.email = email;
  }
  if (!Object.keys(patch).length) return res.status(400).json({ message: "No valid fields" });
  const user = await User.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}

export async function resetUserPassword(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  const password = (req.body?.password || "").toString();
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
  const passwordHash = await User.hashPassword(password);
  const user = await User.findByIdAndUpdate(id, { passwordHash }, { new: true }).select("-passwordHash").lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ ok: true });
}

export async function deleteUserAdmin(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });
  if (String(id) === String(req.user.id)) return res.status(400).json({ message: "Cannot delete your own account" });
  const user = await User.findById(id).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") {
    const admins = await User.countDocuments({ role: "admin" });
    if (admins <= 1) return res.status(400).json({ message: "Cannot delete the last admin" });
  }
  if (user.role === "recruiter") {
    const jobs = await Job.find({ recruiterId: id }).select("_id").lean();
    for (const j of jobs) {
      await Application.deleteMany({ jobId: j._id });
      await Job.findByIdAndDelete(j._id);
    }
  }
  await Application.deleteMany({ candidateId: id });
  await User.findByIdAndDelete(id);
  return res.json({ ok: true });
}

export async function deleteJobHard(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findById(id).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  await Application.deleteMany({ jobId: id });
  await Job.findByIdAndDelete(id);
  return res.json({ ok: true });
}

