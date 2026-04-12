import { Feedback, FEEDBACK_STATUS } from "../models/Feedback.js";

export async function submitFeedback(req, res) {
  const name = (req.body?.name || "").toString().trim().slice(0, 120);
  const email = (req.body?.email || "").toString().trim().slice(0, 200);
  const message = (req.body?.message || "").toString().trim();
  if (!message) return res.status(400).json({ message: "Message is required" });
  const doc = await Feedback.create({ name, email, message, status: FEEDBACK_STATUS.NEW });
  return res.status(201).json({ id: String(doc._id), ok: true });
}
