"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function parseCloudinaryUrl(url) {
  const parts = url.split("/");

  const fileWithExt = parts.pop(); // hccpglgn9u0qcx92jert.png
  const filename = "/" + fileWithExt;

  const uploadIndex = parts.indexOf("upload");

  // remove version (v123...)
  const pathParts = parts.slice(uploadIndex + 2);

  const publicId =
    [...pathParts, fileWithExt]
      .join("/")
      .replace(/\.[^/.]+$/, "");

  return {
    filename,   
    publicId,   
  };
}

export async function deleteImageFromCloudinary(imageUrl) {
  try {
    console.log(imageUrl)
    const { publicId } = parseCloudinaryUrl(imageUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("result of deleting attempt is", result)
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return null;
    
  }
}

