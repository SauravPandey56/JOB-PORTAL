import mongoose from "mongoose";

const FEEDBACK_STATUS = Object.freeze({
  NEW: "new",
  RESOLVED: "resolved",
});

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 8000, required: true },
    status: {
      type: String,
      enum: Object.values(FEEDBACK_STATUS),
      default: FEEDBACK_STATUS.NEW,
      index: true,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
export { FEEDBACK_STATUS };
