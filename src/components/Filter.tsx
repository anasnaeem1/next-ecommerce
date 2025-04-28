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
    <div className="mt-8 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 w-full justify-start">
        {FilterTypes.map((filter) => {
          if (filter.dropDown) {
            return (
              <div
                key={filter.id}
                className="bg-gray-50 relative flex-1 min-w-[100px] max-w-[150px]"
              >
                <div
                  onClick={() =>
                    setCurrentDropdownOpen(
                      currentDropdownOpen === filter.id ? null : filter.id
                    )
                  }
                  className="peer bg-gray-100 border border-gray-300 text-gray-800 px-2 py-1.5 rounded-xl flex justify-between items-center cursor-pointer"
                >
                  <span className="selected-option text-sm truncate">
                    {selectedOptions[filter.id] || filter.dropDown[0]}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      currentDropdownOpen === filter.id
                        ? "rotate-0"
                        : "rotate-180"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 512 512"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                </div>

                {currentDropdownOpen === filter.id && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md scale-95 transition-all duration-200">
                    {filter.dropDown.map((label) => (
                      <div
                        key={label}
                        onClick={() => handleSelect(filter.id, label)}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
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
              className="py-2 px-2 flex-1 min-w-[100px] max-w-[180px] border border-gray-400 rounded-xl text-sm"
            />
          );
        })}
      </div>


      {/* Sort dropdown - Styled like previous menu */}.
      <div
        onClick={() => setIsSortOpen(!isSortOpen)}
        className=" flex-wrap gap-2 max-w-[130px] lg:flex hidden w-full justify-start"
      >
        <div className="bg-gray-50 relative flex-1 min-w-[100px] max-w-[150px]">
          <div className="peer bg-gray-100 py-2 px-3 rounded-xl border  gap-2 border-gray-300 text-gray-800 flex justify-between items-center cursor-pointer">
            <span className="selected-option text-sm truncate">Sort by</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${
                isSortOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </div>

          {isSortOpen && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md scale-95 transition-all duration-200">
              {["High to Low", "Low to High", "None"].map((label) => (
                <div
                  key={label}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
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
