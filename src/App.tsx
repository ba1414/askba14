import React, { useState } from "react";
import { Calculator, Calendar, BookMarked, Sun, Moon } from "lucide-react";
import GPACalculatorMinimal from "./GPACalculatorNew";
import CalendarMinimal from "./CalendarMinimalNew";
import FlashcardsMinimal from "./FlashcardsMinimal";

/**
 * ChatGPT-style minimal UI
 * - Single page, no landing page
 * - Sidebar navigation
 * - No decorations, flat design
 * - Clean and distraction-free
 */

type View = "gpa" | "calendar" | "flashcards";

function useTheme() {
  const getDefault = () => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };
  const [theme, setTheme] = useState(getDefault);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}

function useLang() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem("lang") || "EN");
  React.useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);
  return [lang, setLang] as const;
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const [lang, setLang] = useLang();
  const [activeView, setActiveView] = useState<View>("gpa");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const toggleLang = () => setLang(lang === "EN" ? "粵" : "EN");

  const navItems = [
    { id: "gpa" as View, icon: Calculator, label: lang === "EN" ? "GPA Calculator" : "GPA 計算機" },
    { id: "calendar" as View, icon: Calendar, label: lang === "EN" ? "Calendar" : "行事曆" },
    { id: "flashcards" as View, icon: BookMarked, label: lang === "EN" ? "Flashcards" : "字卡" },
  ];


  return (
    <div className="min-h-[100svh] flex flex-col bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#1F1F1F] dark:text-[#E8E8E8] transition-colors duration-200">
      
      {/* Mobile Top Nav (Sticky) */}
      <nav
        className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl border-b border-[#E8E8E8] dark:border-[#2F2F2F] shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-3 flex items-center justify-between gap-2">
          {/* BA14 Logo */}
          <div className="text-sm font-semibold text-[#0F0F0F] dark:text-[#F0F0F0]">BA14</div>
          
          {/* Nav Buttons */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`h-9 px-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#007AFF] text-white"
                      : "text-[#6B6B6B] dark:text-[#9B9B9B] hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A]"
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Theme & Lang */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLang}
              className="h-9 px-3 text-xs font-medium rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4]"
            >
              {lang}
            </button>
            <button
              onClick={toggleTheme}
              className="h-9 px-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4]"
            >
              {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop/Tablet Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside className="flex w-64 bg-white dark:bg-[#212121] border-r border-[#E8E8E8] dark:border-[#2F2F2F] flex-col shadow-sm flex-shrink-0">
        {/* Logo/Brand */}
        <div className="px-6 py-5 border-b border-[#E8E8E8] dark:border-[#2F2F2F]">
          <h1 className="text-xl font-semibold tracking-tight text-[#0F0F0F] dark:text-[#F0F0F0]">BA14</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#0F0F0F] dark:text-[#FFFFFF] shadow-sm"
                    : "text-[#6B6B6B] dark:text-[#9B9B9B] hover:bg-[#F9FAFB] dark:hover:bg-[#252525] hover:text-[#0F0F0F] dark:hover:text-[#E8E8E8]"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls at bottom */}
        <div className="px-4 py-4 border-t border-[#E8E8E8] dark:border-[#2F2F2F] flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] hover:bg-[#E5E7EB] dark:hover:bg-[#323232] text-[#3F3F3F] dark:text-[#D4D4D4] transition-all duration-200"
          >
            {lang}
          </button>
          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] hover:bg-[#E5E7EB] dark:hover:bg-[#323232] text-[#3F3F3F] dark:text-[#D4D4D4] transition-all duration-200"
          >
            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>
        </div>
      </aside>

      {/* Main Content - Desktop */}
      <main className="flex-1 overflow-hidden bg-[#FAFAFA] dark:bg-[#1A1A1A]">
        {activeView === "gpa" && (
          <div className="h-full overflow-y-auto overflow-x-hidden px-8 py-6">
            <GPACalculatorMinimal lang={lang} />
          </div>
        )}
        {activeView === "calendar" && (
          <div className="h-full overflow-y-auto overflow-x-hidden px-8 py-6">
            <CalendarMinimal lang={lang} />
          </div>
        )}
        {activeView === "flashcards" && (
          <div className="h-full overflow-y-auto overflow-x-hidden px-8 py-6">
            <FlashcardsMinimal lang={lang} />
          </div>
        )}
      </main>
      </div>

      {/* Mobile Content - Grows and Scrolls */}
      <main 
        className="md:hidden grow overflow-y-auto overflow-x-hidden bg-[#FAFAFA] dark:bg-[#1A1A1A]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {activeView === "gpa" && (
          <div className="px-3 py-6 pb-12">
            <GPACalculatorMinimal lang={lang} />
          </div>
        )}
        {activeView === "calendar" && (
          <div className="px-3 py-6 pb-12">
            <CalendarMinimal lang={lang} />
          </div>
        )}
        {activeView === "flashcards" && (
          <div className="px-3 py-6 pb-12">
            <FlashcardsMinimal lang={lang} />
          </div>
        )}
      </main>
    </div>
  );
}
