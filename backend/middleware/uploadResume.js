// middleware/uploadResume.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

function sanitizeFilename(name = '') {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const original = file.originalname || 'resume';
    const ext = path.extname(original);
    const base = path.basename(original, ext);
    const safeBase = sanitizeFilename(base);
    cb(null, `${ts}-${safeBase}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!file || !file.mimetype) return cb(null, false);
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only PDF/DOC/DOCX resumes are allowed'));
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

export default upload;
