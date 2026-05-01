"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  productImages: string[];
};

const ProductImages = ({ productImages }: Props) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleImageChange = (index: number) => {
    if (index === currentImage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage(index);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="space-y-6 w-full flex flex-col md:flex-row-reverse gap-4">
      {/* Main Image with Smooth Transition */}
      <div className="relative border w-full flex   aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
          {productImages.map((img, index) => (
            <div
              key={index}
              className={`absolute w-full inset-0 transition-opacity duration-500 ease-in-out ${currentImage === index && !isTransitioning
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
                }`}
            >
              <Image
                src={img}
                alt={`Product image ${index + 1}`}
                fill
                className="object-contain w-full"
                sizes=""
                priority={index === 0}
              />
            </div>
          ))}

        {/* Navigation Arrows */}
        {productImages.length > 1 && (
          <>
            <button
            type="button"
              onClick={() => handleImageChange((currentImage - 1 + productImages.length) % productImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
            type="button"
              onClick={() => handleImageChange((currentImage + 1) % productImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {productImages.length > 1 && (
        <div className="max-w-full flex md:flex-col gap-2">
        {productImages.map((img, index) => (
          <div onClick={() => handleImageChange(index)} key={index} className={`${currentImage == index && "border-2 border-gray-800"} transition-all duration-100 ease-in-out max-w-[150px] h-auto aspect-square cursor-pointer border border-gray-200 ${currentImage === index ? "border-2 border-gray-900" : ""}`}>
            <Image
              src={img}
              alt={`Product image ${index + 1}`}
              width={220}
              height={220}
              className="w-full h-full object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ProductImages;



