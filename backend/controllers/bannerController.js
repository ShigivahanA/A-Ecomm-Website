import Banner from "../models/bannerModel.js";
import { v2 as cloudinary } from "cloudinary";

// helper: always get or create single banner doc
const getOrCreateBanner = async () => {
  let banner = await Banner.findOne();
  if (!banner) banner = await Banner.create({});
  return banner;
};

export const getBanner = async (req, res) => {
  const banner = await getOrCreateBanner();
  res.json({ success: true, banner });
};

// Text announcement
// controllers/bannerController.js
export const updateAnnouncementTexts = async (req, res) => {
  try {
    const { texts } = req.body; // array of strings

    if (!Array.isArray(texts)) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const banner = await Banner.findOne() || new Banner();
    banner.announcementTexts = texts.filter(t => t.trim());
    await banner.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


// Upload banner image
export const uploadBannerImage = async (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: "No image uploaded" });
  }

  const uploaded = await cloudinary.uploader.upload(req.file.path);
  const banner = await getOrCreateBanner();
  banner.bannerImage = uploaded.secure_url;
  banner.updatedAt = Date.now();
  await banner.save();

  res.json({ success: true });
};

export const toggleBanner = async (req, res) => {
  const banner = await getOrCreateBanner();
  banner.bannerActive = !banner.bannerActive;
  await banner.save();
  res.json({ success: true, active: banner.bannerActive });
};

export const toggleAnnouncement = async (req, res) => {
  const banner = await getOrCreateBanner();
  banner.announcementActive = !banner.announcementActive;
  await banner.save();
  res.json({ success: true, active: banner.announcementActive });
};
