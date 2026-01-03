// middleware/multer.js
import multer from "multer";
import fs from "fs";
import path from "path";

// Upload directory (project-root/uploads by default)
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads", "custom-design");

// ensure uploads dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// sanitize filename (very small, effective)
function sanitizeFilename(name = "") {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = sanitizeFilename(file.originalname);
    cb(null, `${ts}-${safe}`);
  },
});

// only allow images (basic filter)
function fileFilter(req, file, cb) {
  if (!file || !file.mimetype) return cb(null, false);
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  }
  cb(new Error("Only image uploads are allowed"));
}

const upload = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6 MB per file
    files: 6, // max files
  },
  fileFilter,
});

export default upload;
