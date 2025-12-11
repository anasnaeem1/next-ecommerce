"use client";
import { Images, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import UploadingImages from "../components/uploadingImges";

type ImageData = {
  index: number;
  image: string;
  file?: File;
};

const FileUploader = () => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [images, setImages] = useState<ImageData[]>(
    Array.from({ length: 4 }, (_, i) => ({ index: i, image: "" }))
  );

  const handleClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setImages((prev) =>
        prev.map((item) =>
          item.index === index ? { ...item, image: imageUrl, file: file } : item
        )
      );
    }
  };

  return (
    <div className="reative flex gap-3 flex-wrap">
      {images.map((item, index) => (
        <div
          key={index}
          className="mt-2 cursor-pointer"
          onClick={() => handleClick(index)}
        >
          <div
            className={` w-max h-max bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out border border-gray-300 flex flex-col items-center justify-center`}
          >
            {item.image ? (
              <div className="px-6 py-1 relative">
                {item.image.startsWith('blob:') || item.image.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={`Preview ${index + 1}`}
                    className="w-[80px] h-[80px] object-cover rounded"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                    unoptimized
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering the upload click
                    setImages((prev) =>
                      prev.map((img) =>
                        img.index === index ? { ...img, image: "" } : img
                      )
                    );
                  }}
                  className="absolute border border-gray-200 -top-2 -right-2 bg-white text-red-500 rounded-full w-8 h-8 flex items-center text-md justify-center shadow"
                  title="Remove"
                >
                  ✕
                </button>
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
              fileInputRefs.current[index] = el!;
            }}
            onChange={(e) => handleFileChange(index, e)}
            className="hidden"
          />
        </div>
      ))}
      {/* <UploadingImages images={images} /> */}
    </div>
  );
};

export default FileUploader;
