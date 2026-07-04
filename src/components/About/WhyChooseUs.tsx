"use client";

import { motion } from "framer-motion";
import { Gem, Globe2, ShieldCheck, LucideIcon } from "lucide-react";
import { fadeUp, staggerContainer, viewport } from "./animations";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Gem,
    title: "Premium Materials",
    description:
      "Sourced from mills we trust, every fabric is chosen for its feel, durability, and quiet luxury.",
  },
  {
    icon: Globe2,
    title: "Worldwide Shipping",
    description:
      "From our studio to your door, wherever you are — carefully packaged and tracked every step of the way.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Every transaction is protected with industry-leading encryption, so you can shop with complete confidence.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col items-center text-center mb-16 gap-4"
        >
          <span className="uppercase tracking-[0.35em] text-xs text-[#777777]">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-light tracking-tight text-[#222222] max-w-xl">
            Considered Details, End to End
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-[#F8F7F5] border border-[#ECECEC] rounded-[36px] p-10 flex flex-col gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)] transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF9F7] border border-[#ECECEC] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#1A1816]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-light text-[#222222]">
                  {feature.title}
                </h3>
                <p className="text-[#777777] leading-8 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
