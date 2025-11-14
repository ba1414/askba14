import React, { useState, useEffect } from "react";
import { Calculator, Calendar, BookMarked, Sun, Moon, BarChart3, LogOut, User, Cloud } from "lucide-react";
import GPACalculatorMinimal from "./GPACalculatorNew";
import CalendarMinimal from "./CalendarMinimalNew";
import FlashcardsMinimal from "./FlashcardsMinimal";
import ProjectTimeline from "./ProjectTimeline";
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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setMessage(lang === "EN" ? "Opening Google Sign-In..." : "開啟 Google 登入...");
      
      // Try popup first, fallback to redirect if blocked
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
          setMessage(lang === "EN" ? "Sign in successful!" : "登入成功！");
        }
      } catch (popupError: any) {
        console.log("Popup error:", popupError.code);
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          setMessage(lang === "EN" ? "Redirecting to Google..." : "正在轉至 Google...");
          // Use redirect instead
          await signInWithRedirect(auth, googleProvider);
        } else if (popupError.code === 'auth/cancelled-popup-request') {
          setMessage("");
          setLoading(false);
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setMessage(lang === "EN" 
          ? "Error: Domain not authorized. Please add this domain in Firebase Console." 
          : "錯誤：域名未授權。請在 Firebase 控制台添加此域名。");
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
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
  const [activeView, setActiveView] = useState<View>("gpa");
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
          setUser(result.user);
          setIsGuest(false);
          localStorage.removeItem("guestMode");
        }
      })
      .catch((error) => {
        console.error("Redirect error:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
