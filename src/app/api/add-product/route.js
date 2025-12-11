// app/api/add-product-images/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { AddProduct } from "../../../serverActions/product";

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
        resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const images = formData.getAll("images");

    const uploadedImageUrls = [];

    for (const image of images) {
      try {
        const buffer = await fileToBuffer(image);
        const url = await uploadToCloudinary(buffer, "urban-buy");
        if (url) uploadedImageUrls.push(url);
      } catch (err) {
        console.error("❌ Failed to upload image:", err);
      }
    }
    const rawVariants = formData.get("variants");
    let parsedVariants = [];

    try {
      parsedVariants = JSON.parse(rawVariants);
    } catch (e) {
      console.error("❌ Failed to parse variants:", e);
    }

    // If no variants provided, create a default variant with color "default" and size "small"
    let calculatedTotalStock = Number(formData.get("totalStock")) || 1;
    if (!parsedVariants || parsedVariants.length === 0) {
      const stock = calculatedTotalStock > 0 ? calculatedTotalStock : 1; // Ensure at least 1 stock
      
      parsedVariants = [{
        color: "default",
        colorCode: "#000000",
        isDefault: true,
        sizes: [{
          size: "small",
          stock: stock,
          sku: "",
          price: 0,
          isDefault: true
        }]
      }];
      
      // Ensure totalStock matches the variant stock
      calculatedTotalStock = stock;
    }

    const product = {
      uniqueId: formData.get("uniqueId"),
      productTitle: formData.get("productTitle"),
      productDesc: formData.get("productDesc"),
      images: uploadedImageUrls,
      category: formData.get("category"),
      totalStock: calculatedTotalStock,
      price: Number(formData.get("basePrice")), // Temporarily using price field for compatibility
      basePrice: Number(formData.get("basePrice")), // Also include basePrice
      offerPrice: Number(formData.get("offerPrice")),
      variants: parsedVariants,
    };

    if (uploadedImageUrls.length > 0) {
      const result = await AddProduct(product);

      if (result.success) {
        return NextResponse.json(
          { message: "✅ Product saved", product: result.product },
          { status: 200 }
        );
      } else {
        console.error("❌ Saving error:", result.message);
        return NextResponse.json(
          { message: "❌ Failed to save product", error: result.message },
          { status: 400 } // ✅ Changed from 500 to 400 for validation/mongo errors
        );
      }
    } else {
      return NextResponse.json(
        { message: "❌ No images were uploaded successfully" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

// export const POST = async () => {
//   const result = await addDummyProduct();
//   if (result.success) {
//     return NextResponse.json({
//       message: "Dummy product added",
//       product: result.product,
//     });
//   } else {
//     return NextResponse.json(
//       { message: result.message },
//       { status: 500 }
//     );
//   }
// };
