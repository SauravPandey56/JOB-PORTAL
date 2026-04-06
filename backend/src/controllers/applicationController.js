import mongoose from "mongoose";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { APPLICATION_STATUS } from "../utils/constants.js";

export async function applyToJob(req, res) {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findById(jobId).lean();
  if (!job || !job.isActive) return res.status(404).json({ message: "Job not found" });

  const application = await Application.create({
    jobId,
    candidateId: req.user.id,
    status: APPLICATION_STATUS.APPLIED,
    appliedDate: new Date(),
  }).catch((err) => {
    if (err?.code === 11000) return null;
    throw err;
  });

  if (!application) return res.status(409).json({ message: "Already applied" });
  return res.status(201).json({ application });
}

export async function myApplications(req, res) {
  const apps = await Application.find({ candidateId: req.user.id })
    .sort({ appliedDate: -1 })
    .populate({
      path: "jobId",
      select: "title category location salaryMin salaryMax recruiterId",
      populate: { path: "recruiterId", select: "name company" },
    })
    .lean();
  return res.json({ applications: apps });
}

export async function recruiterApplicants(req, res) {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findById(jobId).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiterId) !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const apps = await Application.find({ jobId })
    .sort({ appliedDate: -1 })
    .populate("candidateId", "name email skills qualification preferredCategory resume")
    .lean();
  return res.json({ applications: apps });
}

export async function updateApplicationStatus(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid application id" });

  const app = await Application.findById(id);
  if (!app) return res.status(404).json({ message: "Application not found" });

  const job = await Job.findById(app.jobId).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (String(job.recruiterId) !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  const status = (req.body.status || "").toString().toLowerCase();
  if (!Object.values(APPLICATION_STATUS).includes(status))
    return res.status(400).json({ message: "Invalid status" });

  app.status = status;
  await app.save();
  return res.json({ application: app });
}

