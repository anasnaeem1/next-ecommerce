import mongoose from "mongoose";
import { connectDb } from "../../../config/db";

/**
 * Get Product model
 * @returns {Promise<Model>} Product model
 */
async function getProductModel() {
  await connectDb();
  return mongoose.models.Product;
}

/**
 * Validate input parameters
 * @param {string} productId - Product ID to validate
 * @param {Array} newVariants - Variants array to validate
 * @returns {Object|null} Error object if validation fails, null if valid
 */
export const validateInputs = (productId, newVariants) => {
  if (!productId || typeof productId !== 'string' || !productId.trim()) {
    return {
      success: false,
      message: "Product ID is required and must be a valid string",
      errorType: "VALIDATION_ERROR",
    };
  }

  if (!Array.isArray(newVariants)) {
    return {
      success: false,
      message: "Variants must be an array",
      errorType: "VALIDATION_ERROR",
    };
  }

  return null;
};

/**
 * Get Product model with error handling
 * @returns {Promise<Object>} Object with Product model or error
 */
export const getProductModelSafe = async () => {
  try {
    const Product = await getProductModel();
    if (!Product) {
      return {
        success: false,
        error: {
          success: false,
          message: "Database connection unavailable",
          errorType: "DATABASE_ERROR",
        },
      };
    }
    return { success: true, Product };
  } catch (dbError) {
    return {
      success: false,
      error: {
        success: false,
        message: "Database connection failed",
        errorType: "DATABASE_ERROR",
      },
    };
  }
};

/**
 * Fetch product from database
 * @param {Model} Product - Product model
 * @param {string} productId - Product uniqueId
 * @returns {Promise<Object>} Object with product or error
 */
export const fetchProduct = async (Product, productId) => {
  try {
    const product = await Product.findOne({ uniqueId: productId });
    if (!product) {
      return {
        success: false,
        error: {
          success: false,
          message: "Product not found",
          errorType: "NOT_FOUND",
        },
      };
    }
    return { success: true, product };
  } catch (findError) {
    return {
      success: false,
      error: {
        success: false,
        message: "Failed to find product",
        errorType: "DATABASE_ERROR",
      },
    };
  }
};

/**
 * Convert value to number (handles string inputs from forms)
 * @param {any} value - Value to convert
 * @param {number} defaultValue - Default value if conversion fails
 * @returns {number} Converted number
 */
export const convertToNumber = (value, defaultValue = 0) => {
  if (typeof value === 'number') {
    return value >= 0 ? value : defaultValue;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && parsed >= 0 ? parsed : defaultValue;
  }
  return defaultValue;
};

/**
 * Get value with fallback: use new value if provided, otherwise use old value, otherwise use default
 * @param {any} newValue - New value from frontend
 * @param {any} oldValue - Old value from database
 * @param {any} defaultValue - Default value if neither is provided
 * @returns {any} Final value to use
 */
const getValueWithFallback = (newValue, oldValue, defaultValue) => {
  // If new value is explicitly provided (not empty string, not null, not undefined)
  if (newValue !== undefined && newValue !== null && newValue !== '') {
    return newValue;
  }
  // Otherwise use old value if available
  if (oldValue !== undefined && oldValue !== null) {
    return oldValue;
  }
  // Otherwise use default
  return defaultValue;
};

/**
 * Validate size structure
 * @param {Object} newSize - Size object to validate
 * @param {number} sizeIndex - Index of the size
 * @param {string} variantColor - Color of the variant (for error messages)
 * @throws {Error} If size is invalid
 */
const validateSize = (newSize, sizeIndex, variantColor) => {
  if (!newSize || typeof newSize !== 'object') {
    throw new Error(`Invalid size at index ${sizeIndex} in variant "${variantColor}": must be an object`);
  }

  if (!newSize.size || typeof newSize.size !== 'string' || !newSize.size.trim()) {
    throw new Error(`Size at index ${sizeIndex} in variant "${variantColor}" is missing a valid size name`);
  }
};

/**
 * Build size object from new size data (unified function for both new and existing variants)
 * @param {Object} newSize - New size data from frontend
 * @param {Object} oldSize - Old size data from database (optional, for merging)
 * @param {number} sizeIndex - Index of the size
 * @param {string} variantColor - Color of the variant (for error messages)
 * @returns {Object} Formatted size object
 */
