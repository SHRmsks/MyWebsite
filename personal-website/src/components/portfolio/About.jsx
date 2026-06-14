"use client";
// About — portrait in an angular neon frame + the bio, with stat chips.

import React from "react";
import Section, { Reveal } from "./Section.jsx";
import ScrambleTitle from "./ScrambleTitle.jsx"; // <-- Added import
import { profile } from "@/data/profile.ts";
import Image from "next/image";
const CLIP =
  "polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)";

export default function About() {
  const paragraphs = profile.bio.split("\n\n");
  const chips = [
    ["LOCATION", profile.location],
    ["SCHOOL", profile.education.map((e) => e.school).join(" · ")],
    ["MAJOR", profile.education.map((e) => e.degree).join(" · ")],
    ["LOGO", profile.education.map((e) => e.icon).filter(Boolean)],
  ];

  console.log("chips", chips);
  return (
    <Section id="about" index={1} title="About">
      <div className="grid items-start gap-10 md:grid-cols-[300px_1fr]">
        <Reveal>
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 0 18px rgba(57,196,182,0.25))" }}
          >
            <div
              className="absolute inset-0 -z-0"
              style={{ clipPath: CLIP, background: "#39c4b6" }}
            />
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
              <div
                key={k}
                className="flex items-baseline gap-2 border-l-2 border-[#ff2d8d]/60 pl-3"
              >
                <span className="font-text text-[10px] tracking-[0.2em] text-[#ff2d8d]">
                  {k}
                </span>
                {k == "LOGO" ? (
                  v.map((logo, index) => (
                    <Image
                      key={index}
                      src={logo}
                      alt="Logo"
                      height={30}
                      width={30}
                    />
                  ))
                ) : (
                  <span className="font-text text-[13px] text-[#cfeae5]">
                    {v}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-5">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 * i}>
              {/* Replaced static <p> with ScrambleTitle for the Matrix effect */}
              <ScrambleTitle
                text={p}
                font="text"
                speed={11} // Extremely fast text decoding
                flicker={3} // High flicker rate for terminal boot feel
                className="font-text text-[15px] leading-[1.8] text-[#bcd6d0] block"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
