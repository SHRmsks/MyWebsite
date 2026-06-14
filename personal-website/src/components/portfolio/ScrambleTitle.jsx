"use client";
// ScrambleTitle — fires the original cyberpunk text-scramble (MatrixEffect) the
// first time it scrolls into view. Used for section headers and the hero name so
// the signature "decrypting text" animation shows throughout the site.

import React, { useRef } from "react";
import { useInView } from "motion/react";
import MatrixEffect from "@/utility/randomText.js";

export default function ScrambleTitle({
  text,
  className,
  font = "slant",
  speed = 14, // ms per character — fast, as requested
  flicker = 9,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <span ref={ref} className="inline-block">
      {inView ? (
        <MatrixEffect
          finalText={text}
          speed={speed}
          flickerspeed={flicker}
          text={font}
          className={className}
        />
      ) : (
        // Reserve layout space (and stay invisible) until it scrambles in.
        <span className={className} style={{ visibility: "hidden" }}>
          {text}
        </span>
      )}
    </span>
  );
}
