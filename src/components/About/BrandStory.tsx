"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  fadeUp,
  scaleReveal,
  staggerContainer,
  viewport,
} from "./animations";

export default function BrandStory() {
  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left column — copy */}
          <motion.div
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col gap-6 lg:pr-10"
          >
            <motion.span
              variants={fadeUp}
              className="uppercase tracking-[0.35em] text-xs text-[#777777]"
            >
              Our Story
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="text-4xl font-light tracking-tight text-[#222222]"
            >
              Our Story
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-[#777777] leading-8"
            >
              Urban began with a simple belief: that clothing should be made
              to last, not discarded with the season. Every piece starts on
              the cutting table of artisans who have spent decades refining
              their craft, working with natural fibers sourced from mills we
              have partnered with for years.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-[#777777] leading-8"
            >
              We favor restraint over excess — clean lines, considered
              proportions, and a palette drawn from the world around us
              rather than fleeting trends. The result is a wardrobe built on
              timeless design, meant to move with you through every season.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-[#777777] leading-8"
            >
              From premium materials to modern silhouettes, our collections
              are designed for a life in motion — for the office, the
              evening, and everything between. This is fashion built for
              real, modern living.
            </motion.p>
          </motion.div>

          {/* Right column — image */}
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="relative w-full h-[420px] sm:h-[500px] lg:h-[620px] rounded-[36px] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop"
              alt="Artisan hands stitching a garment, representing our craftsmanship"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
