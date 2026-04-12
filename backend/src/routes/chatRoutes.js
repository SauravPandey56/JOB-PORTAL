import express from "express";
import rateLimit from "express-rate-limit";
import { chatMessage } from "../controllers/chatController.js";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many chat messages. Try again in a minute." },
});

router.post("/", chatLimiter, chatMessage);

export default router;
