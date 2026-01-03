import couponModel from "../models/couponModel.js";
import orderModel from "../models/orderModel.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code, cartAmount, paymentMethod } = req.body;
    const userId = req.body.userId;

    const coupon = await couponModel.findOne({
      code: code.toUpperCase(),
      active: true
    });

    if (!coupon) {
      return res.json({ success: false, message: "Invalid coupon code" });
    }

    // expiry check
    if (coupon.expiry && coupon.expiry < new Date()) {
      return res.json({ success: false, message: "Coupon expired" });
    }

    // cart minimum
    if (cartAmount < coupon.minCartAmount) {
      return res.json({
        success: false,
        message: `Minimum order value is ₹${coupon.minCartAmount}`
      });
    }

    // usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ success: false, message: "Coupon usage limit reached" });
    }

    // payment method restriction
    if (
      coupon.allowedPaymentMethods.length > 0 &&
      !coupon.allowedPaymentMethods.includes(paymentMethod)
    ) {
      return res.json({
        success: false,
        message: "Coupon not valid for this payment method"
      });
    }

    // per-user usage
    const userUsage = await orderModel.countDocuments({
      userId,
      "coupon.code": coupon.code
    });

    if (userUsage >= coupon.perUserLimit) {
      return res.json({
        success: false,
        message: "Coupon already used"
      });
    }

    // first order only
    if (coupon.firstOrderOnly) {
      const orderCount = await orderModel.countDocuments({ userId });
      if (orderCount > 0) {
        return res.json({
          success: false,
          message: "Coupon valid only for first order"
        });
      }
    }

    // calculate discount
    let discount = 0;

    if (coupon.type === "PERCENT") {
      discount = Math.round((cartAmount * coupon.value) / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.value;
    }

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount,
        type: coupon.type
      }
    });

  } catch (err) {
    console.error("applyCoupon:", err);
    res.json({ success: false, message: err.message });
  }
};


export const createCoupon = async (req, res) => {
  try {
    const coupon = new couponModel(req.body);
    await coupon.save();
    res.json({ success: true, message: "Coupon created" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getCoupons = async (req, res) => {
  const coupons = await couponModel.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
};

export const toggleCoupon = async (req, res) => {
  const { id } = req.body;

  const coupon = await couponModel.findById(id);
  if (!coupon) {
    return res.json({ success: false, message: "Coupon not found" });
  }

  coupon.active = !coupon.active;
  await coupon.save();

  res.json({
    success: true,
    message: coupon.active ? "Coupon enabled" : "Coupon disabled"
  });
};

