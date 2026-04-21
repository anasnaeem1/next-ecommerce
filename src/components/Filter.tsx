"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FilterProps = {
  selectedCategory?: string;
  selectedSize?: string;
  selectedColor?: string;
  categoryOptions?: string[];
};

const Filter = ({
  selectedCategory = "",
  selectedSize = "",
  selectedColor = "",
  categoryOptions = [],
}: FilterProps) => {
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState<string | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const FilterTypes = [
    {
      id: "Size",
      dropDown: ["All", "small", "medium", "large"],
    },
    {
      id: "Color",
      dropDown: ["All", "black", "blue", "yellow", "white", "red", "green"],
    },
    {
      id: "Category",
      dropDown: ["All", ...(categoryOptions.length > 0 ? categoryOptions : ["electronics", "fashion", "footwear", "accessories"])],
    },
  ];

  const handleSelect = (id: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: value }));
    setCurrentDropdownOpen(null);
    const params = new URLSearchParams(searchParams.toString());

    if (id === "Category") {
      if (value === "All") params.delete("category");
      else params.set("category", value);
    }
    if (id === "Size") {
      if (value === "All") params.delete("size");
      else params.set("size", value);
    }
    if (id === "Color") {
      if (value === "All") params.delete("color");
      else params.set("color", value);
    }
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 w-full justify-start">
        {FilterTypes.map((filter) => {
          if (filter.dropDown) {
            return (
              <div
                key={filter.id}
                className="relative flex-1 min-w-[100px] max-w-[150px]"
              >
                <div
                  onClick={() =>
                    setCurrentDropdownOpen(
                      currentDropdownOpen === filter.id ? null : filter.id
                    )
                  }
                  className="bg-gray-50 text-gray-700 px-4 py-2.5 rounded-full flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <span className="selected-option text-sm truncate font-medium">
                    {selectedOptions[filter.id] ||
                      (filter.id === "Category"
                        ? selectedCategory || filter.dropDown[0]
                        : filter.id === "Size"
                        ? selectedSize || filter.dropDown[0]
                        : filter.id === "Color"
                        ? selectedColor || filter.dropDown[0]
                        : filter.dropDown[0])}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-2 transition-transform ${
                      currentDropdownOpen === filter.id
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 512 512"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>

                {currentDropdownOpen === filter.id && (
                  <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                    {filter.dropDown.map((label) => (
                      <div
                        key={label}
                        onClick={() => handleSelect(filter.id, label)}
                        className="cursor-pointer px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Filter;
