import React, { useState, useEffect } from "react";
import { Calculator, Calendar, BookMarked, Sun, Moon, BarChart3, LogOut, User, Cloud, X } from "lucide-react";
import GPACalculatorMinimal from "./GPACalculatorNew";
import CalendarMinimal from "./CalendarMinimalNew";
import FlashcardsMinimal from "./FlashcardsMinimal";
import ProjectTimeline from "./ProjectTimeline";
import { supabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/**
 * ChatGPT-style minimal UI
 * - Single page, no landing page
 * - Sidebar navigation
 * - No decorations, flat design
 * - Clean and distraction-free
 */

type View = "gpa" | "calendar" | "flashcards" | "projects";

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

// Login Form Component
function LoginForm({ lang, onContinueAsGuest }: { lang: string; onContinueAsGuest: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage(lang === "EN" ? "Check your email to confirm!" : "請檢查電郵確認！");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#1A1A1A] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#212121] rounded-2xl shadow-lg p-8 border border-[#E8E8E8] dark:border-[#2F2F2F]">
          <h1 className="text-2xl font-bold text-center mb-2 text-[#0F0F0F] dark:text-[#F0F0F0]">
            BA14
          </h1>
          <p className="text-center text-sm text-[#6B6B6B] dark:text-[#9B9B9B] mb-6">
            {isSignUp 
              ? (lang === "EN" ? "Create your account" : "建立帳戶")
              : (lang === "EN" ? "Sign in to sync your data" : "登入以同步數據")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3F3F3F] dark:text-[#D4D4D4] mb-2">
                {lang === "EN" ? "Email" : "電郵"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] border border-[#E8E8E8] dark:border-[#3F3F3F] text-[#0F0F0F] dark:text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                placeholder={lang === "EN" ? "you@example.com" : "你的電郵"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3F3F3F] dark:text-[#D4D4D4] mb-2">
                {lang === "EN" ? "Password" : "密碼"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] border border-[#E8E8E8] dark:border-[#3F3F3F] text-[#0F0F0F] dark:text-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                placeholder={lang === "EN" ? "At least 6 characters" : "最少6個字元"}
              />
            </div>

            {message && (
              <div className="text-sm text-center text-[#007AFF] dark:text-[#0A84FF]">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#007AFF] hover:bg-[#0051D5] disabled:bg-[#9B9B9B] text-white font-semibold rounded-lg transition-colors"
            >
              {loading 
                ? (lang === "EN" ? "Loading..." : "載入中...")
                : isSignUp 
                  ? (lang === "EN" ? "Sign Up" : "註冊")
                  : (lang === "EN" ? "Sign In" : "登入")}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-[#007AFF] hover:underline"
            >
              {isSignUp
                ? (lang === "EN" ? "Already have an account? Sign in" : "已有帳戶？登入")
                : (lang === "EN" ? "Don't have an account? Sign up" : "未有帳戶？註冊")}
            </button>
          </div>

          {/* Continue as Guest button */}
          <div className="mt-6 pt-6 border-t border-[#E8E8E8] dark:border-[#2F2F2F]">
            <button
              onClick={onContinueAsGuest}
              className="w-full py-3 bg-[#F3F4F6] dark:bg-[#2A2A2A] hover:bg-[#E5E7EB] dark:hover:bg-[#323232] text-[#3F3F3F] dark:text-[#D4D4D4] font-medium rounded-lg transition-colors"
            >
              {lang === "EN" ? "Continue as Guest" : "訪客模式繼續"}
            </button>
            <p className="mt-2 text-xs text-center text-[#9B9B9B] dark:text-[#6B6B6B]">
              {lang === "EN" 
                ? "Your data will be saved locally on this device" 
                : "數據將儲存在此裝置"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const [lang, setLang] = useLang();
  const [activeView, setActiveView] = useState<View>("gpa");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const guestMode = localStorage.getItem("guestMode");
    if (guestMode === "true") {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuest(false);
        localStorage.removeItem("guestMode");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleContinueAsGuest = () => {
    localStorage.setItem("guestMode", "true");
    setIsGuest(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("guestMode");
    setIsGuest(false);
  };

  const handleUpgradeToCloud = () => {
    setShowLoginModal(true);
  };

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const toggleLang = () => setLang(lang === "EN" ? "粵" : "EN");

  const navItems = [
    { id: "gpa" as View, icon: Calculator, label: lang === "EN" ? "GPA Calculator" : "GPA 計算機" },
    { id: "calendar" as View, icon: Calendar, label: lang === "EN" ? "Calendar" : "行事曆" },
    { id: "flashcards" as View, icon: BookMarked, label: lang === "EN" ? "Flashcards" : "字卡" },
    { id: "projects" as View, icon: BarChart3, label: lang === "EN" ? "Projects" : "項目" },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#1A1A1A]">
        <div className="text-[#6B6B6B] dark:text-[#9B9B9B]">
          {lang === "EN" ? "Loading..." : "載入中..."}
        </div>
      </div>
    );
  }

  // Show login form if not authenticated AND not guest
  if (!user && !isGuest) {
    return <LoginForm lang={lang} onContinueAsGuest={handleContinueAsGuest} />;
  }


  return (
    <>
      {/* Login Modal for Guest users */}
      {showLoginModal && isGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-md w-full mx-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-2 -right-2 p-2 bg-white dark:bg-[#212121] rounded-full shadow-lg"
            >
              <X size={20} className="text-[#6B6B6B] dark:text-[#9B9B9B]" />
            </button>
            <LoginForm lang={lang} onContinueAsGuest={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {/* Mobile Layout */}
  <div className="md:hidden min-h-[100svh] flex min-h-0 flex-col bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#1F1F1F] dark:text-[#E8E8E8] transition-colors duration-200">
        {/* Mobile Top Nav (Sticky) */}
        <nav
          className="sticky top-0 z-40 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur border-b border-[#E8E8E8] dark:border-[#2F2F2F]"
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
              {isGuest && (
                <button
                  onClick={handleUpgradeToCloud}
                  className="h-9 px-3 text-xs font-medium rounded-lg bg-[#007AFF] hover:bg-[#0051D5] text-white flex items-center gap-1.5"
                  title={lang === "EN" ? "Save to Cloud" : "雲端備份"}
                >
                  <Cloud size={14} strokeWidth={2.5} />
                  <span className="hidden sm:inline">{lang === "EN" ? "Cloud" : "雲端"}</span>
                </button>
              )}
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
              {!isGuest && (
                <button
                  onClick={handleLogout}
                  className="h-9 px-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#3F3F3F] dark:text-[#D4D4D4]"
                  title={lang === "EN" ? "Logout" : "登出"}
                >
                  <LogOut size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Content - Scrollable */}
        <main 
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-6 pb-12"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {activeView === "gpa" && <GPACalculatorMinimal lang={lang} />}
          {activeView === "calendar" && <CalendarMinimal lang={lang} />}
          {activeView === "flashcards" && <FlashcardsMinimal lang={lang} />}
          {activeView === "projects" && <ProjectTimeline lang={lang} />}
        </main>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden md:flex h-screen bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#1F1F1F] dark:text-[#E8E8E8] transition-colors duration-200">
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
        <div className="px-4 py-4 border-t border-[#E8E8E8] dark:border-[#2F2F2F] space-y-3">
          {/* User info or Guest mode */}
          {isGuest ? (
            <button
              onClick={handleUpgradeToCloud}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#007AFF] hover:bg-[#0051D5] text-white transition-colors"
            >
              <Cloud size={16} strokeWidth={2.5} />
              <span className="text-sm font-medium">
                {lang === "EN" ? "Save to Cloud" : "雲端備份"}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A]">
              <User size={16} className="text-[#6B6B6B] dark:text-[#9B9B9B]" />
              <span className="text-xs text-[#6B6B6B] dark:text-[#9B9B9B] truncate flex-1">
                {user?.email}
              </span>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex items-center gap-2">
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
            {!isGuest && (
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] hover:bg-[#E5E7EB] dark:hover:bg-[#323232] text-[#3F3F3F] dark:text-[#D4D4D4] transition-all duration-200"
                title={lang === "EN" ? "Logout" : "登出"}
              >
                <LogOut size={18} strokeWidth={2} />
              </button>
            )}
          </div>
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
        {activeView === "projects" && (
          <div className="h-full overflow-y-auto overflow-x-hidden px-8 py-6">
            <ProjectTimeline lang={lang} />
          </div>
        )}
      </main>
      </div>
    </>
  );
}
