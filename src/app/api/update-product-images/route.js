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
    if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
      return null;
    }
    
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
    const imagesJson = formData.get("images"); // JSON array of {index, oldUrl}
    const oldImagesJson = formData.get("oldImages"); // JSON array of original image URLs

    if (!productId || !imagesJson || !oldImagesJson) {
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

    const imagesData = JSON.parse(imagesJson);
    const oldImages = JSON.parse(oldImagesJson);
    const finalImageUrls = [...oldImages];

    // Process each image change
    const uploadPromises = [];
    const deletePromises = [];

    for (const imageData of imagesData) {
      const { index, oldUrl } = imageData;
      
      // Get the file from FormData using the index
      const file = formData.get(`image_${index}`);
      
      if (file && file instanceof File) {
        const uploadPromise = (async () => {
          try {
            const buffer = await fileToBuffer(file);
            const uploadResult = await uploadToCloudinary(buffer, "urban-buy");
            
            if (uploadResult && uploadResult.secure_url) {
              finalImageUrls[index] = uploadResult.secure_url;
              
              // Delete old image from Cloudinary if it exists
              if (oldUrl && oldUrl.includes('cloudinary.com')) {
                const publicId = extractPublicId(oldUrl);
                if (publicId) {
                  deletePromises.push(deleteFromCloudinary(publicId));
                }
              }
              
              return { index, url: uploadResult.secure_url, success: true };
            }
            return { index, success: false };
          } catch (error) {
            console.error(`Error uploading image at index ${index}:`, error);
            return { index, success: false, error: error.message };
          }
        })();
        
        uploadPromises.push(uploadPromise);
      }
    }

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);
    
    // Check if all uploads were successful
    const failedUploads = uploadResults.filter(result => !result.success);
    if (failedUploads.length > 0) {
      return NextResponse.json(
        { success: false, message: "Some images failed to upload", failedUploads },
        { status: 500 }
      );
    }
    
    // Delete old images (non-blocking, but wait for completion)
    await Promise.all(deletePromises);

    // Update the product in the database
    await Product.findOneAndUpdate(
      { uniqueId: productId },
      { images: finalImageUrls },
      { new: true }
    );

    // Return only serializable data
    return NextResponse.json(
      { 
        success: true, 
        message: "Images updated successfully",
        images: finalImageUrls.map(img => String(img))
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

