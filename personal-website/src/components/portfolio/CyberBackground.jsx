"use client";
// CyberBackground — fixed, behind-everything canvas for a living Cyberpunk-2077
// backdrop: a drifting neon "constellation" (cyan/yellow/pink particles + proximity
// lines), a synthwave perspective grid receding at the bottom, and a scan beam that
// sweeps down the screen. Performance-minded: counts scale with screen area and are
// capped, the loop pauses when the tab is hidden, DPR is clamped, and
// prefers-reduced-motion renders a single static frame.

import React, { useEffect, useRef } from "react";

const CYAN = [57, 196, 182];
const YELLOW = [252, 238, 10];
const PINK = [255, 45, 141];
const LINK_DIST = 130;

export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let particles = [];
    let raf = 0;
    let t = 0;

    const colorOf = (p) => (p.c === 0 ? CYAN : p.c === 1 ? YELLOW : PINK);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.floor((w * h) / 17000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: Math.random() < 0.18 ? 1 : Math.random() < 0.25 ? 2 : 0, // mostly cyan
      }));
    };

    const drawGrid = () => {
      // Synthwave perspective grid across the bottom ~38% of the screen.
      const horizon = h * 0.62;
      ctx.save();
      ctx.strokeStyle = "rgba(57,196,182,0.16)";
      ctx.lineWidth = 1;
      // Horizontal lines, denser toward the horizon, scrolling toward the viewer.
      for (let i = 0; i < 16; i++) {
        const f = (i + ((t * 0.04) % 1)) / 16; // 0..1 scrolling
        const y = horizon + f * f * (h - horizon);
        ctx.globalAlpha = 0.5 * (1 - f) + 0.1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // Vertical lines converging to a vanishing point.
      const vx = w / 2;
      ctx.globalAlpha = 0.18;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(vx + i * (w / 14), horizon);
        ctx.lineTo(vx + i * (w / 2.2), h);
        ctx.stroke();
      }
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drawGrid();

      // Constellation lines.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.16;
            ctx.strokeStyle = `rgba(57,196,182,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // Dots.
      for (const p of particles) {
        const c = colorOf(p);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scan beam sweeping down.
      const scanY = ((t * 0.9) % (h + 200)) - 100;
      const g = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      g.addColorStop(0, "rgba(252,238,10,0)");
      g.addColorStop(0.5, "rgba(252,238,10,0.10)");
      g.addColorStop(1, "rgba(252,238,10,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - 40, w, 80);
    };

    const step = () => {
      t += 1;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) draw();
    else raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
