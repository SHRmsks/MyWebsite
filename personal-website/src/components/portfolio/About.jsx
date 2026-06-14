"use client";
// About — portrait in an angular neon frame + the bio, with stat chips.

import React from "react";
import Section, { Reveal } from "./Section.jsx";
import { profile } from "@/data/profile.js";

const CLIP = "polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)";

export default function About() {
  const paragraphs = profile.bio.split("\n\n");
  const chips = [
    ["LOCATION", profile.location],
    ["SCHOOL", profile.affiliation],
    ["MAJOR", profile.major],
  ];

  return (
    <Section id="about" index={1} title="About">
      <div className="grid items-start gap-10 md:grid-cols-[300px_1fr]">
        <Reveal>
          <div className="relative" style={{ filter: "drop-shadow(0 0 18px rgba(57,196,182,0.25))" }}>
            <div className="absolute inset-0 -z-0" style={{ clipPath: CLIP, background: "#39c4b6" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.portrait}
              alt={profile.name}
              loading="lazy"
              className="relative m-[2px] w-[calc(100%-4px)]"
              style={{ clipPath: CLIP }}
            />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {chips.map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-2 border-l-2 border-[#ff2d8d]/60 pl-3">
                <span className="font-text text-[10px] tracking-[0.2em] text-[#ff2d8d]">{k}</span>
                <span className="font-text text-[13px] text-[#cfeae5]">{v}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-5">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <p className="font-text text-[15px] leading-[1.8] text-[#bcd6d0]">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
