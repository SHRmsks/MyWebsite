"use client";
// ScrollRocket — a neon probe that descends a side rail in sync with scroll
// progress, with a flickering thruster trailing behind it. Pure scroll-linked
// motion (no rAF of its own), hidden on small screens.

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

export default function ScrollRocket() {
  const { scrollYProgress } = useScroll();
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, 84]); // % of rail
  const y = useSpring(yRaw, { stiffness: 70, damping: 22, mass: 0.4 });
  const top = useTransform(y, (v) => `${v}vh`);

  return (
    <div className="pointer-events-none fixed right-5 top-0 z-30 hidden h-screen w-10 md:block">
      {/* rail */}
      <div className="absolute right-[18px] top-[8vh] h-[84vh] w-[2px] bg-gradient-to-b from-[#39c4b6]/40 via-[#39c4b6]/10 to-[#FCEE0A]/40" />
      {/* progress fill */}
      <motion.div
        className="absolute right-[18px] top-[8vh] w-[2px] origin-top bg-[#FCEE0A]"
        style={{ height: "84vh", scaleY: scrollYProgress }}
      />
      <motion.div style={{ top }} className="absolute right-[6px] top-[6vh]">
        {/* thruster flame (trails above as it descends) */}
        <motion.div
          className="mx-auto h-5 w-[6px] rounded-full bg-gradient-to-t from-[#FCEE0A] via-[#ff8a00] to-transparent blur-[1px]"
          animate={{ scaleY: [1, 0.55, 1.2, 0.8, 1], opacity: [0.9, 0.6, 1, 0.7, 0.9] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* probe body */}
        <svg width="26" height="34" viewBox="0 0 26 34" className="drop-shadow-[0_0_8px_rgba(57,196,182,0.7)]">
          <path d="M13 34 L4 22 L4 10 Q13 -2 22 10 L22 22 Z" fill="#0a1a1f" stroke="#39c4b6" strokeWidth="1.5" />
          <circle cx="13" cy="13" r="3.2" fill="#FCEE0A" />
          <path d="M4 18 L0 26 L4 24 Z" fill="#39c4b6" />
          <path d="M22 18 L26 26 L22 24 Z" fill="#39c4b6" />
        </svg>
      </motion.div>
    </div>
  );
}
