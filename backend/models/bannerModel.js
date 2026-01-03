import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  announcementActive: { type: Boolean, default: false },
  announcementTexts: { type: [String], default: [] },

  bannerActive: { type: Boolean, default: false },
  bannerImage: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Banner", bannerSchema);
