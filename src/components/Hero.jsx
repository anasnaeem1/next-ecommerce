"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const slides = [
    {
      id: 1,
      title: "Summer Sale Collections",
      description: "Sale! Up to 50% off!",
      img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
    },
    {
      id: 2,
      title: "Winter Sale Collections",
      description: "Sale! Up to 50% off!",
      img: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
      bg: "bg-gradient-to-r from-pink-50 to-blue-50",
    },
    {
      id: 3,
      title: "Spring Sale Collections",
      description: "Sale! Up to 50% off!",
      img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
      bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const goToSlide = (index) => {
    setActiveIndex(index);
    sliderRef.current.scrollTo({
      left: index * window.innerWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-4 py-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* Slider */}
      <div
        ref={sliderRef}
        className="w-full border rounded-md border-gray-300 flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full rounded-md relative h-[calc(100vh-120px)] flex md:flex-row flex-col items-center justify-between ${slide.bg} snap-start`}
          >
            {/* Left: Text */}
            <div className="md:h-full h-1/2 md:w-1/2 w-full gap-2 flex flex-col items-center md:items-start justify-center md:ml-10 z-10">
              <h1 className="text-center font-bold text-[clamp(30px,8vw,20px)]">
                {slide.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">{slide.description}</p>
              <Link
                href="/list"
                className="bg-black max-w-[200px] text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
              >
                Shop Now
              </Link>
            </div>

            {/* Right: Image */}
            <div className="md:h-full h-1/2 md:w-1/2 w-full  relative">
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        ))}
      </div>

      {/* Custom Checkbox Dots */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex gap-4">
        {slides.map((_, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={activeIndex === index}
              onChange={() => goToSlide(index)}
              className="hidden peer"
            />
            <span className="inline-block w-6 h-6 border-2 border-black rounded-full relative cursor-pointer peer-checked:after:opacity-100 after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-black after:rounded-full after:opacity-0 transition" />
          </label>
        ))}
      </div>
    </div>
  );
};

export default Hero;
