"use client";

import { useState } from "react";
import { ProductType } from "@/types";
// import { calculateVariantQuantity } from "../utils/variantCalculations";

interface VariantSelectorProps {
  product: ProductType;
  onVariantChange: (quantity: number, variantName: string) => void;
  calculationMethod?: 'sum' | 'average' | 'max' | 'first' | 'weighted' | 'percentage';
}

const VariantSelector = ({ 
  product, 
  onVariantChange, 
  calculationMethod = 'sum' 
}: VariantSelectorProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>("all");

  const handleVariantChange = (variantId: string) => {
    console.log('Variant ID:', variantId);
    // setSelectedVariant(variantId);
    // const result = calculateVariantQuantity(product, variantId, calculationMethod);
    // onVariantChange(result.quantity, result.name);
  };

  return (
    <div className="flex flex-col gap-1">
      <select
        value={selectedVariant}
        onChange={(e) => handleVariantChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white text-gray-700 hover:border-gray-300 transition-colors duration-200"
      >
        <option value="all">All Variants</option>
        {product.variants.map((variant) => (
          <option key={variant._id} value={variant._id}>
            {variant.color} ({variant.sizes?.length || 0} sizes)
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500">
        Method: {calculationMethod}
      </span>
    </div>
  );
};

export default VariantSelector;
