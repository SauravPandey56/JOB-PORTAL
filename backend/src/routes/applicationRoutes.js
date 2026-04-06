import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  applyToJob,
  myApplications,
  recruiterApplicants,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply/:jobId", protect, requireRole("candidate"), applyToJob);
router.get("/me", protect, requireRole("candidate"), myApplications);
router.get("/job/:jobId", protect, requireRole("recruiter", "admin"), recruiterApplicants);
router.put("/:id/status", protect, requireRole("recruiter", "admin"), updateApplicationStatus);

export default router;

