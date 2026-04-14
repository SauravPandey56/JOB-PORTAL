import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../utils/constants.js";

const userSocialSchema = new mongoose.Schema(
  {
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    portfolio: { type: String, trim: true },
  },
  { _id: false }
);

const recruiterCompanySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    logoUrl: { type: String, trim: true },
    bannerUrl: { type: String, trim: true },
    size: { type: String, trim: true },
    industry: { type: String, trim: true },
    culture: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
    },
    // Generic profile
    avatarUrl: { type: String, trim: true },
    headline: { type: String, trim: true },
    location: { type: String, trim: true },
    phone: { type: String, trim: true },
    socialLinks: { type: userSocialSchema, default: {} },

    // Candidate profile
    skills: { type: [String], default: [] },
    qualification: { type: String, trim: true },
    preferredCategory: { type: String, trim: true },
    experience: { type: mongoose.Schema.Types.Mixed, default: [] },
    education: { type: mongoose.Schema.Types.Mixed, default: [] },
    projects: { type: mongoose.Schema.Types.Mixed, default: [] },
    certifications: { type: mongoose.Schema.Types.Mixed, default: [] },

    resume: {
      url: { type: String },
      originalName: { type: String },
      uploadedAt: { type: Date },
    },

    // Recruiter profile
    designation: { type: String, trim: true },
    company: { type: recruiterCompanySchema, default: {} },

    /** Candidate bookmarked jobs (max enforced in controller) */
    savedJobs: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      default: [],
    },

    isBlocked: { type: Boolean, default: false, index: true },
    /** Recruiters pending admin verification; true/undefined = verified for legacy users */
    recruiterVerified: { type: Boolean, default: true, index: true },
    /** Moderation queue for reported accounts (non-admin) */
    moderationFlagged: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = async function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
};

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);

