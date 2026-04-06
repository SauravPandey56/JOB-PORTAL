import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { uploadResume as uploadResumeMw } from "../middleware/uploadMiddleware.js";
import { updateProfile, uploadResume } from "../controllers/userController.js";

const router = express.Router();

router.put("/me", protect, updateProfile);
router.post("/me/resume", protect, requireRole("candidate"), uploadResumeMw, uploadResume);

export default router;

