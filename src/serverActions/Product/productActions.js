"use server";
import { connectDb } from "../../../config/db.js";
import Product from "../../../models/Product.js";
import {deleteImageFromCloudinary} from "../../serverActions/cloudinary/deleteFromcloudinary.js"

const stringifyId = (value, fallback) =>
  value?.toString?.() ?? fallback ?? `${Date.now()}-${Math.random()}`;

const normalizeVariants = (variants = [], productId) =>
  variants.map((variant, variantIndex) => {
    const variantId = stringifyId(variant?._id ?? variant?.id, `${productId}-variant-${variantIndex}`);

    const sizes = Array.isArray(variant?.sizes)
      ? variant.sizes.map((size, sizeIndex) => {
          const sizeId = stringifyId(size?._id ?? size?.id, `${variantId}-size-${sizeIndex}`);
          return { ...size, _id: sizeId, id: sizeId };
        })
      : [];

    return { ...variant, _id: variantId, id: variantId, sizes };
  });

const normalizeProduct = (product) => {
  if (!product) return null;

  const productId = stringifyId(product._id ?? product.id ?? product.uniqueId, "product");

  return {
    ...product,
    _id: productId,
    id: productId,
    images: Array.isArray(product.images) ? product.images.map(String) : [],
    variants: normalizeVariants(product.variants, productId),
  };
};

export const getProduct = async (productId, productUniqueName) => {
  try {
    await connectDb();

    if (!productId && !productUniqueName) {
      return { success: false, message: "Provide productId or productUniqueName" };
    }

    const productQuery = productId ? { _id: productId } : { uniqueId: productUniqueName };
    const product = await Product.findOne(productQuery).lean();

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    return {
      success: true,
      product: normalizeProduct(product),
      message: "Product fetched successfully",
    };
  } catch (error) {
    console.error("Error getting product:", error);
    return { success: false, message: error.message };
  }
};

export const getProducts = async (category = null, size = null, color = null) => {
  try {
    await connectDb();
    let query = {};
    if (category && typeof category === 'string') {
   const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.category = new RegExp(`^${escapedCategory}(\\?|$)`, 'i');
    }

    const variantMatch = {};
    if (color && typeof color === "string") {
      const escapedColor = color.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      variantMatch.color = new RegExp(`^${escapedColor}$`, "i");
    }
    if (size && typeof size === "string") {
      const escapedSize = size.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      variantMatch.sizes = {
        $elemMatch: {
          size: new RegExp(`^${escapedSize}$`, "i"),
          stock: { $gt: 0 },
        },
      };
    }
    if (Object.keys(variantMatch).length > 0) {
      query.variants = { $elemMatch: variantMatch };
    }
    
    const products = await Product.find(query).lean();
    const sanitizedProducts = products.map((product) => normalizeProduct(product));
    return { success: true, products: sanitizedProducts, message: "Products fetched successfully" };
  } catch (error) {
    console.error("Error getting products:", error);
    return { success: false, message: error.message };
  }
};

export const getProductDetails = async (slug) => {
  try {
    if (!slug) {
      return { success: false, message: "Product slug is required" };
    }

    await connectDb();
    const productDoc = await Product.findOne({ uniqueId: slug }).lean();

    if (!productDoc) {
      return { success: false, message: "Product not found" };
    }

    const product = normalizeProduct(productDoc);

    return {
      success: true,
      product,
      images: product.images,
      variants: product.variants,
    };
  } catch (error) {
    console.error("Error getting product details:", error);
    return { success: false, message: error.message };
  }
};

export const deleteProduct = async (uniqueId) => {
  try {
    const product = await Product.findOne({ uniqueId })

    for (const image of product?.images || []) {
      const deletedImage = await deleteImageFromCloudinary(image);
      console.log(deletedImage)
      if(deletedImage.result == 'not found'){
        return { success: false, message: "Image not found" };
      }
    }

    await connectDb();
    const deleted = await Product.findOneAndDelete({ uniqueId });

    if (!deleted) {
      return { success: false, message: "Product not found" };
    }
    return { success: true, message: "Product deleted" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: error.message };
  }
};
