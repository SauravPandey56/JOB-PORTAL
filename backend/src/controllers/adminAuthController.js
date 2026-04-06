import { User } from "../models/User.js";
import { signAccessToken } from "../utils/jwt.js";

export async function adminLogin(req, res) {
  const { username, password } = req.body || {};

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return res.status(500).json({ message: "Admin credentials not configured" });
  }

  if (username !== expectedUser || password !== expectedPass) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  // Ensure an admin user exists in DB (for auditability / consistency)
  const email = "admin@local.jobportal";
  let admin = await User.findOne({ email }).select("+passwordHash");
  if (!admin) {
    const passwordHash = await User.hashPassword(expectedPass);
    admin = await User.create({
      name: expectedUser,
      email,
      passwordHash,
      role: "admin",
    });
  }

  const token = signAccessToken(admin);
  return res.json({
    token,
    user: {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
}

