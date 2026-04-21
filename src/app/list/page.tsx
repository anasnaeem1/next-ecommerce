import Image from "next/image";
import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import {connectDb} from "../../../config/db.js";
import { getProducts } from "../../serverActions/Product/productActions.js";
import Category from "../../../models/Category.js";

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
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Campaign Section */}
        <div className="hidden lg:flex items-center justify-between py-16 mb-12 bg-gradient-to-r from-gray-50/50 to-transparent rounded-3xl overflow-hidden">
          <div className="flex-1 flex flex-col gap-6 items-start pl-12">
            <h1 className="text-5xl font-light text-gray-900 leading-tight">
              Grab up to 50% off on
              <br />
              <span className="font-medium">Selected Products</span>
            </h1>
            <button className="rounded-full bg-[#F35C7A] text-white px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
              Shop Now
            </button>
          </div>

          <div className="relative w-1/3 h-80 flex items-center justify-center">
            <Image
              src="/woman.png"
              alt="Campaign"
              width={320}
              height={320}
              className="object-contain"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-16">
          <Filter
            selectedCategory={categoryParam || ""}
            selectedSize={sizeParam || ""}
            selectedColor={colorParam || ""}
            categoryOptions={categoryOptions}
          />
        </div>

        {/* Product List Section */}
        <div className="pb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 tracking-tight">
              {categoryLabel}
            </h2>
            <div className="mt-2 w-16 h-0.5 bg-gray-300"></div>
            <p className="mt-4 text-sm text-gray-500">
              Showing {productCount} product{productCount !== 1 ? "s" : ""}
              {categoryParam ? ` in ${categoryLabel}` : " in all categories"}
              {sizeParam ? ` with size ${sizeParam}` : ""}
              {colorParam ? ` and color ${colorParam}` : ""}
            </p>
            {!success && (
              <p className="mt-2 text-sm text-red-500">{message || "Unable to load products right now."}</p>
            )}
          </div>
          <ProductList products={safeProductList} number={8} listPage={true} />
        </div>
      </div>
    </div>
  );
};

export default ListPage;
