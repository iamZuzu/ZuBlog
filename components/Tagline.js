"use client";

import { useEffect, useState } from "react";
import { TAGLINES } from "../lib/taglines";

const ROTATE_MS = 10 * 60 * 1000; // 10 minutes

// The index is derived from the current time, not random state, so it's
// deterministic: everyone looking at the site within the same 10-minute
// window sees the same line, and it steps predictably through the whole
// list rather than jumping around.
function currentIndex() {
  return Math.floor(Date.now() / ROTATE_MS) % TAGLINES.length;
}

// Renders TAGLINES[0] on the very first render so it matches the static
// HTML produced at build time (no hydration mismatch), then swaps to the
// time-correct tagline right after mount and keeps rotating from there —
// so a page left open in a tab keeps advancing without a refresh.
export default function Tagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(currentIndex());
    const id = setInterval(() => setIndex(currentIndex()), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return <span>{TAGLINES[index]}</span>;
}
