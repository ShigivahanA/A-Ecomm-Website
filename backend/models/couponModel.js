import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    uppercase: true,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["PERCENT", "FLAT"],
    required: true
  },

  value: {
    type: Number,
    required: true
  },

  minCartAmount: {
    type: Number,
    default: 0
  },

  maxDiscount: {
    type: Number
  },

  expiry: {
    type: Date
  },

  usageLimit: {
    type: Number
  },

  usedCount: {
    type: Number,
    default: 0
  },

  perUserLimit: {
    type: Number,
    default: 1
  },

  firstOrderOnly: {
    type: Boolean,
    default: false
  },

  allowedPaymentMethods: {
    type: [String], // ["COD", "Razorpay"]
    default: []
  },

  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.models.coupon || mongoose.model("coupon", couponSchema);
