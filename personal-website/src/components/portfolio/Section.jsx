"use client";
// Section — a reusable section shell with a cyberpunk header and a scroll-reveal.
// `Reveal` is a small in-view fade-up wrapper used throughout the page so every
// block animates in buttery-smooth as it scrolls into view.

import React from "react";
import { motion } from "motion/react";
import ScrambleTitle from "./ScrambleTitle.jsx";

const EASE = [0.16, 1, 0.3, 1]; // expo-out: snappy then settles

export function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Section({
  id,
  index,
  title,
  children,
  className = "",
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-[1200px] scroll-mt-20 px-5 py-20 sm:px-8 md:py-28 ${className}`}
    >
      <Reveal>
        <div className="mb-10 flex items-end gap-4">
          <h2 className="leading-none">
            <ScrambleTitle
              text={title}
              className="font-slant text-[34px] leading-none text-[#FCEE0A] drop-shadow-[0_0_14px_rgba(252,238,10,0.35)] sm:text-[46px]"
            />
          </h2>
        </div>
        <motion.div
          className="h-[2px] origin-left bg-gradient-to-r from-[#39c4b6] via-[#39c4b6]/40 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}
