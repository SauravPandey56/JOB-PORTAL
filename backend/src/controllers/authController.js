import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import { signAccessToken } from "../utils/jwt.js";

function pickPublicUser(u) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    skills: u.skills ?? [],
    qualification: u.qualification ?? "",
    preferredCategory: u.preferredCategory ?? "",
    resume: u.resume ?? null,
    company: u.company ?? null,
    createdAt: u.createdAt,
  };
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    name,
    email,
    password,
    role,
    skills,
    qualification,
    preferredCategory,
    companyName,
    companyDescription,
  } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    skills: Array.isArray(skills)
      ? skills
      : typeof skills === "string" && skills.length
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    qualification,
    preferredCategory,
    company:
      role === "recruiter"
        ? { name: companyName?.trim(), description: companyDescription?.trim() }
        : undefined,
  });

  const token = signAccessToken(user);
  return res.status(201).json({ token, user: pickPublicUser(user) });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.isBlocked) return res.status(403).json({ message: "User is blocked" });

  const ok = await user.verifyPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signAccessToken(user);
  return res.json({ token, user: pickPublicUser(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user: pickPublicUser(user) });
}

