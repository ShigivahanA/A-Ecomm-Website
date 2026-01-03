// middleware/multer.js
import multer from "multer";

// sanitize filename
function sanitizeFilename(name = "") {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

const storage = multer.memoryStorage();

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
    fileSize: 6 * 1024 * 1024, // 6 MB
    files: 6,
  },
  fileFilter,
});

export default upload;
