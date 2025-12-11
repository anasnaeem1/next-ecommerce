// server/AddReview.js
"use server";
import Review from "../../models/Review.js";
import { connectDb } from "../../config/db.js";

export async function AddReview(formData) {
  await connectDb();

  const productId = String(formData.get("productId") || "");
  const reviewOwner = String(formData.get("name") || "");
  const reviewOwnerEmail = String(formData.get("email") || "");
  const reviewText = String(formData.get("review") || "");
  const reviewStars = Number(formData.get("rating") || 5);

  try {
    const reviewDoc = new Review({
      productId,
      reviewOwner,
      reviewOwnerEmail,
      reviewText,
      reviewStars,
    });

    await reviewDoc.save();

    return { success: true };
  } catch (err) {
    console.error("AddReview failed:", err);
    return { success: false };
  }
}
