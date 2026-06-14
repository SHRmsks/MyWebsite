// guestbook.js
// Footstep storage for the sign-in guestbook.
//
// CURRENTLY: localStorage — each visitor sees only their own footsteps (a local
// demo). TO MAKE IT SHARED across all visitors, replace the bodies of
// loadFootsteps() / addFootstep() with fetches to an API route backed by
// Upstash/Vercel KV or Supabase. The UI in Guestbook.jsx calls only these two
// functions, so nothing else needs to change.

const KEY = "haoran_guestbook_v1";
const MAX = 500;

/** @returns {Array<{id,name,country,x,y,ts}>} most-recent-last */
export function loadFootsteps() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/** Persist a new footstep and return it (with id + timestamp filled in). */
export function addFootstep(entry) {
  const all = loadFootsteps();
  const fs = {
    id: globalThis.crypto?.randomUUID?.() || String(Date.now() + Math.random()),
    ts: Date.now(),
    ...entry,
  };
  all.push(fs);
  try {
    localStorage.setItem(KEY, JSON.stringify(all.slice(-MAX)));
  } catch {
    /* storage full / unavailable — ignore */
  }
  return fs;
}
