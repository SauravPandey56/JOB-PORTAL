import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, trim: true, maxlength: 200, required: true },
    body: { type: String, trim: true, maxlength: 2000, default: "" },
    read: { type: Boolean, default: false, index: true },
    type: { type: String, trim: true, maxlength: 40, default: "info" },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
