/**
 * Calculate total stock from variants array
 * This is a pure utility function (not a server action)
 * @param {Array} variants - Array of variant objects
 * @returns {number} Total stock count
 */
export const calculateTotalStock = (variants: any[]) => {
  if (!Array.isArray(variants)) return 0;

  return variants.reduce((total, variant) => {
    if (!variant.sizes || !Array.isArray(variant.sizes)) return total;
    return (
      total +
      variant.sizes.reduce((variantTotal: number, size: any) => variantTotal + (size.stock || 0), 0)
    );
  }, 0);
};
