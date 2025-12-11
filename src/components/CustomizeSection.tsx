"use client";
import { useState, useEffect } from "react";
import { VariantType } from "@/types";

type CustomizeSectionProps = {
  variants: VariantType[];
  onSelectionChange?: (hasColor: boolean, hasSize: boolean) => void;
};

const CustomizeSection = ({ variants, onSelectionChange }: CustomizeSectionProps) => {
  const getDefaultSelection = () => {
    const defaultVariant = variants?.find((v) => v.isDefault === true);
    if (defaultVariant) {
      const defaultSize = defaultVariant.sizes?.find((s) => s.isDefault === true && s.stock > 0);
      if (defaultSize) {
        return {
          color: defaultVariant.color || "",
          size: defaultSize.size || "",
          variantId: defaultVariant._id?.toString() || defaultVariant.color || "",
        };
      }
    }
    return { color: "", size: "", variantId: "" };
  };

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedColor) {
      const defaultSelection = getDefaultSelection();
      if (defaultSelection.color) {
        setSelectedColor(defaultSelection.color);
        setSelectedSize(defaultSelection.size);
        setSelectedVariant(defaultSelection.variantId);
      }
    }
  }, [variants]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(!!selectedColor, !!selectedSize);
    }
  }, [selectedColor, selectedSize, onSelectionChange]);
  
  const handleColorSelect = (variant: VariantType) => {
    const variantStock = variant?.sizes?.reduce((total, size) => total + size.stock, 0) || 0;
    if (variantStock > 0) {
      setSelectedColor(variant?.color || "");
      setSelectedVariant(variant?._id?.toString() || variant?.color || "");
      
      const defaultSize = variant?.sizes?.find((s) => s.isDefault === true && s.stock > 0);
      if (defaultSize) {
        setSelectedSize(defaultSize.size || "");
      } else {
        setSelectedSize("");
      }
    }
  };

  const handleSizeSelect = (sizeItem: any, variantId: string) => {
    if (sizeItem.stock > 0) {
      setSelectedSize(sizeItem.size || "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-gray-700">Color</p>
        <div className="flex flex-wrap gap-3">
          {variants?.map((variant) => {
            const variantStock = variant?.sizes?.reduce((total, size) => total + size.stock, 0) || 0;
            
            return (
              <button
                type="button"
                onClick={() => handleColorSelect(variant)}
                disabled={variantStock <= 0}
                className={`relative p-1 rounded-full transition-all duration-200 ${
                  selectedColor === variant?.color && variantStock > 0
                    ? "ring-2 ring-gray-900 ring-offset-2"
                    : variantStock > 0
                    ? "ring-1 ring-gray-200 hover:ring-gray-300"
                    : "ring-1 ring-gray-200"
                } ${
                  variantStock <= 0 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                key={`${variant?.color}-${variant?.colorCode}-${variantStock}`}
                aria-label={`Select color ${variant?.color}${variantStock <= 0 ? " (out of stock)" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 border-gray-200 relative overflow-hidden ${
                    variantStock <= 0 ? "opacity-50 grayscale" : ""
                  }`}
                  style={{
                    backgroundColor: variant?.colorCode || '#e5e7eb',
                    transition: "all 0.2s ease",
                  }}
                >
                  {variantStock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <div className="w-full h-1 bg-gray-600 rotate-45 shadow-sm"></div>
                    </div>
                  )}
                </div>
                {selectedColor === variant?.color && variantStock > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center z-10">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-medium mb-1">Choose a size</p>
        {selectedColor && (
          <div className="flex flex-wrap gap-2">
            {variants
              ?.find((v) => v.color === selectedColor)
              ?.sizes?.map((sizeItem) => (
                <button
                  key={sizeItem.size}
                  type="button"
                  onClick={() => handleSizeSelect(sizeItem, selectedVariant)}
                  disabled={!sizeItem.stock || sizeItem.stock <= 0}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                    ${
                      selectedSize === sizeItem.size
                        ? "bg-gray-900 text-white shadow"
                        : sizeItem.stock > 0 && "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                    ${
                      !sizeItem.stock || sizeItem.stock <= 0
                        ? "opacity-50 cursor-not-allowed text-gray-500"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {sizeItem.size}
                </button>
              ))}
          </div>
        )}
        {!selectedColor && (
          <p className="text-sm text-gray-500">Please select a color first</p>
        )}
      </div>
      
      {/* Hidden form inputs */}
      <input type="hidden" name="color" value={selectedColor} />
      <input type="hidden" name="size" value={selectedSize} />
      <input type="hidden" name="variant" value={selectedVariant} />
    </div>
  );
};
export default CustomizeSection;
