"use server";

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBufferToCloudinary(buffer, folder = "urban-buy") {

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url ?? null);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

/**
 * @param {Iterable<File | { image?: File }>} imagesInput
 * @returns {Promise<{ success: boolean; urls: string[]; error?: string }>}
 */
export async function uploadImagesToCloudinary(imagesInput) {
  const files = [];
  if (imagesInput == null) {
    return { success: false, urls: [], error: "No images provided" };
  }
  for (const item of imagesInput) {
    const file = item && typeof item === "object" && "image" in item ? item.image : item;
    if (file instanceof File && file.size > 0) {
      files.push(file);
    }
  }

  if (files.length === 0) {
    return { success: false, urls: [], error: "No valid image files" };
  }

  const urls = [];
  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadBufferToCloudinary(buffer);
      if (url) urls.push(url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  }

  if (urls.length === 0) {
    return { success: false, urls: [], error: "All uploads failed" };
  }

  return { success: true, urls };
}
