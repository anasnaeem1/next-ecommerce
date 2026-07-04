"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, scaleReveal, staggerContainer, viewport } from "./animations";

export default function AboutCTA() {
  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-24">
        <div className="bg-[#F8F7F5] rounded-[36px] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left column — copy */}
            <motion.div
              variants={staggerContainer(0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-col gap-6 px-8 sm:px-12 lg:px-16 py-16 lg:py-0"
            >
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-light tracking-tight text-[#222222] leading-tight"
              >
                Ready to Elevate
                <br />
                Your Wardrobe?
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-[#777777] leading-8 max-w-sm"
              >
                Discover the new collection — considered pieces designed to
                move seamlessly through every part of your day.
              </motion.p>

              <motion.div variants={fadeUp}>
                <motion.a
                  href="/collections"
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 bg-[#1A1816] text-[#FAF9F7] px-8 py-4 rounded-full text-sm tracking-wide shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  Shop Collection
                  <span aria-hidden="true">→</span>
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right column — image */}
            <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[480px]">
              <div
                aria-hidden="true"
                className="absolute -inset-8 bg-gradient-to-tl from-[#ECECEC] via-[#FAF9F7] to-transparent blur-3xl opacity-70"
              />
              <motion.div
                variants={scaleReveal}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="relative w-full h-full overflow-hidden lg:rounded-l-none rounded-[36px]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop"
                  alt="Editorial shot of the latest wardrobe collection"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
