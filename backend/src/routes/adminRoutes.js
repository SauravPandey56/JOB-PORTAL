import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  analytics,
  listUsers,
  listJobsAdmin,
  listRecruiters,
  listApplicationsAdmin,
  listFeedbackAdmin,
  resolveFeedback,
  deleteFeedback,
  moderationOverview,
  verifyRecruiter,
  flagJob,
  unflagJob,
  flagUser,
  unflagUser,
  updateUserAdmin,
  resetUserPassword,
  deleteUserAdmin,
  deleteJobHard,
  blockUser,
  unblockUser,
  removeJob,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/analytics", analytics);
router.get("/jobs", listJobsAdmin);
router.get("/users", listUsers);
router.put("/users/:id", updateUserAdmin);
router.post("/users/:id/reset-password", resetUserPassword);
router.delete("/users/:id", deleteUserAdmin);
router.post("/users/:id/verify-recruiter", verifyRecruiter);
router.post("/users/:id/flag", flagUser);
router.post("/users/:id/unflag", unflagUser);
router.get("/recruiters", listRecruiters);
router.get("/applications", listApplicationsAdmin);
router.get("/feedback", listFeedbackAdmin);
router.post("/feedback/:id/resolve", resolveFeedback);
router.delete("/feedback/:id", deleteFeedback);
router.get("/moderation", moderationOverview);
router.post("/jobs/:id/flag", flagJob);
router.post("/jobs/:id/unflag", unflagJob);
router.delete("/jobs/:id/delete", deleteJobHard);
router.post("/users/:id/block", blockUser);
router.post("/users/:id/unblock", unblockUser);
router.post("/jobs/:id/remove", removeJob);

export default router;

