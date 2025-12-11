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
    <div className="space-y-6">
      {/* Main Image with Smooth Transition */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
        <div className="relative w-full h-full">
          {productImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                currentImage === index && !isTransitioning
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              }`}
            >
              <Image
                src={img}
                alt={`Product image ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        {productImages.length > 1 && (
          <>
            <button
              onClick={() => handleImageChange((currentImage - 1 + productImages.length) % productImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
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
        <div className="w-full">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
            {productImages.map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0"
              >
                <button
                  onClick={() => handleImageChange(index)}
                  className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                    currentImage === index
                      ? "w-28 h-28 ring-2 ring-gray-900"
                      : "w-24 h-24 ring-1 ring-gray-200 hover:ring-gray-300"
                  }`}
                  aria-label={`View image ${index + 1}`}
                  type="button"
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 112px"
                  />
                  {currentImage === index && (
                    <>
                      <div className="absolute inset-0 border-2 border-gray-900 rounded-lg pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900"></div>
                    </>
                  )}
                  {currentImage !== index && (
                    <div className="absolute inset-0 bg-transparent hover:bg-gray-900/5 transition-colors duration-200 rounded-lg"></div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
