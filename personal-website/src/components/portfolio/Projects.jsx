"use client";
// Projects — a cyberpunk "skill tree": a glowing central spine with hexagonal
// project nodes branching off it. Activating a node opens <ProjectModal> with the
// project's demo + stats. Nodes/lines draw in as you scroll for that game feel.

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Section from "./Section.jsx";
import ProjectModal from "./ProjectModal.jsx";
import { projects } from "@/data/projects.js";

const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";
const EASE = [0.16, 1, 0.3, 1];

function ProjectNode({ project, side, index, onOpen }) {
  const left = side === "left";
  return (
    <div className="relative flex w-full justify-center">
      {/* connector from spine to the side card (md+) */}
      <motion.div
        className={`absolute top-[39px] hidden h-[2px] bg-[#39c4b6]/50 md:block ${
          left ? "right-1/2 mr-[38px]" : "left-1/2 ml-[38px]"
        }`}
        style={{ width: 46, transformOrigin: left ? "right" : "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
      />

      {/* node */}
      <motion.button
        onClick={onOpen}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 200, damping: 16, delay: index * 0.05 }}
        whileHover={{ scale: 1.12 }}
        className="group relative z-10 grid h-[78px] w-[78px] place-items-center"
        aria-label={`Open ${project.name}`}
      >
        {/* pulsing aura */}
        <motion.span
          className="absolute h-[78px] w-[78px] border-2 border-[#39c4b6]"
          style={{ clipPath: HEX }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="grid h-[78px] w-[78px] place-items-center border-2 border-[#39c4b6] bg-[#0a0f15] transition-colors group-hover:border-[#05d9e8]"
          style={{ clipPath: HEX, boxShadow: "0 0 18px rgba(57,196,182,0.35)" }}
        >
          {project.icon ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={project.icon} alt="" className="h-9 w-9 object-contain" />
          ) : (
            <span className="font-cyberpunk text-[20px] text-[#39c4b6]">{index + 1}</span>
          )}
        </span>
      </motion.button>

      {/* side card */}
      <motion.div
        initial={{ opacity: 0, x: left ? 24 : -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className={`mt-4 w-full max-w-[300px] cursor-pointer text-center md:absolute md:top-1/2 md:mt-0 md:w-[280px] md:-translate-y-1/2 ${
          left
            ? "md:right-1/2 md:mr-[96px] md:text-right"
            : "md:left-1/2 md:ml-[96px] md:text-left"
        }`}
        onClick={onOpen}
      >
        <h3 className="font-slant text-[22px] leading-tight text-[#e9fbff]">{project.name}</h3>
        <p className="font-text text-[12px] tracking-[0.18em] text-[#39c4b6]">{project.framework}</p>
        <p className="mt-1 font-text text-[12px] leading-[1.6] text-[#9fb6b0]">
          {project.intro}
        </p>
        <span className="mt-2 inline-block font-cyberpunk text-[12px] text-[#ff2d8d]">
          ◇ View demo
        </span>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <Section id="projects" index={4} title="Projects">
      <div className="relative mx-auto flex max-w-[820px] flex-col items-center gap-20 py-4">
        {/* central spine */}
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 origin-top bg-gradient-to-b from-[#39c4b6] via-[#39c4b6]/50 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        {/* flowing data-pulses streaming down the spine */}
        {[0, 1.6].map((delay) => (
          <motion.div
            key={delay}
            aria-hidden
            className="pointer-events-none absolute left-1/2 h-12 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-[#FCEE0A] to-transparent blur-[1px]"
            initial={{ top: "-8%", opacity: 0 }}
            animate={{ top: ["-8%", "108%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay }}
          />
        ))}
        {projects.map((p, i) => (
          <ProjectNode
            key={p.id}
            project={p}
            side={i % 2 === 0 ? "left" : "right"}
            index={i}
            onOpen={() => setActive(p)}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </Section>
  );
}
