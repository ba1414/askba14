import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppleEmoji } from "./AppleEmoji";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && 
         window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark];
}

function useLang() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return [lang, setLang];
}

export default function Header({ activeLink }) {
  const [isDark, setIsDark] = useDarkMode();
  const [lang, setLang] = useLang();
  const location = useLocation();

  const t = (en, yue) => (lang === "en" ? en : yue);

  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-300">
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
        {/* Wordmark */}
        <Link 
          to="/" 
          className="text-base font-bold tracking-wide text-[var(--text)] hover:text-[var(--primary)] transition-colors"
        >
          okalpha
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
          <Link 
            to="/" 
            className={`
              relative hover:text-[var(--text)] transition-colors
              ${isHome ? 'text-[var(--text)] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--primary)] after:shadow-[0_0_8px_var(--primary)]' : ''}
            `}
          >
            {t("Home", "主頁")}
          </Link>
          
          <Link 
            to="/about" 
            className="hover:text-[var(--text)] transition-colors"
          >
            {t("About", "關於")}
          </Link>

          {/* Language Toggle */}
          <button
            className="text-[10px] font-bold tracking-wider uppercase hover:text-[var(--text)] transition-colors flex items-center gap-1"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-[var(--primary)]" : "opacity-40"}>
              EN
            </span>
            <span className="opacity-30">/</span>
            <span className={lang === "zh" ? "text-[var(--primary)]" : "opacity-40"}>
              粵
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-[0_0_10px_var(--primary)] transition-all"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? (
                <AppleEmoji emoji="☀️" className="w-4 h-4" />
            ) : (
                <AppleEmoji emoji="🌙" className="w-4 h-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
