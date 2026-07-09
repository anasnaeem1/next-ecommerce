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
  const container = useRef(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  gsap.registerPlugin(ScrollTrigger);
  useGSAP(
    () => {

      const imageElements = imageRefs.current;
      const totalCards = imageElements.length;

      if (!imageElements[0]) return;

      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;
        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.7,
            rotation: 5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div className={cn("relative h-full w-full", className)} ref={container}>
      <div className="h bg-[#1A1816] sticky-cards relative flex h-full w-full p-8 items-center justify-center overflow-hidden">
        <div
  className={cn(
    "relative h-[600px] w-full max-w-full h-full overflow-hidden rounded-lg",
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
     <div className="h-full w-full">
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
