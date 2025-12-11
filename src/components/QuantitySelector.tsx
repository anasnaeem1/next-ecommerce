"use client";
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  defaultQuantity?: number;
  min?: number;
  max?: number;
  onQuantityChange?: (quantity: number) => void;
  variant?: "default" | "compact";
  showLabel?: boolean;
  className?: string;
}

const QuantitySelector = ({
  defaultQuantity = 1,
  min = 1,
  max,
  onQuantityChange,
  variant = "default",
  showLabel = true,
  className = "",
}: QuantitySelectorProps) => {
  const [qty, setQty] = useState(defaultQuantity);

  useEffect(() => {
    setQty(defaultQuantity);
  }, [defaultQuantity]);

  const increase = () => {
    const newQty = max ? Math.min(qty + 1, max) : qty + 1;
    setQty(newQty);
    onQuantityChange?.(newQty);
  };

  const decrease = () => {
    const newQty = Math.max(qty - 1, min);
    setQty(newQty);
    onQuantityChange?.(newQty);
  };

  const isCompact = variant === "compact";

  return (
    <div className={`${isCompact ? "" : "space-y-6 pt-4"} ${className}`}>
      {/* Quantity Selector */}
      <div className={`flex ${isCompact ? "items-center" : "flex-col gap-3"}`}>
        {showLabel && !isCompact && (
          <p className="text-sm font-medium text-gray-700">Quantity</p>
        )}
        <div className={`flex items-center ${isCompact ? "justify-center" : "gap-4"}`}>
          <div className={`flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden ${
            isCompact 
              ? "scale-90 sm:scale-100" 
              : "w-full sm:w-auto"
          }`}>
            <button
              type="button"
              onClick={decrease}
              disabled={qty <= min}
              className={`text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white ${
                isCompact
                  ? "px-2 py-1.5 sm:px-3 sm:py-2"
                  : "px-3 py-2.5 sm:px-4 sm:py-3"
              }`}
              aria-label="Decrease quantity"
            >
              <Minus size={isCompact ? 16 : 18} />
            </button>
            <div className={`text-gray-900 font-medium select-none text-center ${
              isCompact
                ? "px-3 py-1.5 sm:px-4 sm:py-2 min-w-[2rem] sm:min-w-[2.5rem] text-sm sm:text-base"
                : "px-4 py-2.5 sm:px-6 sm:py-3 min-w-[3rem] text-base"
            }`}>
              {qty}
            </div>
            <button
              type="button"
              onClick={increase}
              disabled={max !== undefined && qty >= max}
              className={`text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white ${
                isCompact
                  ? "px-2 py-1.5 sm:px-3 sm:py-2"
                  : "px-3 py-2.5 sm:px-4 sm:py-3"
              }`}
              aria-label="Increase quantity"
            >
              <Plus size={isCompact ? 16 : 18} />
            </button>
          </div>
        </div>
      </div>
      <input type="hidden" name="quantity" value={qty} />
    </div>
  );
};

export default QuantitySelector;
