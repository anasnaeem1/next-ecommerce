"use client";

import { ProductType } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type ProductListProps = {
  products: ProductType[];
  number: number;
  listPage: boolean;
  New: boolean;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} satisfies Variants;

export default function ProductList({
  products,
  New,
}: ProductListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="flex flex-wrap gap-8 lg:gap-6"
    >
      {products?.map((product) => (
        <motion.div
          key={product._id}
          variants={cardVariants}
          whileHover={{
            y: -10,
            transition: { duration: 0.35 },
          }}
          className="w-full sm:w-[48%] lg:w-[23%]"
        >
          <Link
            href={`/${product.uniqueId}`}
            className="group block"
          >
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden rounded-[30px] bg-[#F7F6F3] border border-neutral-200 shadow-sm transition-shadow duration-500 group-hover:shadow-2xl">

              {product.images?.[0] && (
                <>
                  {product.images[1] ? (
                    <>
                      <Image
                        src={product.images[0]}
                        alt={product.productTitle}
                        fill
                        unoptimized
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-0"
                      />

                      <Image
                        src={product.images[1]}
                        alt={product.productTitle}
                        fill
                        unoptimized
                        className="object-cover opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
                      />
                    </>
                  ) : (
                    <Image
                      src={product.images[0]}
                      alt={product.productTitle}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </>
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/5 transition-all duration-500 group-hover:bg-black/20" />

              {/* Badge */}
              {New && (<motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute left-5 top-5 rounded-full bg-white/90 backdrop-blur-md px-4 py-1 text-[11px] uppercase tracking-[0.25em] font-medium"
              >
                NEW
              </motion.span>)}


              {/* Add To Cart */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileHover={{}}
                className="absolute bottom-5 left-5 right-5"
              >
                <button className="w-full rounded-full bg-black py-3 text-sm font-medium tracking-wide text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Add to Cart
                </button>
              </motion.div>
            </div>

            {/* INFO */}
            <div className="mt-5">

              <div className="flex items-start justify-between gap-3">
                <h2
                  className="line-clamp-1 text-[18px] font-semibold text-neutral-900"
                  title={product.productTitle}
                >
                  {product.productTitle}
                </h2>

                <span className="text-sm text-neutral-400 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                {product.productDesc}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <span className="text-xl font-semibold tracking-tight text-black">
                  ${product.offerPrice ?? product.basePrice}
                </span>

                <div className="h-px w-10 bg-neutral-300 transition-all duration-500 group-hover:w-16 group-hover:bg-black" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}