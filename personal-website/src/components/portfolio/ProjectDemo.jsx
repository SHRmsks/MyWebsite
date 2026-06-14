"use client";
// ProjectDemo — one component, three (well, four) input shapes. Pass a `demo` of
// `{ src, kind?, poster?, label? }`. If `kind` is omitted it's inferred from `src`:
//   *.mp4/webm/ogg/mov            -> <video>   (local file or remote URL)
//   *.png/jpg/webp/gif/avif/svg   -> <img>
//   youtube/vimeo/.../embed URL   -> <iframe>  (responsive 16:9)
//   anything else (a plain link)  -> a styled "open" button
// This keeps the project data dead-simple: just drop in a URL and it renders right.

import React from "react";

const VIDEO_RE = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const IMAGE_RE = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i;
const EMBED_RE = /(youtube\.com|youtu\.be|vimeo\.com|player\.|\/embed\/)/i;

export function detectDemoKind(demo) {
  if (!demo || !demo.src) return "none";
  if (demo.kind) return demo.kind;
  const src = demo.src;
  if (VIDEO_RE.test(src)) return "video";
  if (IMAGE_RE.test(src)) return "image";
  if (EMBED_RE.test(src)) return "embed";
  if (/^https?:\/\//i.test(src) || src.startsWith("/")) return "link";
  return "link";
}

export default function ProjectDemo({ demo, title = "demo" }) {
  const kind = detectDemoKind(demo);

  if (kind === "video") {
    return (
      <div className="relative w-full overflow-hidden rounded-md border border-[#39c4b6]/40 bg-black">
        <video
          src={demo.src}
          poster={demo.poster}
          controls
          playsInline
          preload="metadata"
          className="w-full max-h-[60vh] object-contain"
        />
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="relative w-full overflow-hidden rounded-md border border-[#39c4b6]/40 bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={demo.src}
          alt={title}
          loading="lazy"
          className="w-full max-h-[60vh] object-contain"
        />
      </div>
    );
  }

  if (kind === "embed") {
    // Responsive 16:9 iframe (the classic padding-bottom trick).
    return (
      <div className="relative w-full overflow-hidden rounded-md border border-[#39c4b6]/40 bg-black">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={demo.src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    );
  }

  // Fallback: a plain link.
  return (
    <a
      href={demo.src}
      target={demo.src.startsWith("/") ? "_self" : "_blank"}
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md border border-[#05d9e8] px-5 py-3 font-cyberpunk text-[15px] text-[#05d9e8] transition hover:bg-[#05d9e8]/10"
    >
      {demo.label || "Open project"} <span aria-hidden>↗</span>
    </a>
  );
}
