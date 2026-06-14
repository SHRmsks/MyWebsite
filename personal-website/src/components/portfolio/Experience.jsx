"use client";
// Experience — a vertical timeline of roles, driven by profile.experience.

import React from "react";
import { motion } from "motion/react";
import Section, { Reveal } from "./Section.jsx";
import { experience } from "@/data/profile.js";

const EASE = [0.16, 1, 0.3, 1];

export default function Experience() {
  return (
    <Section id="experience" index={2} title="Experience">
      <div className="relative ml-2 border-l-2 border-[#39c4b6]/30 pl-8">
        {experience.map((job, i) => (
          <Reveal key={job.org + job.period} delay={0.06 * i} className="relative pb-10 last:pb-0">
            {/* node on the rail */}
            <motion.span
              className="absolute -left-[41px] top-1 h-3 w-3 rounded-full bg-[#FCEE0A]"
              style={{ boxShadow: "0 0 12px #FCEE0A" }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.06 * i + 0.1 }}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-slant text-[22px] leading-tight text-[#e9fbff]">{job.role}</h3>
              <span className="border border-[#FCEE0A]/50 px-2 py-[2px] font-text text-[11px] tracking-[0.15em] text-[#FCEE0A]">
                {job.period}
              </span>
            </div>
            <p className="mt-1 font-cyberpunk text-[14px] text-[#05d9e8]">
              {job.org} <span className="text-[#7d97a0]">· {job.place}</span>
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {job.bullets.map((b, j) => (
                <li key={j} className="flex gap-2 font-text text-[13px] leading-[1.6] text-[#bcd6d0]">
                  <span className="mt-[6px] h-[5px] w-[5px] shrink-0 rotate-45 bg-[#ff2d8d]" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
