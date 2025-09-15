"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Apply initial theme before interaction
  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Theme | null)
      : null) as Theme | null;

    const initial: Theme =
      saved ??
      (typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  // Avoid SSR mismatch by rendering a stable default before mount
  const icon = !mounted ? "🌙" : theme === "dark" ? "🌞" : "🌙";
  const nextLabel = !mounted ? "Dark" : theme === "dark" ? "Light" : "Dark";

  return (
    <button
      type="button"
      className={`theme-toggle btn ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${nextLabel} mode`}
      title={`Switch to ${nextLabel} mode`}
    >
      <span className="emoji" aria-hidden="true">{icon}</span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
