"use client";
// PortfolioNav — fixed top bar with smooth in-page navigation and a scroll-spy
// highlight. No routes/URL segments: clicking scrolls to the section in place.

import React, { useEffect, useState } from "react";
import { profile } from "@/data/profile.ts";

const SECTIONS = [
  ["home", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["guestbook", "Sign In"],
  ["contact", "Contact"],
];

export default function PortfolioNav({ canPlayGame, onEnterGame }) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" } // "active" when the section crosses mid-screen
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#39c4b6]/20 bg-[#05070d]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 sm:px-8">
        <a href="#home" onClick={go("home")} className="font-cyberpunk text-[18px] text-[#39c4b6]">
          {profile.name}
          <span className="text-[#ff2d8d]">.dev</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={go(id)}
              className={`font-text text-[13px] tracking-[0.15em] transition-colors ${
                active === id ? "text-[#05d9e8]" : "text-[#7d97a0] hover:text-[#cfeae5]"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {canPlayGame && (
          <button
            onClick={onEnterGame}
            className="border border-[#ff2d8d]/70 px-3 py-1 font-cyberpunk text-[12px] text-[#ff2d8d] transition hover:bg-[#ff2d8d]/10"
          >
            ▶ Game
          </button>
        )}
      </nav>
    </header>
  );
}
