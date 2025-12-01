import React, { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCheck, NotebookText, Timer, BookMarked, Calculator, Sun, Moon, X } from "lucide-react";
import GPACalculator from "./GPACalculatorNew";
import CalendarToDo from "./CalendarMinimalNew";
import Flashcards from "./FlashcardsMinimal";

/**
 * BA14 Grid — Apple × Swiss blend
 * - One-tap EN/粵 language toggle in unified pill control
 * - One-tap Light/Dark mode with Sun/Moon icon
 * - System preference on first load, localStorage persistence
 * - Strict grid (3×2), Apple-style cards, Swiss left/bottom alignment
 * - Responsive (1/2/3 cols), ≥44px hit targets, WCAG AA
 */

// ---- Theme hook -------------------------------------------------------------
function useTheme() {
  const getDefault = () => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const [theme, setTheme] = useState(getDefault);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      // system
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => root.classList.toggle("dark", mql.matches);
      apply();
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}

// ---- Language hook ----------------------------------------------------------
function useLang() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem("lang") || "EN");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);
  return [lang, setLang] as const;
}

// ---- i18n -------------------------------------------------------------------
const STR = {
  EN: {
    home: "Home",
    ba14: "BA14",
    gpa: "GPA Calculator",
    cal: "Calendar + To-Do",
    anki: "Flashcards",
    focus: "Focus Timer",
    notes: "Notes / Outline",
    habit: "Habit & Streaks",
    langAria: "Current language EN. Click to switch to 粵.",
    themeAria: (dark: boolean) => dark ? "Switch to light mode" : "Switch to dark mode",
  },
  粵: {
    home: "主頁",
    ba14: "BA14",
    gpa: "GPA計算器",
    cal: "行事曆＋待辦",
    anki: "記憶卡",
    focus: "專注計時",
    notes: "筆記／大綱",
    habit: "習慣連勝",
    langAria: "目前語言：粵語。撳一下轉英文。",
    themeAria: (dark: boolean) => dark ? "轉去光模式" : "轉去暗模式",
  },
} as const;

const BASE = (import.meta as any).env?.BASE_URL ?? "/";

