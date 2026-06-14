"use client";
// Game — thin React wrapper that mounts the vanilla GameEngine into a full-screen
// container and bridges its state to the GameHUD overlay. The engine does all the
// realtime work; React just reflects HUD state and forwards button actions.

import React, { useEffect, useRef, useState } from "react";
import GameHUD from "./GameHUD.jsx";

export default function Game({ mode = "desktop", onExit }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [hud, setHud] = useState({ phase: "loading", progress: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    // Import the engine (three + cannon + nipplejs) only in the browser. This
    // keeps the heavy 3D bundle out of SSR and off the critical path for visitors
    // who never load the game.
    (async () => {
      const { GameEngine } = await import("@/game/engine.js");
      if (cancelled || !containerRef.current) return;
      engineRef.current = new GameEngine(containerRef.current, {
        controlMode: mode === "mobile" ? "mobile" : "desktop",
        // Merge partial state updates so we don't clobber unrelated fields.
        onState: (partial) => setHud((prev) => ({ ...prev, ...partial })),
      });
    })();

    return () => {
      cancelled = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#05070d]">
      <div ref={containerRef} className="absolute inset-0" />
      <GameHUD
        {...hud}
        isMobile={mode === "mobile"}
        onPet={() => engineRef.current?.requestPet()}
        onResume={() => engineRef.current?.requestLock()}
        onExit={onExit}
      />
    </div>
  );
}
