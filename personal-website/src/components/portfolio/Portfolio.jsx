"use client";
// Portfolio — the single scrollable page shown when the visitor can't (or chooses
// not to) play the 3D game. One page, no route segments: Hero ▸ About ▸ Skills ▸
// Projects ▸ Contact, over an animated canvas background with a scanline overlay.
// Deliberately does NOT import Three.js, so this route stays light.

import React from "react";
import CyberBackground from "./CyberBackground.jsx";
import ScrollRocket from "./ScrollRocket.jsx";
import PortfolioNav from "./PortfolioNav.jsx";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Experience from "./Experience.jsx";
import Skills from "./Skills.jsx";
import Projects from "./Projects.jsx";
import Guestbook from "./Guestbook.jsx";
import Contact from "./Contact.jsx";
import { profile } from "@/data/profile.ts";

export default function Portfolio({ canPlayGame = false, onEnterGame }) {
  return (
    <div className="relative min-h-screen w-full bg-[#05070d]   bg-opacity-40        text-white">
      <CyberBackground />

      {/* subtle CRT scanlines */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 3px)",
        }}
      />

      <ScrollRocket />
      <PortfolioNav canPlayGame={canPlayGame} onEnterGame={onEnterGame} />

      <main className="relative z-10">
        <Hero canPlayGame={canPlayGame} onEnterGame={onEnterGame} />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Guestbook />
        <Contact />
      </main>
    </div>
  );
}
