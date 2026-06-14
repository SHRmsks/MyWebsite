"use client";
// ProjectModal — opens when a skill-tree node is activated. Shows the project's
// demo (via the modular <ProjectDemo>), its blurb, tags, and skill-point bars.

import React, { useEffect } from "react";
import { motion } from "motion/react";
import ProjectDemo from "./ProjectDemo.jsx";
import { SKILL_AXES } from "@/data/projects.js";

const PANEL_CLIP =
  "polygon(0 18px, 18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)";

export default function ProjectModal({ project, onClose }) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative max-h-[88vh] w-full max-w-[760px] overflow-y-auto bg-[#0a0f15] p-[2px]"
        style={{ clipPath: PANEL_CLIP, boxShadow: "0 0 40px rgba(57,196,182,0.25)" }}
      >
        <div className="bg-[#0a0f15] p-6" style={{ clipPath: PANEL_CLIP }}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.icon && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={project.icon} alt="" className="h-9 w-9 object-contain" />
              )}
              <div>
                <h3 className="font-slant text-[26px] leading-none text-[#e9fbff]">{project.name}</h3>
                <p className="font-text text-[12px] tracking-[0.2em] text-[#39c4b6]">
                  {project.framework}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="font-cyberpunk text-[18px] text-[#ff2d8d] transition hover:scale-110"
            >
              ✕
            </button>
          </div>

          <p className="mb-5 font-text text-[14px] leading-[1.7] text-[#bcd6d0]">{project.intro}</p>

          <div className="mb-5">
            <ProjectDemo demo={project.demo} title={project.name} />
          </div>

          {project.tags?.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="border border-[#39c4b6]/40 px-2 py-1 font-text text-[11px] text-[#9fd8d0]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {SKILL_AXES.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-[90px] shrink-0 font-text text-[11px] text-[#9fd8d0]">{label}</span>
                <div className="relative h-[8px] flex-1 overflow-hidden border border-[#39c4b6]/30 bg-black/30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ff2d8d] to-[#39c4b6]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((project.skills[key] || 0) / 10) * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="w-[20px] text-right font-cyberpunk text-[12px] text-[#fee801]">
                  {project.skills[key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
