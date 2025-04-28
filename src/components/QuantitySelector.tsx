"use client";
import { useState } from "react";

type QuantityProps = {
  defaultQuantity: number;
  onChange?: (quantity: number) => void;
};

const QuantitySelector = ({ defaultQuantity, onChange }: QuantityProps) => {
  const [quantity, setQuantity] = useState(defaultQuantity);

  const decrease = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="text-gray-700 font-semibold w-1/5 text-center flex items-center justify-center gap-2">
      <button
        onClick={decrease}
        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300 flex items-center justify-center"
      >
        <div className="relative  w-[20px] h-[20px] flex items-center justify-center">
          <img
            src="/back.svg"
            className="w-full cursor-pointer h-full rounded-full"
            alt="navicon"
          />
        </div>
      </button>
      <span>{quantity}</span>
      <button
        onClick={increase}
        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300 flex items-center justify-center"
      >
        <div className="relative transform rotate-180 w-[20px] h-[20px] flex items-center justify-center">
          <img
            src="/back.svg"
            className="w-full cursor-pointer h-full rounded-full"
            alt="navicon"
          />
        </div>
      </button>
    </div>
  );
};

export default QuantitySelector;
