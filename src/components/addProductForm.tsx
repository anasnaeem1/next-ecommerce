"use client";
import React, { useState } from "react";
// import axios from "axios";
import FilesUploader from "./filesUploader";
import CategorySelector from "./CategorySelector";
import { AddProduct } from "@/serverActions/product";
import { uploadImagesToCloudinary } from "../serverActions/cloudinary/uploadToCloudinary";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
  const [productAdded, setProductAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    try {
      setIsProcessing(true);
      const formData = new FormData(e.currentTarget);

      const imageFiles: File[] = [];
      const image1 = formData.get("productImage1");
      const image2 = formData.get("productImage2");
      const image3 = formData.get("productImage3");
      const image4 = formData.get("productImage4");

      if (image1 instanceof File && image1.size > 0) imageFiles.push(image1);
      if (image2 instanceof File && image2.size > 0) imageFiles.push(image2);
      if (image3 instanceof File && image3.size > 0) imageFiles.push(image3);
      if (image4 instanceof File && image4.size > 0) imageFiles.push(image4);

      const uploadResult = await uploadImagesToCloudinary(imageFiles);
      if (!uploadResult.success) {
        alert(uploadResult.error ?? "Image upload failed");
        return;
      }
      const uploadedImageUrls = uploadResult.urls;

      const rawVariants = formData.get("variants");
      let parsedVariants: unknown[] = [];
      if (
        rawVariants != null &&
        typeof rawVariants === "string" &&
        rawVariants.trim() !== ""
      ) {
        try {
          const parsed = JSON.parse(rawVariants);
          parsedVariants = Array.isArray(parsed) ? parsed : [];
        } catch {
          parsedVariants = [];
        }
      }

      const product = {
        uniqueId: formData.get("uniqueId") as string,
        productTitle: formData.get("productTitle") as string,
        productDesc: formData.get("productDesc") as string,
        category: selectedCategory,
        price: Number(formData.get("price")) as number,
        offerPrice: Number(formData.get("offerPrice")) as number,
        totalStock: Number(formData.get("totalStock")) as number,
        variants: parsedVariants,
        images: uploadedImageUrls,
      };

      const response = await AddProduct(product);
      if (response?.success) {
        setProductAdded(true);
        const productUniqueId = response.product.uniqueId;
        router.push(`/admin/inventory/${productUniqueId}`);
        setTimeout(() => {
          setProductAdded(false);
        }, 3000);
      } else {
        console.error(response?.message);
        alert(
          typeof response?.message === "string"
            ? response.message
            : "Failed to save product"
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 border w-full bg-white p-5 rounded-xl"
    >
      <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>

      {/* Image Upload */}
      <div>
        <label className="block text-lg text-gray-700 font-medium mb-2">
          Product Image
        </label>
        <FilesUploader />
      </div>

      {/* Unique ID */}
      <div>
        <label className="block text-lg text-gray-700 font-medium mb-2">
          Unique ID
        </label>
        <input
          required
          name="uniqueId"
          placeholder="Enter unique product ID"
          type="text"
          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition duration-200"
        />
      </div>

      {/* Product Title */}
      <div>
        <label className="block text-lg text-gray-700 font-medium mb-2">
          Product Title
        </label>
        <input
          required
          name="productTitle"
          placeholder="Enter Product Title"
          type="text"
          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition duration-200"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-lg text-gray-700 font-medium mb-2">
          Product Description
        </label>
        <textarea
          required
          name="productDesc"
          rows={3}
          placeholder="Enter product description"
          className="w-full py-3 px-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-lg text-gray-700 font-medium mb-2">
          Category
        </label>
        <CategorySelector onCategoryChange={setSelectedCategory} />
      </div>

      {/* Price + Offer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            required
            name="price"
            type="number"
            placeholder="0"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Offer Price
          </label>
          <input
            required
            name="offerPrice"
            type="number"
            placeholder="0"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
          />
        </div>
      </div>

      {/* Total Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Stock
        </label>
        <input
          required
          name="totalStock"
          type="number"
          min="1"
          placeholder="Total available stock"
          className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isProcessing}
          className={`relative shadow-lg inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-300
    ${isProcessing || productAdded
              ? "bg-gray-400"
              : "bg-gray-500 hover:bg-gray-600"
            }
    ${isProcessing ? "cursor-wait" : "cursor-pointer"}
    shadow-md disabled:opacity-70 disabled:cursor-not-allowed
  `}
        >
          {isProcessing && (
            <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}

          {isProcessing ? (
            "Saving..."
          ) : productAdded ? (
            <span className="flex items-center gap-1 animate-fade-in">
              <span className="text-white font-semibold">Saved!</span>
            </span>
          ) : (
            "Save Product"
          )}
        </button>
      </div>
    </form>
  );
};
export default AddProductForm;
