import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).lean();
    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    if (user.isBlocked) {
      res.status(403);
      throw new Error("User is blocked");
    }
    req.user = { id: String(user._id), role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    res.status(res.statusCode !== 200 ? res.statusCode : 401);
    next(err);
  }
}

