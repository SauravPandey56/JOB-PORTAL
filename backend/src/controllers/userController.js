import path from "path";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Notification } from "../models/Notification.js";

export async function updateProfile(req, res) {
  const update = {};
  const allowed = [
     "name", "headline", "location", "phone", "skills", "qualification", "preferredCategory",
     "experience", "education", "projects", "certifications", "designation"
  ];
  for (const k of allowed) {
    if (req.body[k] !== undefined) update[k] = req.body[k];
  }
  
  if (req.body.socialLinks) {
     update.socialLinks = req.body.socialLinks;
  }
  
  if (req.body.company) {
     update.company = { ...req.body.company };
  }

  if (typeof update.skills === "string") {
    update.skills = update.skills.split(",").map((s) => s.trim()).filter(Boolean);
  }
  
  const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true }).lean();
  return res.json({ user });
}

export async function uploadImage(req, res) {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });
  const urlPath = `/uploads/images/${path.basename(req.file.path)}`.replaceAll("\\", "/");
  
  // Find out if they wanted to update avatar or company logo via query param?
  // By default, just update avatar. If type=company, update company.logoUrl.
  // We can also let the frontend receive the URL and then call updateProfile.
  // Return the URL so frontend can save it to the right place.
  const isCompany = req.query.type === 'company_banner' || req.query.type === 'company_logo';
  
  let updateObj = { avatarUrl: urlPath };
  if (req.query.type === 'company_logo') updateObj = { 'company.logoUrl': urlPath };
  if (req.query.type === 'company_banner') updateObj = { 'company.bannerUrl': urlPath };
  
  const user = await User.findByIdAndUpdate(req.user.id, { $set: updateObj }, { new: true }).lean();
  return res.json({ user, imageUrl: urlPath });
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

