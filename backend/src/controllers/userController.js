import path from "path";
import { User } from "../models/User.js";

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

