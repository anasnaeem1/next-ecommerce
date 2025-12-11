"use client";
import Image from "next/image";
import Link from "next/link";
import { useCategory } from "../../context/CategoryContext";

const CategoryList = () => {
  const { categories, loading, error } = useCategory();

  // Default placeholder image
  const defaultImage = "https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900";

  if (loading) {
    return (
      <div className="my-12 px-4">
        <div className="flex flex-nowrap gap-6">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="min-w-[280px] sm:min-w-[320px] bg-gray-100 rounded-md animate-pulse"
              >
                <div className="w-full aspect-[3/4] bg-gray-200 rounded-md"></div>
                <div className="py-4 px-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-12 px-4">
        <div className="text-center text-gray-500">Failed to load categories</div>
      </div>
    );
  }

  const parentCategories = Object.keys(categories);

  if (parentCategories.length === 0) {
    return (
      <div className="my-12 px-4">
        <div className="text-center text-gray-500">No categories available</div>
      </div>
    );
  }

  return (
    <div className="my-12 scroll-hide overflow-x-auto">
      <div className="flex flex-nowrap gap-6 px-4">
        {parentCategories.map((parentKey) => {
          const category = categories[parentKey];
          const categoryUrl = `/list?category=${parentKey}`;

          return (
            <Link
              href={categoryUrl}
              key={parentKey}
              className="min-w-[280px] sm:min-w-[320px] bg-white overflow-hidden hover:shadow-lg transition-shadow rounded-md group"
            >
              <div className="relative w-full aspect-[3/4] bg-gray-100">
                <Image
                  src={defaultImage}
                  alt={category.label}
                  fill
                  sizes="25vw"
                  className="absolute object-cover z-10 rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>

              <h1 className="py-4 px-2 text-gray-700 font-semibold text-center group-hover:text-gray-900 transition-colors">
                {category.label}
              </h1>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
