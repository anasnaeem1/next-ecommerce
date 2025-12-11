"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VariantSelector from "./VariantSelector";
import { ProductType } from "@/types";

interface InventoryRowProps {
  product: ProductType;
}

const InventoryRow = ({ product }: InventoryRowProps) => {
  const router = useRouter();
  const [currentQuantity, setCurrentQuantity] = useState(product.totalStock);
  const [currentVariantName, setCurrentVariantName] = useState("All Variants");

  const getStockLevel = (totalStock: number) => {
    if (totalStock <= 5) return { level: 'Low', color: 'bg-gray-50 text-gray-600 border border-gray-200' };
    if (totalStock <= 20) return { level: 'Medium', color: 'bg-gray-50 text-gray-600 border border-gray-200' };
    return { level: 'High', color: 'bg-gray-50 text-gray-600 border border-gray-200' };
  };

  const handleVariantChange = (quantity: number, variantName: string) => {
    setCurrentQuantity(quantity);
    setCurrentVariantName(variantName);
  };

  const handleUpdateClick = () => {
    router.push(`/admin/inventory/${product.uniqueId}`);
  };

  const stockInfo = getStockLevel(currentQuantity);

  return (
    <li className="p-4 w-full flex justify-between items-center border-t border-gray-200">
      <div className="flex items-center gap-4 w-2/5">
        <img
          src={product.images?.[0] || "/product.png"}
          alt={product.productTitle}
          width={100}
          height={100}
          className="object-cover rounded-md"
        />
        <h1 className="text-gray-700">{product.productTitle}</h1>
      </div>

      <div className="flex-none w-1/6">
        <h1 className="text-gray-600 text-sm">{product.uniqueId}</h1>
      </div>
      
      <div className="flex-none w-1/6">
        <VariantSelector 
          product={product} 
          onVariantChange={handleVariantChange}
          calculationMethod="sum"
        />
      </div>

      <div className="flex-none w-1/6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${stockInfo.color}`}>
              {stockInfo.level}
            </span>
            <span className="text-gray-600 font-medium">{currentQuantity}</span>
          </div>
          <span className="text-xs text-gray-500 truncate">{currentVariantName}</span>
        </div>
      </div>
      
      <div className="flex-none w-1/6">
        <button onClick={handleUpdateClick} className="bg-gray-600 gap-2 text-white py-2 px-4 rounded-lg flex items-center hover:bg-gray-700 transition duration-200">
          Update
          <img src="/visit.svg" className="w-4 h-4" alt="" />
        </button>
      </div>
    </li>
  );
};

export default InventoryRow;
