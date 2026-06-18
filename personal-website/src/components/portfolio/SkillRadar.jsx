"use client";
import React, { useMemo } from "react";
import { motion } from "motion/react";

// 1. Increased SIZE to give text plenty of breathing room (was 340)
const SIZE = 420;
const C = SIZE / 2;
// 2. Slightly reduced the web radius to pull it inward (was 122)
const R = 115;
const MAX = 10;

function point(level, i, n, radius = R) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [
    C + Math.cos(angle) * radius * level,
    C + Math.sin(angle) * radius * level,
  ];
}

export default function SkillRadar({ attributes }) {
  const n = attributes.length;

  const rings = [0.25, 0.5, 0.75, 1];
  const gridPolys = rings.map((lvl) =>
    attributes.map((_, i) => point(lvl, i, n).join(",")).join(" "),
  );

  const dataPoly = useMemo(
    () =>
      attributes
        .map((a, i) => point(Math.min(a.value, MAX) / MAX, i, n).join(","))
        .join(" "),
    [attributes, n],
  );

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full max-w-[420px]" // Updated max-width to match the new size
      role="img"
      aria-label="Skill attributes radar"
    >
      {/* grid rings */}
      {gridPolys.map((pts, idx) => (
        <polygon
          key={idx}
          points={pts}
          fill="none"
          stroke="rgba(57,196,182,0.18)"
          strokeWidth="1"
        />
      ))}

      {/* axis spokes + labels */}
      {attributes.map((a, i) => {
        const [x, y] = point(1, i, n);
        // 3. Pushed the text a bit further out from the web edge (R + 30 instead of R + 22)
        const [lx, ly] = point(1, i, n, R + 30);
        const anchor =
          Math.abs(lx - C) < 6 ? "middle" : lx > C ? "start" : "end";
        return (
          <g key={a.label}>
            <line
              x1={C}
              y1={C}
              x2={x}
              y2={y}
              stroke="rgba(57,196,182,0.15)"
              strokeWidth="1"
            />
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="font-text"
              fontSize="10"
              fill="#9fd8d0"
            >
              {a.label}
            </text>
          </g>
        );
      })}

      {/* data polygon, scales in from the centre */}
      <motion.polygon
        points={dataPoly}
        fill="rgba(57,196,182,0.28)"
        stroke="#39c4b6"
        strokeWidth="2"
        style={{
          originX: "50%",
          originY: "50%",
          filter: "drop-shadow(0 0 6px rgba(57,196,182,0.6))",
        }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
      />

      {/* vertex dots */}
      {attributes.map((a, i) => {
        const [x, y] = point(Math.min(a.value, MAX) / MAX, i, n);
        return <circle key={i} cx={x} cy={y} r="3" fill="#fee801" />;
      })}
    </svg>
  );
}
