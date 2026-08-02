"use client";

import { useEffect, useState } from "react";
import { THEMES, DEFAULT_THEME } from "../lib/themes";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Read whatever the no-flash script (in layout.js) already applied to
  // <html>, so the controls reflect reality instead of flashing back to
  // the defaults on hydration.
  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.getAttribute("data-theme") || DEFAULT_THEME);
    setMode(root.classList.contains("dark") ? "dark" : "light");
    setMounted(true);
  }, []);

  function applyTheme(next) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("blog-theme", next);
    } catch (e) {}
  }

  function toggleMode() {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("blog-mode", next);
    } catch (e) {}
  }

  // Avoid rendering controls that don't match the server-rendered markup
  // until we've synced with localStorage on the client.
  if (!mounted) {
    return <div className="theme-switcher" aria-hidden="true" />;
  }

  return (
    <div className="theme-switcher">
      <select
        className="theme-select"
        value={theme}
        onChange={(e) => applyTheme(e.target.value)}
        aria-label="Color theme"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="mode-toggle"
        onClick={toggleMode}
        aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {mode === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
      </button>
    </div>
  );
}
