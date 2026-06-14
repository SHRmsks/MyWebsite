"use client";
// GameHUD — the React overlay drawn on top of the WebGL canvas. Purely presentational:
// it renders crosshair, prompts, loading/pause screens and the mobile buttons, and
// calls back into the engine for actions. All realtime state arrives via props.

import React, { useEffect, useState } from "react";

export default function GameHUD({
  phase, // 'loading' | 'ready' | 'error'
  progress = 0,
  message = "",
  inRange = false,
  locked = false,
  isMobile = false,
  onPet,
  onResume,
  onExit,
}) {
  const [portrait, setPortrait] = useState(false);

  // Track orientation for the mobile "rotate device" prompt.
  useEffect(() => {
    if (!isMobile) return;
    const check = () => setPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, [isMobile]);

  // ---- Loading ----
  if (phase === "loading") {
    const pct = Math.round(progress * 100);
    return (
      <Overlay>
        <div className="flex flex-col items-center gap-4">
          <p className="font-cyberpunk text-[#39c4b6] text-[22px] tracking-widest animate-pulse">
            INITIALIZING NEURAL LINK
          </p>
          <div className="w-[260px] h-[14px] border-2 border-[#39c4b6] p-[1px] overflow-hidden">
            <div
              className="h-full bg-[#39c4b6] transition-[width] duration-200 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="font-text text-[#05d9e8] text-[14px]">
            Streaming environment… {pct}%
          </p>
        </div>
      </Overlay>
    );
  }

  // ---- Error (e.g. WebGL context died) ----
  if (phase === "error") {
    return (
      <Overlay>
        <div className="flex flex-col items-center gap-4 text-center px-6">
          <p className="font-cyberpunk text-[#ff2d8d] text-[20px]">CONNECTION FAILED</p>
          <p className="font-text text-[#9fb6c2] text-[13px] max-w-[360px]">{message}</p>
          <HudButton onClick={onExit}>Enter Site →</HudButton>
        </div>
      </Overlay>
    );
  }

  // ---- Ready ----
  return (
    <>
      {/* Crosshair (non-interactive) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className={`rounded-full border transition-all duration-150 ${
            inRange
              ? "w-[14px] h-[14px] border-[#ff2d8d] shadow-[0_0_10px_#ff2d8d]"
              : "w-[7px] h-[7px] border-[#39c4b6]"
          }`}
        />
      </div>

      {/* Interaction prompt (desktop text; mobile uses the Pet button) */}
      {inRange && !isMobile && (
        <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 font-text text-[#05d9e8] text-[15px] bg-black/40 px-3 py-1 rounded border border-[#39c4b6]/50 backdrop-blur-sm">
          Press <span className="text-[#ff2d8d] font-bold">[E]</span> to pet the cat
        </div>
      )}

      {/* Exit-to-site button */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 z-30 font-cyberpunk text-[14px] text-[#05d9e8] border border-[#05d9e8]/60 px-3 py-1 rounded hover:bg-[#05d9e8]/10 transition"
      >
        Main ▸
      </button>

      {/* Controls hint */}
      {!isMobile ? (
        <div className="pointer-events-none absolute bottom-4 left-4 font-text text-[#39c4b6]/80 text-[12px] leading-5">
          <div>WASD — move</div>
          <div>Mouse — look</div>
          <div>E — pet · Esc — menu</div>
        </div>
      ) : (
        <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-text text-[#39c4b6]/70 text-[11px]">
          Left: move · Right: look
        </div>
      )}

      {/* Mobile Pet button */}
      {isMobile && (
        <button
          onClick={onPet}
          className={`absolute bottom-10 right-8 z-30 w-[88px] h-[88px] rounded-full font-cyberpunk text-[15px] border-2 transition active:scale-95 ${
            inRange
              ? "border-[#ff2d8d] text-[#ff2d8d] bg-[#ff2d8d]/15 shadow-[0_0_18px_#ff2d8d]"
              : "border-[#39c4b6]/40 text-[#39c4b6]/40"
          }`}
          disabled={!inRange}
        >
          PET
        </button>
      )}

      {/* Desktop pause menu (pointer lock released) */}
      {!isMobile && !locked && (
        <Overlay>
          <div className="flex flex-col items-center gap-5">
            <p className="font-cyberpunk text-[#39c4b6] text-[26px] tracking-widest">
              PAUSED
            </p>
            <HudButton onClick={onResume}>▶ Resume</HudButton>
            <HudButton onClick={onExit} variant="ghost">
              Enter Site
            </HudButton>
            <p className="font-text text-[#9fb6c2] text-[12px]">
              Click resume, then move with WASD and pet the cat with E.
            </p>
          </div>
        </Overlay>
      )}

      {/* Mobile rotate-device prompt */}
      {isMobile && portrait && (
        <Overlay>
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <div className="text-[40px] animate-[spin_2.4s_linear_infinite]">⟲</div>
            <p className="font-cyberpunk text-[#39c4b6] text-[18px]">ROTATE YOUR DEVICE</p>
            <p className="font-text text-[#9fb6c2] text-[13px]">
              The game runs in landscape.
            </p>
          </div>
        </Overlay>
      )}
    </>
  );
}

function Overlay({ children }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      {children}
    </div>
  );
}

function HudButton({ children, onClick, variant = "solid" }) {
  const base =
    "font-cyberpunk text-[16px] px-6 py-2 rounded border transition active:scale-95";
  const styles =
    variant === "ghost"
      ? "text-[#9fb6c2] border-[#9fb6c2]/40 hover:bg-white/5"
      : "text-[#05070d] bg-[#39c4b6] border-[#39c4b6] hover:bg-[#5ef6ef]";
  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}
