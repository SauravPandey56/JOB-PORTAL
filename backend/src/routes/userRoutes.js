import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { uploadResume as uploadResumeMw } from "../middleware/uploadMiddleware.js";
import {
  updateProfile,
  uploadResume,
  listSavedJobs,
  saveJob,
  unsaveJob,
  listNotifications,
  markNotificationRead,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/me", protect, updateProfile);
router.post("/me/resume", protect, requireRole("candidate"), uploadResumeMw, uploadResume);
router.get("/me/saved-jobs", protect, requireRole("candidate"), listSavedJobs);
router.post("/me/saved-jobs/:jobId", protect, requireRole("candidate"), saveJob);
router.delete("/me/saved-jobs/:jobId", protect, requireRole("candidate"), unsaveJob);
router.get("/me/notifications", protect, listNotifications);
router.patch("/me/notifications/:id/read", protect, markNotificationRead);

export default router;

