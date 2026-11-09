"use client";

import { useEffect, useState } from "react";
import { THEMES, DEFAULT_THEME } from "../lib/themes";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [mode, setMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Work out the visitor's saved theme and mode (same rules as the no-flash
  // script in layout.js) and re-apply them to <html>. Reading from storage
  // rather than from <html> means the page still ends up right even if
  // something wiped those attributes before this ran.
  useEffect(() => {
    const root = document.documentElement;
    let savedTheme = null;
    let savedMode = null;
    try {
      savedTheme = localStorage.getItem("blog-theme");
      savedMode = localStorage.getItem("blog-mode");
    } catch (e) {}

    const validTheme = THEMES.some((t) => t.id === savedTheme);
    const nextTheme = validTheme ? savedTheme : DEFAULT_THEME;
    const nextMode =
      savedMode === "dark" || savedMode === "light"
        ? savedMode
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    root.setAttribute("data-theme", nextTheme);
    root.classList.toggle("dark", nextMode === "dark");
    setTheme(nextTheme);
    setMode(nextMode);
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
        role="switch"
        aria-checked={mode === "dark"}
        className={`mode-toggle${mode === "dark" ? " is-dark" : ""}`}
        onClick={toggleMode}
        aria-label="Dark mode"
        title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span className="mode-toggle-knob" aria-hidden="true">
          {mode === "light" ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 1.5v2M12 20.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M1.5 12h2M20.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
