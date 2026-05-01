"use server";

import { connectDb } from "../../config/db.js";
import axios from "axios";
import Product from "../../models/Product.js";
import { calculateTotalStock } from "../utils/variantCalculations";

async function getProductModel() {
  await connectDb();
  return Product;
}

function productForClient(doc) {
  if (!doc) return doc;
  const p = { ...doc };
  if (p._id != null) p._id = String(p._id);
  if (p.createdAt instanceof Date) p.createdAt = p.createdAt.toISOString();
  if (p.updatedAt instanceof Date) p.updatedAt = p.updatedAt.toISOString();
  return p;
}

export const getFeaturedProduct = async () => {
  try {
    const Product = await getProductModel();
    const products = (await Product.find({ featured: true }).lean())
    .map(productForClient);
    return { success: true, products };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const getNewProducts = async () => {
  try {
    const Product = await getProductModel();
    const products = (await Product.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .lean()
  ).map(productForClient);
    return { success: true, products };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const AddProduct = async (productData) => {
  try {
    const Product = await getProductModel();
    const totalStock = Number(productData.totalStock) || 0;
    const price = Number(productData.price) || 0;
    const images = productData.images ?? productData.productImages;
    if (!Array.isArray(images) || images.length === 0) {
      return { success: false, message: "At least one image URL is required" };
    }

    let variants = productData.variants;
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      const stock = totalStock > 0 ? totalStock : 1;
      variants = [
        {
          color: "default",
          colorCode: "#000000",
          isDefault: true,
          sizes: [
            {
              size: "One Size",
              stock,
              sku: "",
              price: 0,
              isDefault: true,
            },
          ],
        },
      ];
    }

    const doc = {
      uniqueId: productData.uniqueId,
      productTitle: productData.productTitle,
      productDesc: productData.productDesc,
      images,
      category: productData.category,
      price,
      basePrice:
        productData.basePrice != null ? Number(productData.basePrice) : price,
      offerPrice: Number(productData.offerPrice) || 0,
      totalStock: totalStock > 0 ? totalStock : 1,
      variants,
    };

    const savingProduct = new Product(doc);
    const savedProduct = await savingProduct.save();

    return {
      success: true,
      product: productForClient(savedProduct.toObject({ flattenMaps: true })),
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllProducts = async () => {
  try {
    const Product = await getProductModel();
    const products = (await Product.find().lean()).map(productForClient);
    return { success: true, products };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getSingleProduct = async (slug) => {
  try {
    const productDetails = await axios.get(`/api/get-products/${slug}`);
    return { success: true, product: productDetails };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateProduct = async (input) => {
  try {
    const id = input?.id ?? input?.uniqueId;
    if (!id) {
      return { success: false, message: "id is required" };
    }

    const $set = Object.fromEntries(
      Object.entries({
        productTitle: input.title ?? input.productTitle,
        productDesc: input.description ?? input.productDesc,
        basePrice: input.basePrice,
        offerPrice: input.offerPrice,
        price: input.price,
        featured: input.featured,
        images: input.images,
      }).filter(([, v]) => v !== undefined)
    );
    if ($set.basePrice != null) $set.price = $set.basePrice;
    if ($set.price != null && $set.basePrice == null) $set.basePrice = $set.price;

    const Product = await getProductModel();
    const updated = await Product.findOneAndUpdate(
      { uniqueId: id },
      { $set },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return { success: false, message: "Product not found" };
    }
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateProductVariant = async ({ productId, variants }) => {
  try {
    if (!productId) {
      return { success: false, message: "productId is required" };
    }
    const totalStock = calculateTotalStock(variants || []);
    const Product = await getProductModel();
    const updated = await Product.findOneAndUpdate(
      { uniqueId: productId },
      { $set: { variants: variants || [], totalStock } },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) {
      return { success: false, message: "Product not found" };
    }
    return { success: true, product: productForClient(updated) };
  } catch (error) {
    return { success: false, message: error.message };
  }
};