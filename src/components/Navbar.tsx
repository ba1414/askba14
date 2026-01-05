import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown, Menu, X, LogOut } from "lucide-react";

type View = "gpa" | "guide" | "igcse" | "yr1" | "fullcert" | "interview" | "offer" | "about" | "ielts" | "journal";

interface NavbarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isDark: boolean;
  toggleTheme: () => void;
  lang: string;
  toggleLang: () => void;
  user: any;
  handleLogout: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  isDark,
  toggleTheme,
  lang,
  toggleLang,
  user,
  handleLogout,
}: NavbarProps) {
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const guides = [
    { id: "guide", label: "時間線 Timeline", emoji: "⏳" },
    { id: "igcse", label: "IGCSE 指南", emoji: "📖" },
    { id: "yr1", label: "Yr1 入學", emoji: "🎓" },
    { id: "fullcert", label: "Full Cert", emoji: "📜" },
    { id: "interview", label: "面試攻略", emoji: "👔" },
    { id: "offer", label: "Offer & 留位", emoji: "🎉" },
    { id: "ielts", label: "IELTS 準備", emoji: "🌏" },
  ];

  const mainLinks = [
    { id: "about", label: "關於我", emoji: "👋" },
    { id: "gpa", label: "GPA 計算器", emoji: "🧮" },
    { id: "journal", label: "Journal", emoji: "✍️" },
  ];

  const handleNavClick = (view: View) => {
    setActiveView(view);
    setIsGuidesOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Floating Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4 pointer-events-none">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="pointer-events-auto relative flex items-center gap-2 p-2 bg-white/80 dark:bg-[var(--color-bg-elevated)] backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-glass-lg"
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick("about")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <span className="text-xl">💬</span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 mx-2">
            {mainLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id as View)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeView === link.id
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Guides Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGuidesOpen(!isGuidesOpen)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  guides.some((g) => g.id === activeView)
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                指南 <ChevronDown size={14} className={`transition-transform ${isGuidesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isGuidesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute top-full left-0 mt-2 w-64 p-2 bg-white/80 dark:bg-[var(--color-bg-elevated)] backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5"
                  >
                    <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Guides
                    </div>
                    {guides.map((guide) => (
                      <button
                        key={guide.id}
                        onClick={() => handleNavClick(guide.id as View)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] transition-all duration-200 group ${
                          activeView === guide.id
                            ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <span className="text-lg filter drop-shadow-sm">{guide.emoji}</span>
                        <span className="font-medium">{guide.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />

          {/* Actions */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                title="登出"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white/95 dark:bg-[var(--color-bg-elevated)] backdrop-blur-xl pt-24 px-6 pb-6 overflow-y-auto md:hidden"
          >
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Menu</h3>
                {mainLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id as View)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-bold transition-all ${
                      activeView === link.id 
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    <span className="text-2xl">{link.emoji}</span>
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Guides</h3>
                {guides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => handleNavClick(guide.id as View)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-lg font-medium transition-all ${
                      activeView === guide.id 
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-2xl">{guide.emoji}</span>
                    {guide.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                  >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
                  >
                    <LogOut size={18} />
                    登出
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
