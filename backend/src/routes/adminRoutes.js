import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { analytics, listUsers, blockUser, unblockUser, removeJob } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/analytics", analytics);
router.get("/users", listUsers);
router.post("/users/:id/block", blockUser);
router.post("/users/:id/unblock", unblockUser);
router.post("/jobs/:id/remove", removeJob);

export default router;

