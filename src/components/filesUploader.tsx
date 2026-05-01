"use client";
import { UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ImageData = {
  index: number;
  image: string;
  file?: File;
};

type FileUploaderProps = {
  existingImages?: string[];
  isEditing?: boolean;
  onImagesChange?: (images: (string | File)[]) => void;
};

const TOTAL_SLOTS = 4;

const createImageSlots = (existingImages: string[]): ImageData[] =>
  Array.from({ length: TOTAL_SLOTS }, (_, index) => ({
    index,
    image: existingImages[index] ?? "",
  }));

const isPreviewUrl = (src: string) =>
  src.startsWith("blob:") || src.startsWith("data:");

const FileUploader = ({
  existingImages = [],
  isEditing = true,
  onImagesChange,
}: FileUploaderProps) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [images, setImages] = useState<ImageData[]>(createImageSlots(existingImages));
  const existingImagesKey = existingImages.join("||");

  useEffect(() => {
    setImages(createImageSlots(existingImages));
  }, [existingImagesKey]);

  const toImagesPayload = (items: ImageData[]): (string | File)[] => {
    const nextImages: (string | File)[] = [];
    for (const item of items) {
      if (item.file instanceof File && item.file.size > 0) {
        nextImages.push(item.file);
      } else if (
        item.image &&
        !item.image.startsWith("blob:") &&
        !item.image.startsWith("data:")
      ) {
        nextImages.push(item.image);
      }
    }
    return nextImages;
  };

  const handleClick = (index: number) => {
    if (isEditing) fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImages((prev) => {
      const next = prev.map((item) =>
        item.index === index ? { ...item, image: imageUrl, file } : item
      );
      onImagesChange?.(toImagesPayload(next));
      return next;
    });
  };

  return (
    <div className="reative flex gap-3 flex-wrap">
      {images.map((item, index) => (
        <div
          key={index}
          className={`mt-2 ${isEditing ? "cursor-pointer" : "cursor-default"}`}
          onClick={() => handleClick(index)}
        >
          <div className="w-[100px] h-[100px] bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out border border-gray-300 flex flex-col items-center justify-center">
            {item.image ? (
              <div className=" w-full h-full relative">
                {isPreviewUrl(item.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full p-2 border object-cover"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover p-2 w-full h-full"
                    unoptimized
                  />
                )}
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImages((prev) => {
                        const next = prev.map((img) =>
                          img.index === index ? { ...img, image: "", file: undefined } : img
                        );
                        onImagesChange?.(toImagesPayload(next));
                        return next;
                      });
                    }}
                    className="absolute border border-gray-200 -top-2 -right-2 bg-white text-red-500 rounded-full w-8 h-8 flex items-center text-md justify-center shadow"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <div className="px-10 py-6 flex justify-center items-center flex-col">
                <UploadCloud className="w-6 h-6 text-gray-400" />
                <h1 className="text-sm">upload</h1>
              </div>
            )}
          </div>
          <input
            name={`productImage${index + 1}`}
            type="file"
            accept="image/*"
            ref={(el) => {
              fileInputRefs.current[index] = el;
            }}
            onChange={(e) => handleFileChange(index, e)}
            className="hidden"
            disabled={!isEditing}
          />
        </div>
      ))}
    </div>
  );
};

export default FileUploader;
