import React, { useState, useEffect, useRef } from "react";
import { Calculator, Calendar, BookMarked, Sun, Moon, LogOut, User, Cloud, Clock, Lightbulb, Menu, X } from "lucide-react";
import GPACalculatorMinimal from "./GPACalculatorNew";
import CalendarMinimal from "./CalendarMinimalNew";
import FlashcardsMinimal from "./FlashcardsMinimal";
import AboutMe from "./AboutMe";
import Timeline from "./Timeline";
import AssociateDegreeTips from "./AssociateDegreeTips";
import { auth, googleProvider } from "./firebase";
import { 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";

/**
 * ChatGPT-style minimal UI
 * - Single page, no landing page
 * - Sidebar navigation
 * - No decorations, flat design
 * - Clean and distraction-free
 */

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

// Scroll Reveal Component
function ScrollReveal({ children, id }: { children: React.ReactNode; id: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen py-20 transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </section>
  );
}

// Login Form Component
function LoginForm({ lang, onContinueAsGuest }: { lang: string; onContinueAsGuest: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setMessage(lang === "EN" ? "Redirecting to Google..." : "正在轉至 Google...");
      
      // Use redirect for better cross-browser compatibility
      // Safari and Firefox have issues with popup
      await signInWithRedirect(auth, googleProvider);
      // After redirect, user will return and getRedirectResult will handle it
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setMessage(lang === "EN" 
          ? "Error: Domain not authorized. Please add this domain in Firebase Console." 
          : "錯誤：域名未授權。請在 Firebase 控制台添加此域名。");
      } else if (error.code === 'auth/popup-blocked') {
        setMessage(lang === "EN" ? "Popup blocked. Redirecting..." : "彈窗被阻擋。正在轉址...");
        // Try redirect as fallback
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          setMessage(lang === "EN" ? "Sign in failed" : "登入失敗");
        }
      } else {
        setMessage(error.message || (lang === "EN" ? "Sign in failed" : "登入失敗"));
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage(lang === "EN" ? "Account created! Signing in..." : "帳戶已建立！登入中...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage(lang === "EN" ? "Sign in successful!" : "登入成功！");
      }
      // Success - Firebase auth will trigger onAuthStateChanged
      // Keep loading state, App component will handle the transition
    } catch (error: any) {
      setMessage(error.message);
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
              <div className={`text-sm text-center p-3 rounded-lg ${
                message.includes("Error") || message.includes("錯誤") || message.includes("failed") || message.includes("失敗")
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : message.includes("success") || message.includes("成功")
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              }`}>
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

          {/* Google Sign In */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E8E8] dark:border-[#2F2F2F]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-[#212121] px-2 text-[#9B9B9B]">
                  {lang === "EN" ? "Or" : "或"}
                </span>
              </div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full py-3 bg-white dark:bg-[#2A2A2A] border border-[#E8E8E8] dark:border-[#3F3F3F] hover:bg-[#F3F4F6] dark:hover:bg-[#323232] text-[#3F3F3F] dark:text-[#D4D4D4] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {lang === "EN" ? "Continue with Google" : "使用 Google 登入"}
            </button>
          </div>

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
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

    // Check for redirect result first
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect result user:", result.user.email);
          setUser(result.user);
          setIsGuest(false);
          localStorage.removeItem("guestMode");
        }
        setLoading(false); // Set loading false even if no redirect result
      })
      .catch((error) => {
        console.error("Redirect error:", error);
        setLoading(false); // Set loading false on error too
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user?.email || "null");
      setUser(user);
      setLoading(false);
      if (user) {
        setIsGuest(false);
        localStorage.removeItem("guestMode");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleContinueAsGuest = () => {
    localStorage.setItem("guestMode", "true");
    setIsGuest(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await firebaseSignOut(auth);
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
    { id: "tips", icon: Lightbulb, label: lang === "EN" ? "Tips" : "心得" },
    { id: "gpa", icon: Calculator, label: lang === "EN" ? "GPA Calculator" : "GPA 計算器" },
    { id: "calendar", icon: Calendar, label: lang === "EN" ? "Calendar" : "日曆" },
    { id: "flashcards", icon: BookMarked, label: lang === "EN" ? "Flashcards" : "字卡" },
    { id: "timeline", icon: Clock, label: lang === "EN" ? "Timeline" : "時間線" },
    { id: "about", icon: User, label: lang === "EN" ? "About Me" : "關於我" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

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
    <div className="bg-[#FAFAFA] dark:bg-[#000000] min-h-screen text-[#1D1D1F] dark:text-[#F5F5F7] font-sans selection:bg-[#007AFF]/30">
      {/* Login Modal for Guest users */}
      {showLoginModal && isGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-3 -right-3 p-2 bg-white dark:bg-[#212121] rounded-full shadow-lg z-10 hover:bg-[#F3F4F6] dark:hover:bg-[#2A2A2A]"
            >
              <span className="text-2xl leading-none text-[#6B6B6B] dark:text-[#9B9B9B]">×</span>
            </button>
            <LoginForm lang={lang} onContinueAsGuest={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {/* Sticky Header / Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-xl font-bold tracking-tight">BA14</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="hidden md:flex items-center gap-2">
              {isGuest && (
                <button
                  onClick={handleUpgradeToCloud}
                  className="p-2 text-[#007AFF] hover:bg-[#007AFF]/10 rounded-full transition-colors"
                  title={lang === "EN" ? "Save to Cloud" : "雲端備份"}
                >
                  <Cloud size={20} />
                </button>
              )}
              <button
                onClick={toggleLang}
                className="px-3 py-1 text-xs font-medium bg-black/5 dark:bg-white/10 rounded-md hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                {lang}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {!isGuest && (
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#1C1C1E] border-b border-black/5 dark:border-white/5">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                </button>
              ))}
              <div className="border-t border-black/5 dark:border-white/5 my-2 pt-2 flex items-center justify-between px-3">
                <div className="flex gap-2">
                  <button onClick={toggleLang} className="px-3 py-1 text-xs bg-black/5 dark:bg-white/10 rounded-md">
                    {lang}
                  </button>
                  <button onClick={toggleTheme} className="p-1.5 bg-black/5 dark:bg-white/10 rounded-md">
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
                {!isGuest && (
                  <button onClick={handleLogout} className="text-[#FF3B30] text-sm font-medium">
                    {lang === "EN" ? "Logout" : "登出"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Single Page Scroll */}
      <main className="pt-16">
        
        {/* Hero / Tips Section */}
        <ScrollReveal id="tips">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <AssociateDegreeTips lang={lang} />
          </div>
        </ScrollReveal>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent my-8" />

        {/* GPA Calculator Section */}
        <ScrollReveal id="gpa">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GPACalculatorMinimal lang={lang} />
          </div>
        </ScrollReveal>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent my-8" />

        {/* Calendar Section */}
        <ScrollReveal id="calendar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CalendarMinimal lang={lang} />
          </div>
        </ScrollReveal>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent my-8" />

        {/* Flashcards Section */}
        <ScrollReveal id="flashcards">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FlashcardsMinimal lang={lang} />
          </div>
        </ScrollReveal>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent my-8" />

        {/* Timeline Section */}
        <ScrollReveal id="timeline">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Timeline lang={lang} />
          </div>
        </ScrollReveal>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent my-8" />

        {/* About Me Section */}
        <ScrollReveal id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <AboutMe lang={lang} />
          </div>
        </ScrollReveal>

      </main>
    </div>
  );
}
