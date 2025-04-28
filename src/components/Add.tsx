"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCart from "./AddToCart";

const Add = () => {
  const [qty, setQty] = useState(1);

  const increase = () => setQty((prev) => prev + 1);
  const decrease = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex justify-between items-center">
      <div className=" flex flex-col gap-2">
        <p className="font-medium mb-1">Choose a Quantity</p>
        <div className="flex items-center ml-3">
          <div className="flex items-center rounded-full border border-gray-300 shadow-sm bg-white overflow-hidden">
            <button
              onClick={decrease}
              disabled={qty <= 1}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus size={18} />
            </button>
            <div className="px-5 py-2 text-base text-gray-800 font-semibold select-none">
              {qty}
            </div>
            <button
              onClick={increase}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
      <AddToCart />
    </div>
  );
};
export default Add;
