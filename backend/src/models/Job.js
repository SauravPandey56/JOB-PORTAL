import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 6000 },
    requiredSkills: { type: [String], default: [], index: true },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    experienceLevel: { type: String, trim: true }, // e.g. "0-1", "2-4", "5+"
    category: { type: String, trim: true, index: true },
    location: { type: String, trim: true, index: true },
    workMode: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      default: "onsite",
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    isFlagged: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", location: "text" });

export const Job = mongoose.model("Job", jobSchema);

