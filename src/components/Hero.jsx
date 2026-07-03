"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Link2 } from "lucide-react";

const Hero = () => {
  const slides = [
    {
      id: 1,
      title: "Summer",
      description: "Discover lightweight essentials crafted from breathable fabrics, effortless silhouettes, and refined details to keep you cool and stylish all season long.",
      img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      bg: "bg-gradient-to-r from-yellow-50 to-gray-50",
    },
    {
      id: 2,
      title: "Winter",
      description: "Experience luxurious warmth with premium knitwear, tailored outerwear, and timeless layers designed to keep you comfortable without compromising on elegance.",
      img: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
      bg: "bg-[#f7f5f2]",
    },
    {
      id: 3,
      title: "Spring",
      description: "Refresh your wardrobe with versatile essentials featuring soft fabrics, fresh colors, and modern silhouettes that capture the effortless spirit of the season.",
      img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
      bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const nextIndex = (activeIndex + 1) % slides.length;
  //     goToSlide(nextIndex);
  //   }, 3000); // change slide every 4 seconds

  //   return () => clearInterval(interval);
  // }, [activeIndex]);

  return (
    <div className=" relative h-[calc(100vh-80px)] bg-white ">
      {/* Slider */}
      <div
        ref={sliderRef}
        className="w-full h-full border rounded-md border-gray-300 flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
      >
        {[slides[activeIndex]].map((slide) => (
          <div
            key={activeIndex}
            className={`min-w-full h-full relative flex flex-col-reverse md:flex-row items-center justify-between ${slide.bg} transition-all duration-700 ease-in-out`}
          >
            {/* Left Content */}
            <div
              key={`text-${activeIndex}`}
          className="w-full md:w-1/2 h-auto md:h-full flex items-center bg-[#F8F6F3] px-6 py-12 sm:px-8 sm:py-14 md:px-20 md:py-0 lg:px-28 animate-[fadeUp_.7s_ease]"
            >
              <div className="max-w-lg">
                <span className="inline-block text-[11px] font-medium uppercase tracking-[0.3em] text-[#B08D4A]">
                  {slide.title} 2026
                </span>

                <h1 className="mt-3 font-serif text-[clamp(3.2rem,6vw,5.8rem)] leading-[0.92] font-normal tracking-[-0.03em] text-[#111111]">
                  {slide.title}
                  <br />
                  Collection
                </h1>

                <p className="mt-5 max-w-md text-base leading-7 text-[#666666]">
                  {slide.description}
                </p>

                <Link
                  href="/list"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#111111] px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#2A2A2A]"
                >
                  Explore Collection
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div
  key={`image-${activeIndex}`}
  className="relative w-full h-[42vh] sm:h-[48vh] md:w-1/2 md:h-full overflow-hidden animate-[fadeZoom_.8s_ease]"
>
  <Image
    src={slide.img}
    alt={slide.title}
    fill
    priority
    className="object-cover object-center md:object-center"
  />
</div>
          </div>
        ))}
      </div>

      {/* Custom Checkbox Dots */}
      <div className="absolute bottom-10 left-8 md:left-20 lg:left-28 z-10 hidden md:flex gap-4">
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

<div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
  <button
    onClick={prevSlide}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-sm shadow-sm backdrop-blur transition-all duration-300 active:scale-95"
  >
    ↑
  </button>

  <button
    onClick={nextSlide}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-sm shadow-sm backdrop-blur transition-all duration-300 active:scale-95"
  >
    ↓
  </button>
</div>
    </div>
  );
};

export default Hero;
