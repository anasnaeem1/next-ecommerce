"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, staggerContainer, viewport } from "./animations";

export default function AboutHero() {
  return (
    <section className="relative pt-10 w-full bg-[#FAF9F7] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-[70vh] flex items-center py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center w-full">
          {/* Left column */}
           <motion.div
            variants={staggerContainer(0.18)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col gap-6 lg:pr-6"
          >
            <motion.span
              variants={fadeUp}
              className="uppercase tracking-[0.35em] text-xs text-[#777777]"
            >
              About Urban
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-light tracking-tight leading-tight text-[#222222]"
            >
              Crafting Timeless Fashion
              <br />
              For Everyday Luxury.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#777777] text-base leading-8 max-w-md"
            >
              We design considered pieces that outlast trends — built from
              premium materials, refined silhouettes, and an unwavering
              attention to detail. Fashion that feels effortless, every day.
            </motion.p>

            <motion.div variants={fadeUp} className="pt-2">
              <motion.a
                href="/collections"
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-flex items-center gap-2 bg-[#1A1816] text-[#FAF9F7] px-8 py-4 rounded-full text-sm tracking-wide shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                Explore Collection
                <span aria-hidden="true">→</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right column — image */}
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[560px]">
            {/* Soft ambient glow behind the image, no hard edges */}
            <div
              aria-hidden="true"
              className="absolute -inset-10 rounded-[48px] bg-gradient-to-br from-[#ECECEC] via-[#F8F7F5] to-transparent blur-3xl opacity-70"
            />

            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="relative w-full h-full rounded-[36px] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
                alt="Model wearing a tailored neutral-tone outfit from the current collection"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
