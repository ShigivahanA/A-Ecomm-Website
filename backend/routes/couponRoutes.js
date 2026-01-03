import express from "express";
import { applyCoupon,createCoupon,
  getCoupons,
  toggleCoupon } from "../controllers/couponController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const couponRouter = express.Router();

// Apply coupon (user must be logged in)
couponRouter.post("/apply", authUser, applyCoupon);

couponRouter.post("/create", adminAuth, createCoupon);
couponRouter.get("/list", adminAuth, getCoupons);
couponRouter.post("/toggle", adminAuth, toggleCoupon);


export default couponRouter;
