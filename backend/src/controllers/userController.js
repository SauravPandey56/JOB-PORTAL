import path from "path";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Notification } from "../models/Notification.js";

export async function updateProfile(req, res) {
  const update = {};
  const allowed = ["name", "skills", "qualification", "preferredCategory"];
  for (const k of allowed) {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  }
  if (typeof update.skills === "string") {
    update.skills = update.skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).lean();
  return res.json({ user });
}

export async function uploadResume(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const urlPath = `/uploads/resumes/${path.basename(req.file.path)}`.replaceAll("\\", "/");
  const resume = {
    url: urlPath,
    originalName: req.file.originalname,
    uploadedAt: new Date(),
  };
  const user = await User.findByIdAndUpdate(req.user.id, { resume }, { new: true }).lean();
  return res.json({ user });
}

const MAX_SAVED_JOBS = 200;

export async function listSavedJobs(req, res) {
  const user = await User.findById(req.user.id).populate("savedJobs").lean();
  const jobs = (user?.savedJobs || []).filter((j) => j && j.isActive !== false);
  return res.json({ jobs });
}

export async function saveJob(req, res) {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Invalid job id" });
  const job = await Job.findById(jobId).lean();
  if (!job?.isActive) return res.status(404).json({ message: "Job not found" });

  const u = await User.findById(req.user.id).select("savedJobs");
  if (!u) return res.status(404).json({ message: "User not found" });
  if (u.savedJobs.length >= MAX_SAVED_JOBS) return res.status(400).json({ message: "Saved jobs limit reached" });
  if (u.savedJobs.some((id) => String(id) === jobId)) return res.json({ ok: true });

  u.savedJobs.push(jobId);
  await u.save();
  return res.json({ ok: true });
}

export async function unsaveJob(req, res) {
  const { jobId } = req.params;
  if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ message: "Invalid job id" });
  await User.findByIdAndUpdate(req.user.id, { $pull: { savedJobs: jobId } });
  return res.json({ ok: true });
}

export async function listNotifications(req, res) {
  const items = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100).lean();
  return res.json({ notifications: items });
}

export async function markNotificationRead(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
  const doc = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { read: true },
    { new: true }
  ).lean();
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ notification: doc });
}

