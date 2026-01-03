import Review from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose";

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, orderId, rating, comment } = req.body;

    const order = await orderModel.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
      "items.productId": new mongoose.Types.ObjectId(productId)
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can review only purchased products"
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      rating,
      comment
    });

    const stats = await Review.aggregate([
      { $match: { product: review.product } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    await productModel.findByIdAndUpdate(productId, {
      ratingAverage: stats[0].avgRating,
      ratingCount: stats[0].count
    });

    res.json({ success: true, message: "Review added" });

  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: false, message: "Already reviewed" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
};
