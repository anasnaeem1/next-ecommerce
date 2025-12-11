/**
 * Deep serialization helper to convert MongoDB objects to plain JavaScript objects
 * This ensures all values are serializable for Client Components
 * Uses JSON.parse(JSON.stringify()) to completely strip MongoDB-specific properties
 */
export function serializeProduct(product: any) {
  if (!product) return null;

  try {
    // First, use JSON serialization to strip all non-serializable properties
    // This removes buffers, ObjectIds, and other MongoDB-specific types
    const serialized = JSON.parse(JSON.stringify(product));

    // Then create a clean object with only the fields we need
    // Explicitly convert all values to plain JavaScript types
    const cleanProduct = {
      productId: String(serialized.uniqueId || serialized._id || ''),
      productTitle: String(serialized.productTitle || ''),
      productDesc: String(serialized.productDesc || ''),
      basePrice: Number(serialized.basePrice || 0),
      offerPrice: serialized.offerPrice != null ? Number(serialized.offerPrice) : undefined,
      images: Array.isArray(serialized.images) 
        ? serialized.images.map((img: any) => {
            // Ensure each image is a string
            if (img == null) return '';
            return String(img);
          })
        : [],
      variants: Array.isArray(serialized.variants)
        ? serialized.variants.map((variant: any) => ({
            color: String(variant?.color || ''),
            colorCode: String(variant?.colorCode || ''),
            sizes: Array.isArray(variant?.sizes)
              ? variant.sizes.map((size: any) => ({
                  size: String(size?.size || ''),
                  stock: Number(size?.stock || 0),
                  sku: String(size?.sku || ''),
                  price: Number(size?.price || 0),
                }))
              : [],
          }))
        : [],
    };

    return cleanProduct;
  } catch (error) {
    console.error('Error serializing product:', error);
    return null;
  }
}

