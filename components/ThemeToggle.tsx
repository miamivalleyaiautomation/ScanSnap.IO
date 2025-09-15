"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  // read saved or system preference on mount
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Mode | null);
    const initial: Mode =
      saved ??
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    apply(initial);
  }, []);

  function apply(next: Mode) {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setMode(next);
  }

  function toggle() {
    apply(mode === "light" ? "dark" : "light");
  }

  return (
    <button className="icon-btn" aria-label="Toggle theme" onClick={toggle} title="Toggle theme">
      {mode === "light" ? (
        // Sun
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5 5l-1.4-1.4M20.4 19.4 19 18M19 5l1.4-1.4M4.6 19.4 6 18"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ) : (
        // Moon
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
