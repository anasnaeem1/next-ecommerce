"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategory } from "../../context/CategoryContext";
import { motion, type Transition } from "framer-motion";
import type { Variants } from "framer-motion";


const cardVariants = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} satisfies Variants;

export default function CategoryList() {
  const { categories, loading, error } = useCategory();

  const defaultImage =
    "https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900";

  if (loading)
    return (
      <div className="py-24 text-center text-neutral-500">
        Loading Categories...
      </div>
    );

  if (error)
    return (
      <div className="py-24 text-center text-red-500">
        Failed to load categories.
      </div>
    );

  const parentCategories = Object.keys(categories);

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      className=" px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64"
    >
      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mb-16 flex items-end justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-neutral-400">
            Collections
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900">
            Shop by Category
          </h2>
        </div>

        <div className="hidden md:block h-px w-32 bg-neutral-300" />
      </motion.div>

      {/* Cards */}

      <div className="scroll-hide overflow-x-auto">
        <div className="flex gap-8 pb-6">
          {parentCategories.map((parentKey) => {
            const category = categories[parentKey];

            return (
              <motion.div
                key={parentKey}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="min-w-[280px] lg:min-w-[320px]"
              >
                <Link
                  href={`/list?category=${parentKey}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                    <div className="relative aspect-[3/4] overflow-hidden">

                      <motion.div
                        whileHover={{
                          scale: 1.08,
                        }}
                        transition={{
                          duration: 0.9,
                        }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={category.Image || defaultImage}
                          alt={category.label}
                          fill
                          sizes="30vw"
                          className="object-cover opacity-90"
                        />
                      </motion.div>

                      {/* Gradient */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-90" />

                      {/* Glass highlight */}

                      <div className="absolute inset-0 bg-white/5 opacity-0 transition duration-500 group-hover:opacity-100" />

                      {/* Border */}

                      <div className="absolute inset-0 rounded-[30px] ring-1 ring-white/10 transition duration-500 group-hover:ring-white/30" />

                      {/* Text */}

                      <div className="absolute bottom-7 left-7 z-20">
                        <h3 className="text-2xl font-semibold text-white">
                          {category.label}
                        </h3>

                        <div className="mt-4 flex items-center gap-3">
                          <span className="text-sm tracking-wide text-white/80">
                            Explore Collection
                          </span>

                          <motion.div
                            initial={{ width: 0 }}
                            whileHover={{ width: 40 }}
                            transition={{ duration: 0.4 }}
                            className="h-px bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}