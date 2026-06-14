"use client";
// Contact — closing section with the call-to-action links from profile.links.

import React from "react";
import { motion } from "motion/react";
import Section, { Reveal } from "./Section.jsx";
import { profile } from "@/data/profile.ts";

export default function Contact() {
  return (
    <Section id="contact" index={6} title="Contact">
      <Reveal>
        <p className="mb-8 max-w-[560px] font-text text-[15px] leading-[1.7] text-[#bcd6d0]">
          Want to build something, collaborate, or just say hi? My channels are
          open — reach out and let&apos;s make it.
        </p>
      </Reveal>

      <div className="flex flex-wrap gap-5">
        {profile.links.map((link, i) => (
          <Reveal key={link.label} delay={0.08 * i}>
            <motion.a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="flex items-center gap-3 border border-[#39c4b6]/50 bg-[#0a0f15]/60 px-6 py-4 transition-colors hover:border-[#05d9e8]"
              style={{ boxShadow: "0 0 16px rgba(57,196,182,0.12)" }}
            >
              {link.icon && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={link.icon}
                  alt=""
                  className="h-7 w-7 object-contain"
                />
              )}
              <span className="font-cyberpunk text-[16px] text-[#05d9e8]">
                {link.label}
              </span>
              <span className="font-text text-[13px] text-[#9fb6b0]">
                {link.href.replace(/^mailto:/, "").replace(/^https?:\/\//, "")}
              </span>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
