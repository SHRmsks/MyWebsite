"use client";
import React, { useEffect, useRef, useState } from "react";
import GameHUD from "./GameHUD.jsx";

export default function Game({ mode = "desktop", onExit }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const [hud, setHud] = useState({ phase: "loading", progress: 0 });

  // 1. MOBILE FULLSCREEN & EXIT LOGIC
  useEffect(() => {
    if (mode !== "mobile") return;

    const handleInteraction = () => {
      try {
        const doc = window.document.documentElement;
        const requestFS =
          doc.requestFullscreen ||
          doc.webkitRequestFullscreen ||
          doc.msRequestFullscreen;

        const isFullscreen =
          document.fullscreenElement || document.webkitFullscreenElement;

        // Enter fullscreen on first tap
        if (requestFS && !isFullscreen) {
          const promise = requestFS.call(doc);
          if (promise && promise.catch) {
            promise.catch(() => {});
          }
        }
      } catch (err) {}

      // Once fired, remove the listeners immediately so it doesn't run on every single tap
      window.removeEventListener("touchend", handleInteraction, {
        capture: true,
      });
      window.removeEventListener("click", handleInteraction, { capture: true });
    };

    // THE FIX: { capture: true } catches the tap from the top down,
    // BEFORE the joystick (nipplejs) can swallow the event!
    window.addEventListener("touchend", handleInteraction, {
      capture: true,
      passive: true,
    });
    window.addEventListener("click", handleInteraction, {
      capture: true,
      passive: true,
    });

    // CLEANUP: explicitly exit fullscreen when returning to Main
    return () => {
      window.removeEventListener("touchend", handleInteraction, {
        capture: true,
      });
      window.removeEventListener("click", handleInteraction, { capture: true });

      try {
        const isFullscreen =
          document.fullscreenElement || document.webkitFullscreenElement;
        // If we are still in fullscreen when leaving the game, force it to exit
        if (isFullscreen) {
          const exitFS =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen;

          if (exitFS) {
            const promise = exitFS.call(document);
            if (promise && promise.catch) promise.catch(() => {});
          }
        }
      } catch (err) {
        // Silently catch in case the browser blocks the exit request
      }
    };
  }, [mode]);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    (async () => {
      const { GameEngine } = await import("@/game/engine.js");
      if (cancelled || !containerRef.current) return;
      engineRef.current = new GameEngine(containerRef.current, {
        controlMode: mode === "mobile" ? "mobile" : "desktop",
        onState: (partial) => setHud((prev) => ({ ...prev, ...partial })),
      });
    })();

    return () => {
      cancelled = true;
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    if (hud.phase !== "portal") return;
    const t = setTimeout(() => onExit?.(), 2000);
    return () => clearTimeout(t);
  }, [hud.phase, onExit]);

  return (
    // Dynamic Viewport Height [100dvh] ensures it fits under mobile URL bars properly
    <div className="fixed inset-0 w-screen h-[100dvh] overflow-hidden bg-[#05070d]">
      <div ref={containerRef} className="absolute inset-0" />
      <GameHUD
        {...hud}
        isMobile={mode === "mobile"}
        onInteract={() => engineRef.current?.requestInteract()}
        onResume={() => engineRef.current?.requestLock()}
        onExit={onExit}
        onConfirmDart={(name, x, y) =>
          engineRef.current?.confirmDart(name, x, y)
        }
        onCancelDart={() => engineRef.current?.cancelDart()}
      />
    </div>
  );
}
