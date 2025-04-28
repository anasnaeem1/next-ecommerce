"use client";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type Color = {
  label: string;
  availability: boolean;
};

type Size = {
  label: string;
  availability: boolean;
};

type CustomizeSectionProps = {
  colors: Color[];
  sizes: Size[];
};

const CustomizeSection = ({ colors, sizes }: CustomizeSectionProps) => {
  const [selectedSize, setSelectedSize] = useState("Small");
  const [selectedColor, setSelectedColor] = useState(colors[0]);


  return (
    <div className="flex flex-col gap-5">
      <div className=" flex flex-col gap-2">
        <p className="font-medium mb-1">Choose a color</p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <span
              onClick={() => color.availability && setSelectedColor(color)}
              className={`${
                selectedColor === color ? "border-blue-300" : "border-white"
              } relative cursor-pointer p-1 border-2 rounded-full ${
                !color.availability ? "cursor-not-allowed opacity-50" : ""
              } transition-all duration-200`}
              key={color.label}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 border-gray-300 relative ${
                  color.availability ? "ring-2 ring-gray-100" : "bg-gray-200"
                }`}
                style={{
                  backgroundColor: color.availability ? color.label : "white",
                  transition: "background-color 0.2s ease",
                }}
              >
                {!color.availability && (
                  <div
                    className="absolute top-0 left-0 right-0 bottom-0 border-2 border-red-500 rounded-full"
                    style={{
                      transform: "rotate(45deg)",
                      zIndex: 1,
                      opacity: 0.7,
                    }}
                  />
                )}
              </div>
            </span>
          ))}
        </div>
      </div>
      <div className=" flex flex-col gap-2">
        <p className="font-medium mb-1">Choose a size</p>
        <div className="flex bg-gray-200 p-1 rounded-lg shadow-md w-72 text-sm font-medium">
          {sizes.map((size) => (
            <button
              key={size.label}
              onClick={() => size.availability && setSelectedSize(size.label)}
              disabled={!size.availability}
              className={`
      flex-1 px-3 py-2 rounded-lg transition-all duration-200
      ${
        selectedSize === size.label
          ? "bg-[#d63384] text-white font-semibold shadow"
          : size.availability && "hover:bg-gray-300"
      }
      ${
        size.availability
          ? " text-slate-700 cursor-pointer"
          : "opacity-80 cursor-not-allowed text-gray-600"
      }
    `}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CustomizeSection;
