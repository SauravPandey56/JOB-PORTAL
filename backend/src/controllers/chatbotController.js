import { Job } from "../models/Job.js";

const canned = [
  {
    match: ["hi", "hello", "hey"],
    reply:
      "Hi! I’m the TalentOrbit assistant. You can ask me about searching jobs, applying, or recruiter/admin features.",
  },
  {
    match: ["apply", "application"],
    reply:
      "To apply: open a job → click “Apply now”. You can track status in Candidate Dashboard → Applications.",
  },
  {
    match: ["resume", "upload"],
    reply:
      "You can upload a PDF resume in Candidate Dashboard → My profile → Resume upload.",
  },
  {
    match: ["recruiter", "post job", "create job"],
    reply:
      "Recruiters can post jobs from Dashboard → My jobs → New job, then manage applicants per job.",
  },
  {
    match: ["admin", "panel"],
    reply:
      "Admin panel is at /admin after logging in via /admin/login. Admin can view analytics, block users, and deactivate jobs.",
  },
];

function normalize(s) {
  return (s || "").toString().trim().toLowerCase();
}

export async function chatbotMessage(req, res) {
  const text = normalize(req.body?.message);
  if (!text) return res.status(400).json({ message: "Message is required" });

  if (text.includes("how many jobs") || text.includes("total jobs")) {
    const totalJobs = await Job.countDocuments({ isActive: true });
    return res.json({ reply: `There are currently ${totalJobs} active jobs on TalentOrbit.` });
  }

  for (const c of canned) {
    if (c.match.some((m) => text.includes(m))) return res.json({ reply: c.reply });
  }

  return res.json({
    reply:
      "I can help with: job search filters (skills/category/location), applying, resume upload, recruiter job posting, and admin panel access. What do you want to do?",
  });
}

