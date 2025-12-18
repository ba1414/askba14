import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppleEmoji } from "./AppleEmoji";
import { useTheme } from "../context/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useLang();
  const location = useLocation();

  const t = (en, yue) => (lang === "en" ? en : yue);

  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-page/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
        {/* Wordmark */}
        <Link 
          to="/" 
          className="text-base font-bold tracking-wide text-foreground hover:text-primary transition-colors"
        >
          okalpha
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm font-medium text-muted">
          <Link 
            to="/" 
            className={`
              relative hover:text-foreground transition-colors
              ${isHome ? 'text-foreground after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:shadow-[0_0_8px_var(--primary)]' : ''}
            `}
          >
            {t("Home", "主頁")}
          </Link>
          
          <Link 
            to="/about" 
            className="hover:text-foreground transition-colors"
          >
            {t("About", "關於")}
          </Link>

          {/* Language Toggle */}
          <button
            className="text-[10px] font-bold tracking-wider uppercase hover:text-foreground transition-colors flex items-center gap-1"
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-primary" : "opacity-40"}>
              EN
            </span>
            <span className="opacity-30">/</span>
            <span className={lang === "zh" ? "text-primary" : "opacity-40"}>
              粵
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary hover:shadow-[0_0_10px_var(--primary)] transition-all"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
                <AppleEmoji emoji="🌙" className="w-4 h-4" />
            ) : (
                <AppleEmoji emoji="☀️" className="w-4 h-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
