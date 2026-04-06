import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 80 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6, max: 100 }),
    body("role").isIn(["admin", "recruiter", "candidate"]),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().isLength({ min: 6, max: 100 })],
  login
);

router.get("/me", protect, me);

export default router;

