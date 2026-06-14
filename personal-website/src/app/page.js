"use client";
// Entry router. Capability decides what loads:
//   WebGL desktop / strong touch device -> the 3D game (Game)
//   no WebGL / weak device, or "exit to site" -> the scrollable Portfolio
// No URL segments: the portfolio is one page; the game is an in-place swap.

import React, { useState } from "react";
import useDeviceCapability from "@/hooks/useDeviceCapability.js";
import Game from "@/components/Game.jsx";
import Portfolio from "@/components/portfolio/Portfolio.jsx";

export default function Main() {
  const cap = useDeviceCapability();
  const [exited, setExited] = useState(false);

  const canPlayGame = cap.mode === "desktop" || cap.mode === "mobile";

  // Capability not yet detected — neutral boot splash that matches the SSR output
  // (so there is no hydration mismatch).
  if (!cap.ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#05070d] font-cyberpunk text-[20px] tracking-widest text-[#39c4b6] animate-pulse">
        BOOTING…
      </div>
    );
  }

  // Capable device that hasn't exited to the site -> the playable game.
  if (canPlayGame && !exited) {
    return <Game mode={cap.mode} onExit={() => setExited(true)} />;
  }

  // Everyone else -> the animated single-page portfolio.
  return <Portfolio canPlayGame={canPlayGame} onEnterGame={() => setExited(false)} />;
}
