import mongoose, { Schema, models, model } from "mongoose";

const reviewSchema = new Schema(
  {
    reviewStars: { type: Number, required: true },
    reviewText: { type: String, required: true },
    reviewOwnerEmail: { type: String, required: true },
    reviewOwner: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// 👇 check if already compiled, otherwise compile
const Review = models?.Review || model("Review", reviewSchema);

export default Review;
