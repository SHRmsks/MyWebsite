"use client";
// useDeviceCapability
// Decides what the visitor should get on load:
//   - "desktop"   : WebGL-capable computer  -> full 3D game (mouse + WASD)
//   - "mobile"    : WebGL-capable strong touch device -> 3D game + on-screen joystick
//   - "portfolio" : no WebGL, software renderer, or a weak phone -> animated site
//
// Detection runs once on the client (it touches window/navigator), so the hook
// returns `ready:false` until then. A `?mode=desktop|mobile|portfolio` query override
// is supported for testing.

import { useEffect, useState } from "react";

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return { ok: false, renderer: "" };
    let renderer = "";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "";
    return { ok: true, renderer: String(renderer).toLowerCase() };
  } catch {
    return { ok: false, renderer: "" };
  }
}

// Heuristic device power. Touch devices must clear a higher bar to run the game.
function detectTier(isTouch, renderer) {
  const mem = navigator.deviceMemory || 0; // GB (Chrome only; 0 = unknown)
  const cores = navigator.hardwareConcurrency || 0;
  const software = /swiftshader|llvmpipe|software|basic render/.test(renderer);
  if (software) return "low";
  if (isTouch) {
    // Be conservative on phones unless they look reasonably capable.
    if (mem && mem < 4) return "low";
    if (cores && cores < 4) return "low";
    return "high";
  }
  return "high"; // desktop with a real GPU
}

function computeMode() {
  const params = new URLSearchParams(window.location.search);
  const override = params.get("mode");
  if (override === "desktop" || override === "mobile" || override === "portfolio") {
    return { mode: override, webgl: true, isTouch: override === "mobile", tier: "high", forced: true };
  }

  const { ok: webgl, renderer } = detectWebGL();
  const isTouch =
    "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;
  const tier = detectTier(isTouch, renderer);

  let mode;
  if (!webgl || tier === "low") mode = "portfolio";
  else if (isTouch) mode = "mobile";
  else mode = "desktop";

  return { mode, webgl, isTouch, tier, forced: false };
}

export default function useDeviceCapability() {
  const [cap, setCap] = useState({ ready: false, mode: "portfolio" });

  useEffect(() => {
    setCap({ ready: true, ...computeMode() });
  }, []);

  return cap;
}
