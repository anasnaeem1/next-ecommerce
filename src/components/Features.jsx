"use client";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Truck,
  ShieldCheck,
  BadgeCheck,
  Headphones,
} from "lucide-react";


const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const features = [
  {
    icon: <Truck size={28} strokeWidth={1.8} />,
    title: "Free Shipping",
    description: "On all orders over $100",
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={1.8} />,
    title: "Secure Payments",
    description: "100% Secure Checkout",
  },
  {
    icon: <BadgeCheck size={28} strokeWidth={1.8} />,
    title: "Premium Quality",
    description: "Carefully Selected Products",
  },
  {
    icon: <Headphones size={28} strokeWidth={1.8} />,
    title: "24/7 Support",
    description: "We're Here To Help",
  },
];

export default function Features() {
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="px-4 md:px-8 lg:px-16 xl:px-32 py-20"
    >
      <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[#1A1816] shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-y-0 md:divide-x lg:grid-cols-4">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
              }}
              className="group relative overflow-hidden px-8 py-9"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
                  {feature.icon}
                </div>

                <div>
                  <h3 className="text-[15px] font-semibold tracking-[0.08em] text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-8 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}