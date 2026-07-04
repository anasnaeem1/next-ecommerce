"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "./animations";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 12, suffix: "+", label: "Years Experience" },
  { value: 250, suffix: "+", label: "Premium Products" },
  { value: 15, suffix: "k+", label: "Happy Customers" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1600;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic for a gentle deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-24">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="bg-[#1A1816] rounded-[36px] px-6 sm:px-10 lg:px-16 py-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-3"
              >
                <span className="text-4xl md:text-5xl font-light tracking-tight text-[#FAF9F7]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="uppercase tracking-[0.25em] text-xs text-[#B8B4AF]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
