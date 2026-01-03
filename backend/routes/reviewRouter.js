import express from "express";
import authUser from "../middleware/auth.js";
import { addReview, getProductReviews } from "../controllers/reviewController.js";

const ReviewRouter = express.Router();

ReviewRouter.post("/add", authUser, addReview);
ReviewRouter.get("/product/:productId", getProductReviews);

export default ReviewRouter;
