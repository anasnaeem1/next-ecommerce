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
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <span className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Back
        </button>

        <h2 className="text-lg font-medium tracking-tight text-gray-900">
          Add Product
        </h2>

        <div className="w-10" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100"
      >
        {/* Upload */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            Product Image
          </label>
          <FilesUploader />
        </div>

        {/* Inputs Grid */}
        <div className="grid gap-5">
          <input
            required
            name="uniqueId"
            placeholder="Unique ID"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            required
            name="productTitle"
            placeholder="Product Title"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <textarea
            required
            name="productDesc"
            rows={3}
            placeholder="Product Description"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            Category
          </label>
          <CategorySelector onCategoryChange={setSelectedCategory} />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            name="price"
            type="number"
            placeholder="Price"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />

          <input
            required
            name="offerPrice"
            type="number"
            placeholder="Offer Price"
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Stock */}
        <input
          required
          name="totalStock"
          type="number"
          placeholder="Total Stock"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition
          ${
            isProcessing || productAdded
              ? "bg-gray-300 text-gray-600"
              : "bg-gray-900 text-white hover:bg-black"
          }`}
        >
          {isProcessing && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}

          {isProcessing
            ? "Saving..."
            : productAdded
            ? "Saved"
            : "Save Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
