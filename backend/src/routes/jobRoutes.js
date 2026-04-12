import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createJob,
  updateJob,
  deleteJob,
  listJobs,
  getJob,
  listRecruiterJobs,
  getRecruiterDashboard,
  recommendedJobs,
} from "../controllers/jobController.js";

const router = express.Router();

router.get("/", listJobs);
router.get("/recommended", protect, requireRole("candidate"), recommendedJobs);
router.get("/mine/dashboard", protect, requireRole("recruiter", "admin"), getRecruiterDashboard);
router.get("/mine", protect, requireRole("recruiter", "admin"), listRecruiterJobs);
router.get("/:id", getJob);
router.post("/", protect, requireRole("recruiter", "admin"), createJob);
router.put("/:id", protect, requireRole("recruiter", "admin"), updateJob);
router.delete("/:id", protect, requireRole("recruiter", "admin"), deleteJob);

export default router;

