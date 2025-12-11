"use client";
import { useState } from "react";
import axios from "axios";

const AddRandomProduct = () => {
  const [isProductAdded, setIsProductAdded] = useState(false);

  const handleAddRandomProduct = async () => {
    try {
      const res = await axios.post("/api/add-random-product");
      if (res.status === 200) {
        setIsProductAdded(true);
        console.log("Random product added successfully");
      }
    } catch (error) {
      console.error("Failed to add random product", error);
    }
  };

  return (
    <button
      onClick={handleAddRandomProduct}
      className="bg-gray-500 text-white max-w-[200px] text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-gray-600 transition duration-200"
    >
      {isProductAdded ? "Product Added" : "Add Random Product"}
    </button>
  );
};

export default AddRandomProduct;
