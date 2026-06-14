"use client";
// Skills — the "character sheet": an SVG attribute radar beside animated stat bars,
// plus the grouped tech "arsenal" chips.

import React from "react";
import { motion } from "motion/react";
import Section, { Reveal } from "./Section.jsx";
import SkillRadar from "./SkillRadar.jsx";
import { profile } from "@/data/profile.js";

function StatBar({ label, value, delay }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-[120px] shrink-0 font-text text-[12px] tracking-[0.12em] text-[#9fd8d0]">
        {label}
      </span>
      <div className="relative h-[10px] flex-1 overflow-hidden border border-[#39c4b6]/40 bg-black/30">
        <motion.div
          className="h-full bg-gradient-to-r from-[#39c4b6] to-[#FCEE0A]"
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / 10) * 100}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
      <span className="w-[28px] text-right font-cyberpunk text-[13px] text-[#FCEE0A]">{value}</span>
    </div>
  );
}

export default function Skills() {
  return (
    <Section id="skills" index={3} title="Skills">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <SkillRadar attributes={profile.attributes} />
        </Reveal>
        <div className="flex flex-col gap-4">
          {profile.attributes.map((a, i) => (
            <StatBar key={a.label} label={a.label} value={a.value} delay={0.05 * i} />
          ))}
        </div>
      </div>

      {/* Arsenal — grouped tech chips */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(profile.stack).map(([group, items], gi) => (
          <Reveal key={group} delay={0.06 * gi}>
            <p className="mb-3 font-text text-[11px] tracking-[0.25em] text-[#ff2d8d]">
              ▣ {group.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map((it) => (
                <motion.span
                  key={it}
                  whileHover={{ y: -3, borderColor: "#FCEE0A", color: "#FCEE0A" }}
                  className="cursor-default border border-[#39c4b6]/40 bg-black/30 px-2 py-1 font-text text-[12px] text-[#bcd6d0]"
                >
                  {it}
                </motion.span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
