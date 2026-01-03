import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";
import {
  getBanner,
  updateAnnouncementTexts,
  uploadBannerImage,
  toggleBanner,
  toggleAnnouncement
} from "../controllers/bannerController.js";

const bannerRouter = express.Router();

// Admin only
bannerRouter.get("/banner", adminAuth, getBanner);
bannerRouter.post("/announcement-texts", adminAuth, updateAnnouncementTexts);
bannerRouter.post("/banner-image", adminAuth, upload.single("image"), uploadBannerImage);
bannerRouter.post("/toggle-banner", adminAuth, toggleBanner);
bannerRouter.post("/toggle-announcement", adminAuth, toggleAnnouncement);

// Public
bannerRouter.get("/public", getBanner);

export default bannerRouter;
