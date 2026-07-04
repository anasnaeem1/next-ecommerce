"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CampaignBanner() {
  return (
   <section className="hidden lg:block w-full overflow-hidden">
  <div className="relative">

    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f7] via-white to-[#f6f5f3]" />
    <div className="absolute left-0 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-white blur-[150px]" />
    <div className="absolute right-0 top-0 h-full w-[40%] bg-gradient-to-l from-neutral-100/60 to-transparent" />

    <div className="relative flex items-center py-6 justify-between px-16 xl:px-24 2xl:px-36">

      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[430px]"
      >
        <span className="text-[10px] uppercase tracking-[0.45em] text-neutral-400">
          SUMMER COLLECTION
        </span>

        <h1 className="mt-4 text-[48px] leading-[1.05] font-extralight tracking-tight text-neutral-900">
          Grab up to
          <br />
          <span className="font-medium">50% OFF</span> on
          <br />
          Selected Products
        </h1>

        <p className="mt-5 max-w-sm text-[15px] leading-7 text-neutral-500">
          Premium essentials crafted with timeless design,
          luxurious fabrics and modern elegance.
        </p>

        <Link href="/list">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="mt-7 rounded-full bg-black px-7 py-3 text-sm font-medium text-white"
          >
            Shop Collection
          </motion.button>
        </Link>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative flex justify-end"
      >
        <div className="absolute bottom-6 h-44 w-44 rounded-full bg-neutral-300/30 blur-[110px]" />

        <div className="relative">
          <Image
            src="/woman.png"
            alt="Campaign"
            width={540}
            height={340}
            priority
            className="relative z-10 object-contain"
          />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#faf9f7] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#faf9f7] to-transparent" />
        </div>
      </motion.div>

    </div>
  </div>
</section>
  );
}