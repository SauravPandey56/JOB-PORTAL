import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import mongoose from "mongoose";

export async function listUsers(req, res) {
  const role = (req.query.role || "").toString().trim();
  const filter = {};
  if (role) filter.role = role;
  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  return res.json({ users });
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

export async function analytics(req, res) {
  const [
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalJobs,
    totalApplications,
    topCompaniesAgg,
    mostAppliedAgg,
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
        $group: {
          _id: "$recruiter.company.name",
          jobs: { $sum: 1 },
        },
      },
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
  ]);

  const topCompanies = topCompaniesAgg
    .filter((x) => x._id)
    .map((x) => ({ company: x._id, jobs: x.jobs }));

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
  });
}

