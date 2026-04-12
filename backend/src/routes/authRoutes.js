import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { EMAIL_REGEX, PASSWORD_POLICY_MESSAGE, isStrongPassword } from "../utils/authValidators.js";

const router = express.Router();

const emailField = body("email")
  .trim()
  .notEmpty()
  .withMessage("Please enter a valid email address.")
  .custom((v) => {
    if (!EMAIL_REGEX.test(v)) {
      throw new Error("Please enter a valid email address.");
    }
    return true;
  })
  .normalizeEmail();

const passwordRegister = body("password")
  .isString()
  .custom((value) => {
    if (!isStrongPassword(value)) {
      throw new Error(PASSWORD_POLICY_MESSAGE);
    }
    return true;
  });

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 80 }),
    emailField,
    passwordRegister,
    body("role").isIn(["recruiter", "candidate"]),
  ],
  register
);

router.post(
  "/login",
  [
    emailField,
    body("password").isString().isLength({ min: 1, max: 200 }).withMessage("Password is required."),
  ],
  login
);

router.get("/me", protect, me);

export default router;
