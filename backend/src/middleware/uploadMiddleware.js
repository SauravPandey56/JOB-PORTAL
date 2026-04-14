import multer from "multer";
import path from "path";
import fs from "fs";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const root = process.env.UPLOAD_DIR || "uploads";
    const dir = path.join(root, "resumes");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = ext === ".pdf" ? ext : ".pdf";
    cb(null, `resume_${req.user?.id || "anon"}_${Date.now()}${safeExt}`);
  },
});

function fileFilter(req, file, cb) {
  const isPdf = file.mimetype === "application/pdf";
  if (!isPdf) return cb(new Error("Only PDF resumes are allowed"));
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("resume");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const root = process.env.UPLOAD_DIR || "uploads";
    const dir = path.join(root, "images");
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `img_${req.user?.id || "anon"}_${Date.now()}${ext}`);
  },
});

function imageFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images are allowed"));
  cb(null, true);
}

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");


