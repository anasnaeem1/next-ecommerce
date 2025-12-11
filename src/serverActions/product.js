"use server";

import { connectDb } from "../../config/db.js";
import axios from "axios";
import mongoose from "mongoose";

async function getProductModel() {
  await connectDb();
  return mongoose.models.Product;
}

export const addDummyProduct = async () => {
  try {
    const Product = await getProaductModel();

    const dummyProduct = new Product({
      uniqueId: "DEMO-001",
      productTitle: "Demo Sneakers",
      productDesc: "Comfortable and stylish demo sneakers for testing.",
      images: [
        "https://via.placeholder.com/300x300.png?text=Demo+Image+1",
        "https://via.placeholder.com/300x300.png?text=Demo+Image+2",
      ],
      category: "Footwear",
      price: 120,
      basePrice: 120,
      offerPrice: 89.99,
      totalStock: 50,
      variants: [{
        color: "Default",
        colorCode: "#000000",
        sizes: [{
          size: "One Size",
          stock: 50,
          sku: "DEMO-001-DEFAULT",
          price: 0
        }]
      }]
    });

    const savedProduct = await dummyProduct.save();

    return { success: true, product: savedProduct };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const AddProduct = async (product) => {
  try {
    console.log("you just send this product", product);
    const Product = await getProductModel();

    const savingProduct = new Product(product);

    const savedProduct = await savingProduct.save();

    return { success: true, product: savedProduct };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getAllProducts = async () => {
  try {
    const Product = await getProductModel();
    const products = await Product.find();
    return { success: true, products: products };
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

export const updateProduct = async (product) => {
  try {
    const Product = await getProductModel();
    
    // Find the product by uniqueId since that's what we're using
    const updatedProduct = await Product.findOneAndUpdate(
      { uniqueId: product.uniqueId || product._id },
      product,
      { new: true }
    ).lean();
    
    if (!updatedProduct) {
      return { success: false, message: 'Product not found' };
    }
    
    // Serialize the product to ensure it's a plain object
    // Don't return the full product object to avoid serialization issues
    return { 
      success: true, 
      // Only return essential data, not the full MongoDB object
      message: 'Product updated successfully'
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, message: error.message };
  }
};