export const buildSize = (newSize, oldSize = null, sizeIndex = 0, variantColor = '') => {
  validateSize(newSize, sizeIndex, variantColor);

  const stockValue = convertToNumber(newSize.stock, 0);
  
  // Handle price: convert to number, preserve from old data if new value is 0
  const priceValue = (newSize.price && convertToNumber(newSize.price, 0) > 0)
    ? convertToNumber(newSize.price, 0)
    : convertToNumber(oldSize?.price, 0);

  // Handle isDefault: use new value if explicitly provided, otherwise preserve from old data
  const isDefault = newSize.hasOwnProperty('isDefault') 
    ? Boolean(newSize.isDefault) 
    : Boolean(oldSize?.isDefault || false);

  // Handle sku: use new value if provided, otherwise preserve from old data
  const sku = getValueWithFallback(newSize.sku, oldSize?.sku, '');

  return {
    size: String(newSize.size).trim(),
    stock: stockValue,
    sku,
    price: priceValue,
    isDefault,
  };
};

/**
 * Validate variant structure
 * @param {Object} newVariant - Variant object to validate
 * @param {number} variantIndex - Index of the variant
 * @throws {Error} If variant is invalid
 */
const validateVariant = (newVariant, variantIndex) => {
  if (!newVariant || typeof newVariant !== 'object') {
    throw new Error(`Invalid variant at index ${variantIndex}: must be an object`);
  }

  if (!Array.isArray(newVariant.sizes)) {
    throw new Error(`Variant "${newVariant.color || variantIndex}" has invalid sizes (must be an array)`);
  }
};

/**
 * Create lookup map from old variants for efficient merging
 * @param {Array} oldVariants - Old variants from database
 * @returns {Map} Map of variants and sizes by color/size name
 */
export const createOldVariantMap = (oldVariants) => {
  const oldVariantMap = new Map();
  oldVariants.forEach((v) => {
    const key = v.color?.toLowerCase().trim() || '';
    const sizeMap = new Map();
    (v.sizes || []).forEach((s) => {
      const sizeKey = s.size?.toLowerCase().trim() || '';
      sizeMap.set(sizeKey, s);
    });
    oldVariantMap.set(key, { variant: v, sizes: sizeMap });
  });
  return oldVariantMap;
};

/**
 * Build variant object from new variant data (unified function for both new and existing products)
 * @param {Object} newVariant - New variant data from frontend
 * @param {Map} oldVariantMap - Map of old variants (optional, for merging)
 * @param {number} variantIndex - Index of the variant
 * @returns {Object} Formatted variant object
 */
export const buildVariant = (newVariant, oldVariantMap = null, variantIndex = 0) => {
  validateVariant(newVariant, variantIndex);

  const variantKey = newVariant.color?.toLowerCase().trim() || '';
  const oldVariantData = oldVariantMap?.get(variantKey);
  const variantColor = newVariant.color || variantIndex;

  // Build sizes array
  const updatedSizes = newVariant.sizes.map((newSize, sizeIndex) => {
    const sizeKey = newSize.size?.toLowerCase().trim() || '';
    const oldSize = oldVariantData?.sizes?.get(sizeKey);
    return buildSize(newSize, oldSize, sizeIndex, variantColor);
  });

  // Handle isDefault: use new value if explicitly provided, otherwise preserve from old data
  const isDefault = newVariant.hasOwnProperty('isDefault') 
    ? Boolean(newVariant.isDefault) 
    : Boolean(oldVariantData?.variant?.isDefault || false);

  // Handle colorCode: use new value if provided, otherwise preserve from old data
  const colorCode = getValueWithFallback(newVariant.colorCode, oldVariantData?.variant?.colorCode, '');

  return {
    color: String(newVariant.color || '').trim(),
    colorCode: String(colorCode).trim(),
    isDefault,
    sizes: updatedSizes,
  };
};

/**
 * Build variants array (unified function handles both new and existing variants)
 * @param {Array} newVariants - New variants from frontend
 * @param {Array} oldVariants - Old variants from database
 * @returns {Object} Object with updatedVariants or error
 */
export const buildVariantsArray = (newVariants, oldVariants) => {
  try {
    const oldVariantMap = (oldVariants && oldVariants.length > 0) 
      ? createOldVariantMap(oldVariants) 
      : null;

    const updatedVariants = newVariants.map((newVariant, variantIndex) => 
      buildVariant(newVariant, oldVariantMap, variantIndex)
    );

    return { success: true, updatedVariants };
  } catch (buildError) {
    return {
      success: false,
      error: {
        success: false,
        message: buildError.message || "Failed to build variants array",
        errorType: "VALIDATION_ERROR",
      },
    };
  }
};

/**
 * Update product in database
 * @param {Model} Product - Product model
 * @param {string} productId - Product uniqueId
 * @param {Array} updatedVariants - Updated variants array
 * @param {number} totalStock - Total stock count
 * @returns {Promise<Object>} Object with updated product or error
 */
