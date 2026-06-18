"use client";
// Hero — full-viewport landing for the portfolio. Big glitchy name, role, a faux
// "target scan" line that shows the visitor's detected IP/OS (reusing /api/ip), and
// a scroll cue. If the device can run the 3D scene, a button drops into the game.

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import MatrixEffect from "@/utility/randomText.js";
import { profile } from "@/data/profile.ts";

const EASE = [0.16, 1, 0.3, 1];

export default function Hero({ canPlayGame, onEnterGame }) {
  const [scan, setScan] = useState("scanning target…");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/ip", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setScan(`${d.os || "unknown"} · ${d.ip || "unknown"}`))
      .catch(() => setScan("signal lost"));
    return () => controller.abort();
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="font-text text-[13px] tracking-[0.35em] text-[#39c4b6]"
      >
        ◢ TARGET ACQUIRED · {scan} ◣
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="mt-4"
      >
        <MatrixEffect
          finalText={profile.name.toUpperCase()}
          speed={55}
          flickerspeed={24}
          text="slant"
          className="font-slant text-[64px] leading-[0.9] text-[#FCEE0A] drop-shadow-[0_0_28px_rgba(252,238,10,0.5)] sm:text-[120px]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
        className="mt-2"
      >
        <span className="font-cyberpunk text-[20px] text-[#05d9e8] sm:text-[28px]">
          {profile.title}
        </span>
        <p className="mt-2 font-text text-[13px] tracking-[0.2em] text-[#9fb6c2] sm:text-[15px]">
          {profile.tagline}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="#projects"
          onClick={smoothScroll("projects")}
          className="rounded-sm border border-[#39c4b6] bg-[#39c4b6]/10 px-6 py-3 font-cyberpunk text-[15px] text-[#39c4b6] transition hover:bg-[#39c4b6]/20"
        >
          View Projects ▾
        </a>
        {canPlayGame && (
          <button
            onClick={onEnterGame}
            className="rounded-sm border border-[#ff2d8d] px-6 py-3 font-cyberpunk text-[15px] text-[#ff2d8d] transition hover:bg-[#ff2d8d]/10"
          >
            Launch Game ►
          </button>
        )}
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="font-text text-[12px] tracking-[0.3em] text-[#39c4b6]/70"
        >
          SCROLL ▾
        </motion.div>
      </motion.div>
    </section>
  );
}

// Small helper so in-page anchors scroll smoothly without changing the URL.
export function smoothScroll(id) {
  return (e) => {
    e.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
