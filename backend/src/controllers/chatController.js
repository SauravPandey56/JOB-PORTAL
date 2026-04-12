/**
 * TalentOrbit Assistant — rule-based support for the job portal. POST /api/chat
 */

import { Job } from "../models/Job.js";

const GREETING_REPLY =
  "Hello 👋 I'm the TalentOrbit help bot. I can assist with job searching, applying for jobs, uploading resumes, recruiter job postings, and tracking applications. How can I help you today?";

const OFF_TOPIC_REPLY =
  "I specialize in TalentOrbit—things like job search, accounts, applications, resumes, and recruiter tools. I can’t help with that topic here. Ask me about the platform, or contact TalentOrbit support if you need something else.";

const UNKNOWN_REPLY =
  "I don’t have that answer in my guides. Please contact TalentOrbit support for personal or account-specific help. Meanwhile, try asking about job search, logging in, applying, your resume, or posting a job as a recruiter.";

const REFUSE_HARMFUL_REPLY =
  "I can’t help with that. I’m here only for safe, legitimate TalentOrbit job-portal support—searching jobs, applications, profiles, and hiring tools.";

/** Obvious non-platform or unsafe topics (substring match). */
const OFF_TOPIC_MARKERS = [
  "weather",
  "lottery",
  "crypto invest",
  "bitcoin price",
  "tell me a joke",
  "write a poem",
  "who won the",
  "recipe for",
  "diagnose me",
  "legal advice",
  "hack into",
  "bypass password",
  "fake resume lie",
];

const HARMFUL_MARKERS = [
  "bomb",
  "weapon",
  "hack account",
  "steal password",
  "ddos",
  "ransomware",
  "illegal drug",
];

/** If present, user is asking about the platform (don’t treat as greeting-only). */
const PORTAL_HINTS = [
  "job",
  "apply",
  "application",
  "resume",
  "cv",
  "login",
  "log in",
  "sign up",
  "signup",
  "register",
  "account",
  "password",
  "recruit",
  "employer",
  "post job",
  "dashboard",
  "profile",
  "admin",
  "filter",
  "search",
  "upload",
  "applicant",
  "candidate",
  "interview",
  "salary",
  "remote",
  "support",
  "help with",
  "how many job",
  "track",
];

function normalize(s) {
  return (s || "").toString().trim().toLowerCase();
}

function isGreetingOnly(msg) {
  if (msg.length > 55) return false;
  if (PORTAL_HINTS.some((h) => msg.includes(h))) return false;
  return /\b(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings|gm)\b/.test(msg);
}

/** @type {{ keywords: string[]; reply: string }[]} */
const PORTAL_RULES = [
  {
    keywords: ["thank", "thanks", "thx", "appreciate"],
    reply: "You’re welcome! If you need anything else about TalentOrbit, I’m here.",
  },
  {
    keywords: ["search", "find job", "browse job", "job list", "filter", "vacancy", "looking for job"],
    reply:
      "Use Jobs in the navigation, then search and filters (skills, category, location) to narrow results. Open a listing for full details.",
  },
  {
    keywords: ["apply", "application", "how do i apply"],
    reply:
      "Sign in as a candidate, open a role, and tap Apply now. Track submissions under Dashboard → Applications.",
  },
  {
    keywords: ["status", "pending", "shortlisted", "rejected", "application status", "track application"],
    reply:
      "Go to Dashboard → Applications to see each application and its status (e.g. pending, reviewed, shortlisted).",
  },
  {
    keywords: ["resume", "cv", "upload resume", "document"],
    reply:
      "Candidates: Dashboard → My profile (or Profile). Upload a PDF resume and keep it current before you apply.",
  },
  {
    keywords: ["profile", "edit profile", "my details", "update profile"],
    reply:
      "Signed-in candidates can update contact info, skills, and resume from Dashboard / Profile—save before applying again.",
  },
  {
    keywords: ["sign up", "signup", "register", "create account", "new account"],
    reply:
      "Choose Sign up, pick Candidate or Recruiter, complete the form, then log in with the same email and password.",
  },
  {
    keywords: ["login", "log in", "sign in", "cannot log", "can't log", "forgot password"],
    reply:
      "Use Login with your email and password. If you forgot your password, use the reset option on the login page or contact TalentOrbit support.",
  },
  {
    keywords: ["recruiter", "employer", "hiring", "post a job", "post job", "create job", "new job", "publish job"],
    reply:
      "Recruiters: sign in as Recruiter → Dashboard → My jobs → New job. Edit listings and review applicants from there.",
  },
  {
    keywords: ["applicant", "candidate list", "who applied"],
    reply:
      "Open My jobs, select a posting, and view applicants. Updating status keeps candidates informed.",
  },
  {
    keywords: ["admin", "moderat", "block user", "analytics", "admin panel"],
    reply:
      "Admins sign in at /admin/login to manage users, jobs, and site overview. Candidates and recruiters don’t use this area.",
  },
  {
    keywords: ["tip", "resume tip", "interview", "cover letter"],
    reply:
      "Tailor your resume to the role, use clear bullets with outcomes, and mirror keywords from the posting. For interviews, prepare examples of past work.",
  },
  {
    keywords: ["contact", "support", "reach you", "customer service", "bug", "broken"],
    reply:
      "For billing, account access, or bugs, contact TalentOrbit support through the site’s contact option or your administrator. I explain how features work.",
  },
  {
    keywords: ["salary", "pay", "compensation", "full time", "part time", "contract"],
    reply:
      "Pay and work arrangement are set per job by the recruiter—read each posting. Use Jobs filters when available.",
  },
];

export async function chatMessage(req, res) {
  const message = normalize(req.body?.message);
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    if (HARMFUL_MARKERS.some((m) => message.includes(m))) {
      return res.json({ reply: REFUSE_HARMFUL_REPLY });
    }

    if (
      message.includes("how many job") ||
      message.includes("total job") ||
      message.includes("number of job") ||
      message.includes("active job")
    ) {
      const totalJobs = await Job.countDocuments({ isActive: true });
      return res.json({
        reply: `Right now TalentOrbit shows ${totalJobs} active listing${totalJobs === 1 ? "" : "s"}. Open Jobs to browse.`,
      });
    }

    for (const rule of PORTAL_RULES) {
      if (rule.keywords.some((k) => message.includes(k))) {
        return res.json({ reply: rule.reply });
      }
    }

    if (isGreetingOnly(message)) {
      return res.json({ reply: GREETING_REPLY });
    }

    if (OFF_TOPIC_MARKERS.some((m) => message.includes(m))) {
      return res.json({ reply: OFF_TOPIC_REPLY });
    }

    return res.json({ reply: UNKNOWN_REPLY });
  } catch (e) {
    return res.status(500).json({
      message: e?.message || "Something went wrong. Please try again or contact TalentOrbit support.",
    });
  }
}
