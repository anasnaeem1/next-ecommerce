"use client";

import { motion } from "framer-motion";
import { Leaf, Minus, Feather, Sparkle, LucideIcon } from "lucide-react";
import { fadeUp, slideLeft, staggerContainer, viewport } from "./animations";

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: Sparkle,
    title: "Quality",
    description:
      "Every stitch, seam, and finish is held to a standard that rewards a closer look.",
  },
  {
    icon: Minus,
    title: "Minimalism",
    description:
      "We design by subtraction — keeping only what earns its place on the garment.",
  },
  {
    icon: Feather,
    title: "Comfort",
    description:
      "Luxury should feel effortless. Every fit is tested for how it moves with you.",
  },
  {
    icon: Leaf,
    title: "Innovation",
    description:
      "Traditional craft, made new — responsibly sourced fabrics and modern techniques.",
  },
];

export default function ValuesSection() {
  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          {/* Left column — heading */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <span className="uppercase tracking-[0.35em] text-xs text-[#777777]">
              Our Values
            </span>
            <h2 className="text-4xl font-light tracking-tight text-[#222222] mt-4 leading-tight">
              Crafted Around
              <br />
              Modern Living
            </h2>
            <p className="text-[#777777] leading-8 mt-6 max-w-sm">
              Four principles guide everything we make — from the first
              sketch to the final fitting.
            </p>
          </motion.div>

          {/* Right column — value blocks */}
          <motion.div
            variants={staggerContainer(0.18)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col gap-10"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  className="flex gap-6 pb-10 border-b border-[#ECECEC] last:border-none last:pb-0"
                >
                  <div className="w-11 h-11 shrink-0 rounded-full bg-[#F8F7F5] border border-[#ECECEC] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1A1816]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-[#222222] mb-2">
                      {value.title}
                    </h3>
                    <p className="text-[#777777] leading-8 text-sm">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
