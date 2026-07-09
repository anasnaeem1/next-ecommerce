"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const spring = {
  stiffness: 120,
  damping: 18,
  mass: 0.8,
};



export default function MouseFollowOverlay() {
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const x = useSpring(mouseX, spring);
const y = useSpring(mouseY, spring);

  useEffect(() => {
  const move = (e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  window.addEventListener("mousemove", move);

  return () => window.removeEventListener("mousemove", move);
}, []);


  return (
  <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
  <motion.div
  style={{
    x,
    y,
    translateX: "-50%",
    translateY: "-50%",
    rotate: 45,
    background: "#1A1816",
  }}
  animate={{
    boxShadow: [
      "0 0 0px rgb(222, 205, 205)",
      "0 0 12px rgba(220, 206, 157, 0.75)",
      "0 0 0px rgba(247, 243, 229, 0.72)",
    ],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute h-3 w-3 rotate-45 rounded-[2px]"
/>
</div>
  );
}