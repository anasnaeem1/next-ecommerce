import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { connectDb } from "../../../../config/db.js";
import mongoose from "mongoose";

// Setup Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fileToBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

// Extract public_id from Cloudinary URL
function extractPublicId(url) {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{filename}.{format}
    // or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{filename}.{format}
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get all parts after 'upload'
    const afterUpload = urlParts.slice(uploadIndex + 1);
    if (afterUpload.length === 0) return null;
    
    // If there's a version (v1234567890), skip it
    let startIndex = 0;
    if (afterUpload.length > 0 && /^v\d+$/.test(afterUpload[0])) {
      startIndex = 1;
    }
    
    // Get all remaining parts (folder + filename)
    const publicIdParts = afterUpload.slice(startIndex);
    if (publicIdParts.length === 0) return null;
    
    // Join all parts and remove file extension
    const publicIdWithExt = publicIdParts.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

// Delete image from Cloudinary
async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return { success: false, message: 'No public_id provided' };
    
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === 'ok', result };
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return { success: false, message: error.message };
  }
}

export const POST = async (req) => {
  try {
    await connectDb();
    const Product = mongoose.models.Product;
    
    const formData = await req.formData();
    const productId = formData.get("productId");
    const imageIndex = parseInt(formData.get("imageIndex"));
    const oldImageUrl = formData.get("oldImageUrl");
    const newImage = formData.get("newImage");

    if (!productId || imageIndex === null || !newImage) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the product
    const product = await Product.findOne({ uniqueId: productId });
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Upload new image to Cloudinary
    const buffer = await fileToBuffer(newImage);
    const uploadResult = await uploadToCloudinary(buffer, "urban-buy");
    
    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { success: false, message: "Failed to upload new image" },
        { status: 500 }
      );
    }

    const newImageUrl = uploadResult.secure_url;

    // Delete old image from Cloudinary if it exists and is a Cloudinary URL
    if (oldImageUrl && oldImageUrl.includes('cloudinary.com')) {
      const publicId = extractPublicId(oldImageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    // Update the image in the database
    const updatedImages = [...product.images];
    updatedImages[imageIndex] = newImageUrl;

    const updatedProduct = await Product.findOneAndUpdate(
      { uniqueId: productId },
      { images: updatedImages },
      { new: true }
    ).lean();

    return NextResponse.json(
      { 
        success: true, 
        message: "Image updated successfully",
        imageUrl: newImageUrl,
        product: updatedProduct
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};