export const updateProductInDatabase = async (Product, productId, updatedVariants, totalStock) => {
  try {
    const updateResult = await Product.updateOne(
      { uniqueId: productId },
      {
        $set: {
          variants: updatedVariants,
          totalStock: totalStock,
        },
      },
      { runValidators: false }
    );

    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        error: {
          success: false,
          message: "Product not found",
          errorType: "NOT_FOUND",
        },
      };
    }

    const updatedProduct = await Product.findOne({ uniqueId: productId });
    if (!updatedProduct) {
      return {
        success: false,
        error: {
          success: false,
          message: "Failed to fetch updated product",
          errorType: "DATABASE_ERROR",
        },
      };
    }
    
    return { success: true, updatedProduct };
  } catch (saveError) {
    if (saveError.name === 'ValidationError') {
      const validationErrors = Object.values(saveError.errors || {}).map(err => err.message);
      return {
        success: false,
        error: {
          success: false,
          message: "Product validation failed",
          errorType: "VALIDATION_ERROR",
          errors: validationErrors,
          details: validationErrors.join("; "),
        },
      };
    }

    return {
      success: false,
      error: {
        success: false,
        message: saveError.message || "Failed to save product",
        errorType: "SAVE_ERROR",
      },
    };
  }
};

/**
 * Format product for response
 * @param {Object} product - Product document from database
 * @returns {Object} Plain JavaScript object
 */
export const formatProductForResponse = (product) => {
  if (!product) return null;
  return product.toObject ? product.toObject() : JSON.parse(JSON.stringify(product));
};

/**
 * Validate variants data structure
 * @param {Array} variants - Variants array to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateVariants = (variants) => {
  const errors = [];

  if (!Array.isArray(variants)) {
    return {
      isValid: false,
      errors: ["Variants must be an array"],
    };
  }

  if (variants.length === 0) {
    return {
      isValid: true,
      errors: [],
    };
  }

  // Check for duplicate colors
  const colorSet = new Set();
  variants.forEach((variant, index) => {
    if (!variant.color || typeof variant.color !== 'string' || !variant.color.trim()) {
      errors.push(`Variant at index ${index} is missing a valid color`);
    } else {
      const colorKey = variant.color.toLowerCase().trim();
      if (colorSet.has(colorKey)) {
        errors.push(`Duplicate color "${variant.color}" found at index ${index}`);
      }
      colorSet.add(colorKey);
    }

    if (!Array.isArray(variant.sizes)) {
      errors.push(`Variant "${variant.color || index}" has invalid sizes (must be an array)`);
    } else if (variant.sizes.length === 0) {
      errors.push(`Variant "${variant.color || index}" must have at least one size`);
    } else {
      // Check for duplicate sizes within variant
      const sizeSet = new Set();
      variant.sizes.forEach((size, sizeIndex) => {
        if (!size.size || typeof size.size !== 'string' || !size.size.trim()) {
          errors.push(`Variant "${variant.color || index}" has invalid size at index ${sizeIndex} (missing size name)`);
        } else {
          const sizeKey = size.size.toLowerCase().trim();
          if (sizeSet.has(sizeKey)) {
            errors.push(`Variant "${variant.color || index}" has duplicate size "${size.size}"`);
          }
          sizeSet.add(sizeKey);
        }

        // Validate stock - allow both number and string that can be converted to number
        const stockValue = typeof size.stock === 'number' ? size.stock : (typeof size.stock === 'string' ? parseFloat(size.stock) : NaN);
        if (isNaN(stockValue) || stockValue < 0) {
          errors.push(`Variant "${variant.color || index}" size "${size.size || sizeIndex}" has invalid stock (must be a number >= 0)`);
        }
      });
    }
  });

  // Check default variant rules
  const defaultVariants = variants.filter(v => v.isDefault === true);
  if (defaultVariants.length > 1) {
    errors.push("Only one color variant can be marked as default");
  }

  if (defaultVariants.length === 1) {
    const defaultVariant = defaultVariants[0];
    const defaultSizes = defaultVariant.sizes?.filter(s => s.isDefault === true) || [];
    if (defaultSizes.length === 0) {
      errors.push("The default color variant must have exactly one default size");
    } else if (defaultSizes.length > 1) {
      errors.push("The default color variant can only have one default size");
    }
  }

  // Check non-default variants don't have default sizes
  const nonDefaultVariants = variants.filter(v => v.isDefault !== true);
  nonDefaultVariants.forEach((variant) => {
    const hasDefaultSize = variant.sizes?.some(s => s.isDefault === true);
    if (hasDefaultSize) {
      errors.push(`Non-default color variant "${variant.color}" cannot have a default size`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

