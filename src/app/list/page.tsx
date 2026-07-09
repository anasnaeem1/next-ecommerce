import Image from "next/image";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import CampaignBanner from "@/components/shop/ShopCampaign.jsx";
import { connectDb } from "../../../config/db.js";
import { getProducts } from "../../serverActions/Product/productActions.js";
import Category from "../../../models/Category.js";
import { motion } from "framer-motion";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string; size?: string; color?: string }>;
}

const ListPage = async ({ searchParams }: PageProps) => {
  await connectDb();

  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams?.category;
  const sizeParam = resolvedSearchParams?.size;
  const colorParam = resolvedSearchParams?.color;
  const categoryDoc = await Category.findOne().lean();
  const categoryOptions = Array.isArray((categoryDoc as any)?.categories)
    ? (categoryDoc as any).categories.map((cat: { key: string }) => cat.key)
    : [];
  const { success, products: productList, message } = await getProducts(
    categoryParam as any,
    sizeParam as any,
    colorParam as any
  );
  const safeProductList = Array.isArray(productList) ? productList : [];
  const productCount = safeProductList.length;

  // Get category label for display
  let categoryLabel = "All Products";
  if (categoryParam) {
    try {
      if (categoryDoc && Array.isArray((categoryDoc as any).categories)) {
        const parentCategory = (categoryDoc as any).categories.find(
          (cat: { key: string; label: string }) => cat.key === categoryParam.toLowerCase()
        );
        if (parentCategory) {
          categoryLabel = parentCategory.label;
        } else {
          categoryLabel = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
        }
      } else {
        categoryLabel = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      }
    } catch (error) {
      console.error("Error fetching category label:", error);
      categoryLabel = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    }
  }


  return (
    <div className="w-full bg-white bg-[#FAFAF8] ">
      <CampaignBanner />
      <div className="bg-[#FAFAF8]">
        <div className="py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12">

          {/* Header */}
          <div className="pb-10">
            <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
              Collection
            </p>

            <h1 className="mt-3 text-4xl font-light tracking-tight text-neutral-900">
              {categoryLabel}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500">
              Showing{" "}
              <span className="font-medium text-neutral-900">
                {productCount}
              </span>{" "}
              product{productCount !== 1 ? "s" : ""}
              {categoryParam ? ` in ${categoryLabel}` : " across all categories"}
              {sizeParam ? ` • Size ${sizeParam}` : ""}
              {colorParam ? ` • ${colorParam}` : ""}
            </p>

            {!success && (
              <p className="mt-3 text-sm text-red-500">
                {message || "Unable to load products right now."}
              </p>
            )}
          </div>

          {/* Filter */}
          <div className="pb-12">
            <Filter
              selectedCategory={categoryParam || ""}
              selectedSize={sizeParam || ""}
              selectedColor={colorParam || ""}
              categoryOptions={categoryOptions}
            />
          </div>

          {/* Products */}
          <ProductList
            New={false}
            products={safeProductList}
            number={8}
            listPage={true}
          />

        </div>
      </div>
    </div>
  );
};

export default ListPage;