// ---- Modal Wrapper ----------------------------------------------------------
function ModalWrapper({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020617]/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-[95vw] h-[90vh] overflow-hidden rounded-[32px] bg-[#050B1F] shadow-2xl ring-1 ring-[#1F2933] animate-scaleIn flex flex-col">
        <div className="absolute top-6 right-6 z-50">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-[#0B1220] hover:bg-[#1F2933] transition-colors backdrop-blur-md"
          >
            <X size={20} className="text-[#F9FAFB]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---- Card component ---------------------------------------------------------
function Tile({
  title,
  icon,
  accent,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[5/4] rounded-[2rem] bg-gradient-to-br from-[#050B1F] to-[#0B1220] backdrop-blur-xl border border-[#1F2933] shadow-xl shadow-black/20 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-2xl active:-translate-y-px focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/30 p-4 sm:p-6 w-full text-left touch-manipulation overflow-hidden"
      style={{ 
        borderColor: `color-mix(in srgb, ${accent} 0%, #1F2933)`,
      }}
      aria-label={title}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `color-mix(in srgb, ${accent} 30%, #1F2933)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1F2933';
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

      {/* Accent diagonal wedge (top-right) */}
      <span
        className="absolute right-0 top-0 h-16 w-24 sm:h-24 sm:w-40 opacity-80"
        style={{ 
          background: accent,
          clipPath: "polygon(100% 0, 0 0, 100% 100%)"
        }}
        aria-hidden="true"
      />

      {/* Icon (top-left, SF Symbols style, 2px stroke) */}
      <div 
        className="absolute left-4 top-4 sm:left-6 sm:top-6" 
        style={{ color: accent }} 
        aria-hidden="true"
      >
        <div className="scale-90 sm:scale-100 md:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          {icon}
        </div>
      </div>

      {/* Title (bottom-left, SF Pro Semibold 18-20px, tracking -1) */}
      <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 text-base sm:text-lg md:text-[21px] font-semibold tracking-[-0.01em] leading-tight text-[#F9FAFB]">
        {title}
      </div>

      {/* Chevron (bottom-right, 30-50% opacity) */}
      <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 text-xl sm:text-2xl text-[#9CA3AF] group-hover:text-[#F9FAFB] transition-opacity duration-150">
        ›
      </div>
    </button>
  );
}

// ---- Unified control pill (one-tap language + theme) -----------------------
function ControlPill({ 
  lang, 
  onLangToggle, 
  theme, 
  onThemeToggle,
  langAria,
  themeAria
}: { 
  lang: string; 
  onLangToggle: () => void; 
  theme: string;
  onThemeToggle: () => void;
  langAria: string;
  themeAria: string;
}) {
  const isDark = useMemo(() => 
    theme === "system" 
      ? document.documentElement.classList.contains("dark") 
      : theme === "dark", 
    [theme]
  );

  return (
    <div className="inline-flex items-center gap-0 rounded-full border border-[#1F2933] bg-[#050B1F]/80 backdrop-blur-xl shadow-lg">
      {/* Language toggle */}
      <button
        onClick={onLangToggle}
        className="min-w-[44px] min-h-[44px] px-4 text-[15px] font-medium text-[#F9FAFB] hover:bg-[#1F2933] rounded-l-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/30 focus:ring-inset"
        aria-label={langAria}
      >
        {lang}
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[#1F2933]" aria-hidden="true" />

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        className="min-w-[44px] min-h-[44px] px-3 inline-flex items-center justify-center hover:bg-[#1F2933] rounded-r-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/30 focus:ring-inset"
        aria-label={themeAria}
      >
        {isDark ? <Sun size={18} className="text-[#F9FAFB]" /> : <Moon size={18} className="text-[#F9FAFB]" />}
      </button>
    </div>
  );
}

// ---- Page -------------------------------------------------------------------
export default function BA14GridPage() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const [showGPA, setShowGPA] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  
  const t = (k: keyof typeof STR["EN"]) => {
    const str = lang === "EN" ? STR.EN[k] : (STR as any)["粵"][k];
    return typeof str === "function" ? str : str;
  };

  const isDark = useMemo(() => 
    theme === "system" 
      ? document.documentElement.classList.contains("dark") 
      : theme === "dark", 
    [theme]
  );

  const toggleLang = () => setLang(lang === "EN" ? "粵" : "EN");
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const handleOpenGPA = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowGPA(true);
      setIsTransitioning(false);
    }, 150);
  };

  const handleOpenCalendar = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowCalendar(true);
      setIsTransitioning(false);
    }, 150);
  };

  const handleOpenFlashcards = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowFlashcards(true);
      setIsTransitioning(false);
    }, 150);
  };

  const handleBackToLanding = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLeavingPage(true);
    setTimeout(() => {
      window.location.href = BASE;
    }, 300);
  };

  const tiles = [
    { key: "gpa", icon: <Calculator strokeWidth={2} />, accent: "#FACC6B", onClick: handleOpenGPA },
    { key: "cal", icon: <Calendar strokeWidth={2} />, accent: "#22D3EE", onClick: handleOpenCalendar },
    { key: "anki", icon: <BookMarked strokeWidth={2} />, accent: "#FACC6B", onClick: handleOpenFlashcards },
  ];

  return (
    <main
      className="min-h-[100svh] text-[#F9FAFB] transition-colors duration-200"
      style={{
        paddingTop: "max(12px, env(safe-area-inset-top))",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))"
      }}
    >
      {/* Page Transition Overlay */}
      {isLeavingPage && (
        <div className="fixed inset-0 bg-[#020617] z-50 animate-fadeIn" />
      )}

      {/* Header - Fixed */}
      <header
        className={`fixed left-0 right-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-[#1F2933] transition-all duration-300 ${isTransitioning || isLeavingPage ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}
        style={{
          top: "max(0px, env(safe-area-inset-top))"
        }}
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
          {/* Left: clickable BA14 label */}
          <a href={BASE} onClick={handleBackToLanding} className="min-w-0 group touch-manipulation">
            <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#9CA3AF] group-hover:text-[#F9FAFB] transition-colors">BA14</div>
          </a>

          {/* Right: unified control pill */}
          <div className="flex items-center gap-3">
            <ControlPill 
              lang={lang}
              onLangToggle={toggleLang}
              theme={theme}
              onThemeToggle={toggleTheme}
              langAria={t("langAria")}
              themeAria={t("themeAria")(isDark)}
            />
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div 
        style={{ 
          height: "calc(72px + max(0px, env(safe-area-inset-top)))" 
        }} 
        aria-hidden="true" 
      />

      {/* Grid */}
      <section className={`mx-auto max-w-[1600px] px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 transition-all duration-300 ${isTransitioning || isLeavingPage ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {tiles.map(({ key, icon, accent, onClick }) => (
          <Tile key={key} title={t(key as any)} icon={icon} accent={accent} onClick={onClick} />
        ))}
      </section>

      {/* GPA Calculator Modal */}
      {showGPA && (
        <ModalWrapper onClose={() => setShowGPA(false)}>
          <GPACalculator lang={lang} />
        </ModalWrapper>
      )}
      
      {/* Calendar + To-Do Modal */}
      {showCalendar && (
        <ModalWrapper onClose={() => setShowCalendar(false)}>
          <CalendarToDo lang={lang} />
        </ModalWrapper>
      )}
      
      {/* Flashcards Modal */}
      {showFlashcards && (
        <ModalWrapper onClose={() => setShowFlashcards(false)}>
          <Flashcards lang={lang} />
        </ModalWrapper>
      )}
    </main>
  );
}
