"use client";
// Guestbook — "sign in" by throwing a dart at a neon world map; where it lands, a
// footstep pin drops with your name. All footsteps render on the map. Storage is in
// src/lib/guestbook.js (localStorage for now; swap to a shared backend later and
// this component is unchanged).

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Section from "./Section.jsx";
import { loadFootsteps, addFootstep } from "@/lib/guestbook.js";

function Dart() {
  return (
    <svg
      width="20"
      height="46"
      viewBox="0 0 20 46"
      className="drop-shadow-[0_0_8px_#FCEE0A]"
    >
      {/* flights */}
      <path d="M10 0 L3 8 L10 6 L17 8 Z" fill="#39c4b6" />
      {/* shaft */}
      <rect x="9" y="4" width="2" height="30" fill="#cfeae5" />
      {/* tip */}
      <path d="M10 46 L6 32 L14 32 Z" fill="#FCEE0A" />
    </svg>
  );
}

function Pin({ name, fresh, is_owner }) {
  const pulseRing = is_owner ? "bg-[#00ff00]/60" : "bg-[#FCEE0A]/60";
  const markerColor = is_owner
    ? `bg-[#00ff00] shadow-[0_0_8px_#00ff00]`
    : `bg-[#FCEE0A] shadow-[0_0_8px_#FCEE0A]`;
  return (
    // FIX: Changed -translate-y-full to -translate-y-1/2 so the dot drops dead-center on the coordinate
    <div className="group relative -translate-x-1/2 -translate-y-1/2">
      <motion.div
        initial={fresh ? { scale: 0, y: -10 } : false}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 16 }}
        className="relative"
      >
        {/* pulse ring */}
        <span
          className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full ${pulseRing}`}
        />
        {/* marker diamond */}
        <span
          className={`block h-[6px] w-[6px] rotate-45 border border-[#05070d] ${markerColor}`}
        />
      </motion.div>
      {/* name label on hover */}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-[#39c4b6]/50 bg-[#05070d]/90 px-2 py-[2px] font-text text-[10px] text-[#cfeae5] opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </span>
    </div>
  );
}

export default function Guestbook() {
  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [svg, setSvg] = useState(null);
  const [footsteps, setFootsteps] = useState([]);
  const [pending, setPending] = useState(null); // {x,y} dart thrown, awaiting name
  const [throwId, setThrowId] = useState(0);
  const [landed, setLanded] = useState(false);
  const [name, setName] = useState("");

  // Load existing footsteps once on mount.
  useEffect(() => {
    loadFootsteps().then((data) => {
      setFootsteps(data);
    });
  }, []);

  // Lazy-fetch the world map only when the section scrolls into view.
  // Lazy-fetch the world map only when the section scrolls into view.
  useEffect(() => {
    if (!inView || svg) return;
    fetch("/world.svg")
      .then((r) => r.text())
      .then((raw) => {
        // Use DOMParser to safely edit ONLY the root <svg> tag, preserving all internal paths
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, "image/svg+xml");
        const svgEl = doc.querySelector("svg");

        if (svgEl) {
          // Force perfect 3D-engine mapping proportions
          svgEl.setAttribute("viewBox", "0 0 1009.673 665.963");
          svgEl.setAttribute("preserveAspectRatio", "none");
          svgEl.setAttribute("width", "100%");
          svgEl.setAttribute("height", "100%");
          setSvg(svgEl.outerHTML);
        } else {
          setSvg(raw);
        }
      })
      .catch(() => setSvg(""));
  }, [inView, svg]);

  const throwDart = (e) => {
    if (pending) return; // one dart at a time
    const rect = mapRef.current.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : e;
    const x = ((point.clientX - rect.left) / rect.width) * 100;
    const y = ((point.clientY - rect.top) / rect.height) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    setPending({ x, y });
    setLanded(false);
    setThrowId((n) => n + 1);
    // Reveal the name form on a fixed timer (don't depend on the dart's spring
    // finishing — animations can be throttled on slow/background tabs).
    window.setTimeout(() => setLanded(true), 450);
  };

  const plant = async (e) => {
    e.preventDefault();
    const fs = await addFootstep({
      name: name.trim() || "Anonymous",
      x: pending.x,
      y: pending.y,
    });
    setFootsteps((prev) => [...prev, { ...fs, _fresh: true }]);
    setPending(null);
    setName("");
  };

  const cancel = () => {
    setPending(null);
    setName("");
  };

  return (
    <Section id="guestbook" index={5} title="Sign In">
      <div ref={sectionRef}>
        <p className="mb-2 font-cyberpunk text-[14px] text-[#bcd6d0]">
          Establishing connections from the World ...
        </p>
        <p className="mb-6 font-text text-[13px] text-[#FCEE0A]">
          ◈ {footsteps.length} Edge Runners{footsteps.length === 1 ? "" : "s"}{" "}
          have left their marks
        </p>

        <div
          ref={mapRef}
          onClick={throwDart}
          onTouchStart={throwDart}
          className="relative aspect-[16/9] w-full cursor-crosshair overflow-hidden rounded-md border border-[#39c4b6]/40 bg-[#070d14] [&_path]:fill-[#0e1c26] [&_path]:stroke-[#2ea3ad] [&_svg]:h-full [&_svg]:w-full"
          style={{
            aspectRatio: "1009.673 / 665.963", // Exact SVG aspect ratio!
            boxShadow: "inset 0 0 60px rgba(57,196,182,0.15)",
          }}
        >
          {/* neon world map */}
          {svg ? (
            <div
              className="pointer-events-none absolute inset-0 opacity-80 [&_path]:[stroke-width:0.4px]"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center font-text text-[12px] text-[#39c4b6]/60">
              loading map…
            </div>
          )}

          {/* saved footsteps */}
          {footsteps.length > 0 &&
            footsteps.map((f) => (
              <div
                key={f.id}
                className="absolute"
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
              >
                <Pin name={f.name} fresh={f._fresh} is_owner={f.is_owner} />
              </div>
            ))}

          {/* in-flight / landed dart */}
          <AnimatePresence>
            {pending && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
              >
                <motion.div
                  key={throwId}
                  initial={{ x: -160, y: -340, rotate: -70, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 17 }}
                  onAnimationComplete={() => setLanded(true)}
                >
                  <Dart />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* name panel after the dart lands */}
          {pending && landed && (
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={plant}
              className="absolute left-1/2 top-full z-10 flex -translate-x-1/2 -translate-y-[calc(100%+12px)] items-center gap-2 rounded border border-[#FCEE0A]/60 bg-[#05070d]/95 p-2 backdrop-blur-sm"
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="Your name / country"
                className="w-[180px] bg-transparent px-2 py-1 font-text text-[13px] text-[#cfeae5] outline-none placeholder:text-[#5f7780]"
              />
              <button
                type="submit"
                className="border border-[#FCEE0A] bg-[#FCEE0A]/15 px-3 py-1 font-cyberpunk text-[12px] text-[#FCEE0A] transition hover:bg-[#FCEE0A]/25"
              >
                Plant ◈
              </button>
              <button
                type="button"
                onClick={cancel}
                className="px-2 font-cyberpunk text-[14px] text-[#ff2d8d]"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
