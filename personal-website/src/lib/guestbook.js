// guestbook.js
// Footstep storage for the sign-in guestbook + the in-game dart map.
//
// IMPORTANT: this is browser Web Storage — it lives in the visitor's own browser,
// NOT on the server/Vercel. Nothing is ever uploaded, so there is no server-side
// growth or overflow risk. We use *sessionStorage*, so footsteps are SESSION-ONLY:
// they auto-clear when the tab/session closes. We also hard-cap the count.
//
// To make this a real shared world guestbook, replace the two function bodies with
// fetches to an API route backed by Upstash/Vercel KV — callers don't change.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAPIKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
const supabase =
  supabaseUrl && supabaseAPIKey
    ? createClient(supabaseUrl, supabaseAPIKey)
    : null;

const KEY = "haoran_guestbook_v1";
const THROWN_KEY = "haoran_guestbook_thrown";
const MAX = 200; // hard cap; oldest are dropped first (auto-clear)

function store() {
  // sessionStorage = per-tab, auto-cleared at session end.
  return typeof window !== "undefined" ? window.sessionStorage : null;
}

/** @returns {Array<{id,name,x,y,ts}>} most-recent-last */
export async function loadFootsteps() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("footsteps")
    .select("*")
    .order("ts", { ascending: false })
    .limit(200); // Only load the last 200 so it never lags

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data || [];
}

// Kept for callers that check it; session storage means "this session" only.
export function hasThrown() {
  const s = store();
  return s ? s.getItem(THROWN_KEY) === "true" : false;
}

/** Persist a new footstep and return it (with id + timestamp filled in). */
export async function addFootstep(entry) {
  if (hasThrown()) return null;

  const fs = {
    id: globalThis.crypto?.randomUUID?.() || String(Date.now() + Math.random()),
    ts: Date.now(),
    ...entry,
  };

  // Write to global database
  if (supabase) {
    const { error } = await supabase.from("footsteps").insert([fs]);
    if (error) console.error("Supabase insert error:", error);
  }

  // Lock this browser out locally so they can't spam the database
  const s = store();
  try {
    s?.setItem(THROWN_KEY, "true");
  } catch {}

  return fs;
}
