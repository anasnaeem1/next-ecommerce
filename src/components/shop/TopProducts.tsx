"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { useRef } from "react";


import { cn } from "../../utils/lib";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
 const container = useRef<HTMLDivElement>(null);
const stickyRef = useRef<HTMLDivElement>(null);
const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

gsap.registerPlugin(ScrollTrigger, useGSAP);

useGSAP(
  () => {
    const images = imageRefs.current.filter(
      Boolean
    ) as HTMLImageElement[];

    if (!stickyRef.current || images.length === 0) return;

    // Initial state
    gsap.set(images, {
      y: "100%",
      scale: 1,
      rotation: 0,
    });

    gsap.set(images[0], {
      y: "0%",
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stickyRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (images.length - 1)}`,
        pin: true,
        scrub: 0.5,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    images.slice(0, -1).forEach((currentImage, index) => {
      timeline.to(
        currentImage,
        {
          scale: 0.7,
          rotation: 5,
          ease: "none",
          duration: 1,
        },
        index
      );

      timeline.to(
        images[index + 1],
        {
          y: "0%",
          ease: "none",
          duration: 1,
        },
        index
      );
    });

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    if (container.current) {
      resizeObserver.observe(container.current);
    }

    return () => {
      resizeObserver.disconnect();
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  },
  {
    scope: container,
    dependencies: [cards],
    revertOnUpdate: true,
  }
);
  return (
    <div
  ref={stickyRef}
  className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#1A1816]"
>
      <div className=" bg-[#1A1816] sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden">
        <div
  className={cn(
    " relative h-[600px] w-full max-w-full h-full overflow-hidden rounded-lg",
    containerClassName
  )}
        >
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || ""}
              className={cn(
                "rounded-4xl absolute h-full w-full object-cover",
                imageClassName,
              )}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component with default data
const Skiper17 = () => {
  const defaultCards = [
    {
      id: 1,
      image: "https://res.cloudinary.com/datcr1zua/image/upload/v1783553855/e71f480bd75e40b75dfb3b18e5611f45_vf99qy.jpg",
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/datcr1zua/image/upload/v1783550494/c43993e8a5be1c0ab6aebe42759d220e_vcilxp.jpg",
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/datcr1zua/image/upload/v1783124037/HD-wallpaper-dark-black-car-under-a-light-dark-black-car-light-darkness_qhsl8l.jpg",
    },
    {
      id: 4,
      image: "https://res.cloudinary.com/datcr1zua/image/upload/v1783115044/04566cbe22f27fb246d83f60a5fbb212_kh3vdb.jpg",
    },
    {
      id: 5,
      image: "https://res.cloudinary.com/datcr1zua/image/upload/v1782255679/uploads/agdxrwbarxh3vlv2hspy.jpg",
    },
  ];

  return (
    <ReactLenis root>
    <div className="relative w-full">
  <StickyCard002 cards={defaultCards} />
</div>
    </ReactLenis>
  );
};

export { Skiper17, StickyCard002 };

/**
 * Skiper 17 StickyCard_002 — React + Gsap + scrollTrigger
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
