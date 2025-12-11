"use server";
import { calculateTotalStock } from "../../utils/variantCalculations";
import {
  validateInputs,
  getProductModelSafe,
  fetchProduct,
  buildVariantsArray,
  updateProductInDatabase,
  formatProductForResponse,
  validateVariants,
} from "./savingVariant";

/**
 * Update product variants
 * @param {string} productId - The uniqueId of the product
 * @param {Array} variants - Array of variant objects with color and sizes
 * @param {number} totalStock - Total stock quantity
 * @returns {Object} Success status and updated product
 */
export const updateProductVariants = async (productId, variants, totalStock) => {
  try {
    const Product = await getProductModel();

    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { uniqueId: productId },
      {
        $set: {
          variants: variants,
          totalStock: totalStock,
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    const plainProduct = JSON.parse(JSON.stringify(updatedProduct));

    return {
      success: true,
      product: plainProduct,
    };
  } catch (error) {
    console.error("Error updating product variants:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Get product variants by product ID
 * @param {string} productId - The uniqueId of the product
 * @returns {Object} Success status and product variants
 */

export const getProductVariants = async (productId) => {
  try {
    const Product = await getProductModel();

    const product = await Product.findOne({ uniqueId: productId });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    return {
      success: true,
      variants: product.variants || [],
      totalStock: product.totalStock || 0,
    };
  } catch (error) {
    console.error("Error getting product variants:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Add a new variant to a product
 * @param {string} productId - The uniqueId of the product
 * @param {Object} variant - Variant object with color and sizes array
 * @returns {Object} Success status and updated product
 */

export const addVariantToProduct = async (productId, variant) => {
  try {
    const Product = await getProductModel();

    const product = await Product.findOne({ uniqueId: productId });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Add the new variant
    product.variants.push(variant);

    // Recalculate total stock
    product.totalStock = product.variants.reduce((total, variant) => {
      return (
        total +
        variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0)
      );
    }, 0);

    await product.save();
    
    // Get lean version for response
    const updatedProduct = await Product.findOne({ uniqueId: productId }).lean();

    // Ensure plain object
    const plainProduct = JSON.parse(JSON.stringify(updatedProduct));

    return {
      success: true,
      product: plainProduct,
    };
  } catch (error) {
    console.error("Error adding variant to product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Remove a variant from a product
 * @param {string} productId - The uniqueId of the product
 * @param {number} variantIndex - Index of the variant to remove
 * @returns {Object} Success status and updated product
 */
export const removeVariantFromProduct = async (productId, variantIndex) => {
  try {
    const Product = await getProductModel();

    const product = await Product.findOne({ uniqueId: productId });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Remove the variant at the specified index
    product.variants.splice(variantIndex, 1);

    // Recalculate total stock
    product.totalStock = product.variants.reduce((total, variant) => {
      return (
        total +
        variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0)
      );
    }, 0);

    await product.save();
    
    // Get lean version for response
    const updatedProduct = await Product.findOne({ uniqueId: productId }).lean();

    // Ensure plain object
    const plainProduct = JSON.parse(JSON.stringify(updatedProduct));

    return {
      success: true,
      product: plainProduct,
    };
  } catch (error) {
    console.error("Error removing variant from product:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Update size in a specific variant
 * @param {string} productId - The uniqueId of the product
 * @param {number} variantIndex - Index of the variant
 * @param {number} sizeIndex - Index of the size
 * @param {Object} sizeData - Updated size data
 * @returns {Object} Success status and updated product
 */
export const updateSizeInVariant = async (
  productId,
  variantIndex,
  sizeIndex,
  sizeData
) => {
  try {
    const Product = await getProductModel();

    const product = await Product.findOne({ uniqueId: productId });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Update the size
    product.variants[variantIndex].sizes[sizeIndex] = sizeData;

    // Recalculate total stock
    product.totalStock = product.variants.reduce((total, variant) => {
      return (
        total +
        variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0)
      );
    }, 0);

    await product.save();
    
    // Get lean version for response
    const updatedProduct = await Product.findOne({ uniqueId: productId }).lean();

    // Ensure plain object
    const plainProduct = JSON.parse(JSON.stringify(updatedProduct));

    return {
      success: true,
      product: plainProduct,
    };
  } catch (error) {
    console.error("Error updating size in variant:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Sync variants changes to database
 * Gets the whole product, creates a new variants array from frontend data, and updates the database
 * @param {string} productId - The uniqueId of the product
 * @param {Array} newVariants - Updated variants array from component
 * @returns {Object} Success status and result with detailed error messages
 */
export const saveVariantChanges = async (productId, newVariants) => {
  try {
    // Step 1: Validate input parameters
    const inputError = validateInputs(productId, newVariants);
    if (inputError) return inputError;

    // Step 2: Get Product model
    const modelResult = await getProductModelSafe();
    if (!modelResult.success) return modelResult.error;
    const { Product } = modelResult;

    // Step 3: Fetch product from database
    const productResult = await fetchProduct(Product, productId);
    if (!productResult.success) return productResult.error;
    const { product } = productResult;

    // Step 4: Get old variants and build new variants array
    const oldVariants = product.variants || [];

    const buildResult = buildVariantsArray(newVariants, oldVariants);
    if (!buildResult.success) return buildResult.error;
    const { updatedVariants } = buildResult;

    // Step 5: Validate the new variants array
    const validation = validateVariants(updatedVariants);
    if (!validation.isValid) {
      return {
        success: false,
        message: "Variants validation failed",
        errorType: "VALIDATION_ERROR",
        errors: validation.errors,
        details: validation.errors.join("; "),
      };
    }

    // Step 6: Calculate total stock
    const totalStock = calculateTotalStock(updatedVariants);
      if (typeof totalStock !== 'number' || totalStock < 0) {
      return {
        success: false,
        message: "Invalid total stock calculated",
        errorType: "CALCULATION_ERROR",
      };
    }

    // Step 7: Update product in database
    const updateResult = await updateProductInDatabase(Product, productId, updatedVariants, totalStock);
    if (!updateResult.success) return updateResult.error;
    const { updatedProduct } = updateResult;

    // Step 8: Format and return response
    const plainProduct = formatProductForResponse(updatedProduct);

    return {
      success: true,
      product: plainProduct,
      variants: plainProduct?.variants || updatedVariants,
      totalStock: totalStock,
      message: "Variants saved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      errorType: "UNEXPECTED_ERROR",
    };
  }
};

