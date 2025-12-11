"use client";

import { useState } from "react";

const Filter = () => {
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState<string | null>(
    null
  );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isSortOpen, setIsSortOpen] = useState(false);

  const FilterTypes = [
    {
      id: "Type",
      dropDown: ["All", "type 1", "type 2", "type 3"],
    },
    {
      id: "min",
      placeHolder: "min",
    },
    {
      id: "max",
      placeHolder: "max",
    },
    {
      id: "Size",
      dropDown: ["Size", "Small", "Medium", "Large"],
    },
    {
      id: "Color",
      dropDown: ["Color", "Black", "Blue", "Yellow"],
    },
    {
      id: "Category",
      dropDown: ["Category", "cat 1", "cat 2", "cat 3"],
    },
    {
      id: "All filters",
      dropDown: ["All Filter", "filter 1", "filter 2", "filter 3"],
    },
  ];

  const handleSelect = (id: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: value }));
    setCurrentDropdownOpen(null);
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
                    {selectedOptions[filter.id] || filter.dropDown[0]}
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

          return (
            <input
              key={filter.id}
              type="text"
              placeholder={filter.placeHolder}
              className="bg-gray-50 py-2.5 px-4 flex-1 min-w-[100px] max-w-[180px] rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-gray-100 transition-colors shadow-sm"
            />
          );
        })}
      </div>

      {/* Sort dropdown */}
      <div
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex-wrap gap-2 max-w-[130px] lg:flex hidden w-full justify-start"
      >
        <div className="relative flex-1 min-w-[100px] max-w-[150px]">
          <div className="bg-gray-50 py-2.5 px-4 rounded-full gap-2 text-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
            <span className="selected-option text-sm truncate font-medium">Sort by</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-2 transition-transform duration-300 ${
                isSortOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </div>

          {isSortOpen && (
            <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              {["High to Low", "Low to High", "None"].map((label) => (
                <div
                  key={label}
                  className="cursor-pointer px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
