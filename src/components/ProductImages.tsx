"use client";
import Image from "next/image";
import { useState } from "react";

const ProductImages = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const Images = [
    {
      id: 1,
      link: "https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg",
    },
    {
      id: 2,
      link: "https://img.freepik.com/free-photo/modern-wireless-earphones-with-case-simple-concrete-background_23-2150808007.jpg",
    },
    {
      id: 3,
      link: "https://img.freepik.com/premium-photo/white-headphones-wireless-earphones-with-case_105428-8185.jpg",
    },
  ];

  return (
    <div>
      <div className="h-[500px] relative">
        <Image
          src={Images[currentImage].link}
          alt={`Main product image ${currentImage + 1}`}
          fill
          className="object-cover rounded-md"
          sizes="50vw"
        />
      </div>

      <div className="flex justify-between mt-8 gap-4">
        {Images.map((image, index) => (
          <div
            key={image.id}
            onClick={() => setCurrentImage(index)}
            className={`w-1/4  h-32 relative cursor-pointer transition-all duration-300 rounded-md
   ${
     currentImage === index
       ? "border-pink-500 border ring-2 ring-pink-300"
       : ""
   }`}
          >
            <Image
              src={image.link}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover p-2 rounded-md"
              sizes="30vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
