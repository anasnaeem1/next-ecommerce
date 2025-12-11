'use client';

import { useRef, useState, useEffect } from 'react';

interface ProductImagesEditorProps {
  images: (string | File)[];
  isEditing: boolean;
  onImagesChange: (images: (string | File)[]) => void;
  productTitle?: string;
}

const ProductImagesEditor = ({ images, isEditing, onImagesChange, productTitle }: ProductImagesEditorProps) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [localImages, setLocalImages] = useState<(string | File)[]>(images);
  const objectUrlsRef = useRef<Map<File, string>>(new Map());

  // Sync localImages with parent images prop
  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const handleImageClick = (index: number) => {
    if (isEditing) {
      fileInputRefs.current[index]?.click();
    }
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Revoke old object URL if it exists
    const oldFile = localImages[index];
    if (oldFile instanceof File && objectUrlsRef.current.has(oldFile)) {
      const oldUrl = objectUrlsRef.current.get(oldFile);
      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
        objectUrlsRef.current.delete(oldFile);
      }
    }

    // Create and cache object URL for the new file
    if (!objectUrlsRef.current.has(file)) {
      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.set(file, objectUrl);
    }
    
    // Update local state with the new file
    const updatedImages = [...localImages];
    updatedImages[index] = file;
    setLocalImages(updatedImages);
    
    // Notify parent component
    onImagesChange(updatedImages);

    // Reset file input
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };

  const getImageSrc = (image: string | File): string => {
    if (image instanceof File) {
      // Return cached URL or create one if it doesn't exist
      if (!objectUrlsRef.current.has(image)) {
        const objectUrl = URL.createObjectURL(image);
        objectUrlsRef.current.set(image, objectUrl);
      }
      return objectUrlsRef.current.get(image)!;
    }
    return image;
  };

  return (
    <div className="mb-8 group">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-base font-medium text-gray-600 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
          Product Images
        </h3>
        <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:bg-gray-100 rounded-full">
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {localImages.map((image, index) => {
          const isNewFile = image instanceof File;
          const imageSrc = getImageSrc(image);
          
          return (
            <div
              key={index}
              className={`relative group/image w-28 h-28 md:w-32 md:h-32 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
                isEditing ? 'cursor-pointer' : ''
              } ${isNewFile ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={imageSrc}
                alt={`${productTitle || ''} view ${index + 1}`}
                className="w-full h-full object-contain p-1 bg-white"
              />
              {isEditing && (
                <>
                  {isNewFile && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      New
                    </div>
                  )}
                  <button
                    className="absolute top-1 right-1 opacity-0 group-hover/image:opacity-100 transition-all duration-300 p-1 bg-white hover:bg-gray-50 border border-gray-300 rounded z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(index);
                    }}
                    title="Click to replace image"
                  >
                    <svg
                      className="w-3 h-3 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={(el) => {
                  fileInputRefs.current[index] = el;
                }}
                onChange={(e) => handleImageChange(index, e)}
                className="hidden"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImagesEditor;

