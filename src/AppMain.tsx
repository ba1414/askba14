import React, { useState, useEffect } from "react";
import { Calculator, Calendar, BookMarked, Sun, Moon, LogOut, User, Cloud, Lightbulb, Menu, X, MessageSquarePlus, Languages } from "lucide-react";
import GPACalculatorMinimal from "./GPACalculatorNew";
import CalendarMinimal from "./CalendarMinimalNew";
import FlashcardsMinimal from "./FlashcardsMinimal";
import AboutMe from "./AboutMe";
import AssociateDegreeTips from "./AssociateDegreeTips";
import Footer from "./components/Footer";
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

type View = "gpa" | "calendar" | "flashcards" | "tips" | "about";

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
    { id: "gpa" as View, icon: Calculator, label: lang === "EN" ? "GPA Calculator" : "GPA 計算器" },
    { id: "calendar" as View, icon: Calendar, label: lang === "EN" ? "Calendar" : "日曆" },
    { id: "flashcards" as View, icon: BookMarked, label: lang === "EN" ? "Flashcards" : "字卡" },
    { id: "tips" as View, icon: Lightbulb, label: lang === "EN" ? "Tips" : "心得" },
    { id: "about" as View, icon: User, label: lang === "EN" ? "About Me" : "關於我" },
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

  // Sidebar Content (Refined UI)
  const SidebarContent = () => (
    <div className={`flex flex-col h-full transition-colors duration-300 ${isDark ? 'bg-black border-r border-white/10' : 'bg-white border-r border-gray-200'}`}>
      
      {/* Sidebar Header / BA14 Button */}
      <div className="p-6">
        <button 
          onClick={() => { setActiveView('tips'); setMobileMenuOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group
            ${isDark 
              ? 'hover:bg-white/5 text-white' 
              : 'hover:bg-black/5 text-gray-900'}
          `}
        >
          <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <MessageSquarePlus size={20} strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold tracking-tight">BA14</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 sidebar-scroll space-y-1">
        <div className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {lang === "EN" ? "Menu" : "選單"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
          <button
            key={item.id}
            onClick={() => {
              setActiveView(item.id);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-200 relative group
              ${isActive 
                ? 'bg-[#007AFF] text-white shadow-md shadow-blue-500/25' 
                : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5')}
            `}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : ''} />
            <span className="truncate">{item.label}</span>
          </button>
        )})}
      </div>

      {/* Sidebar Footer (User/Settings) */}
      <div className={`p-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-200
              ${isDark 
                ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                : 'text-gray-500 hover:text-black hover:bg-black/5'}
            `}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={toggleLang}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
              ${isDark 
                ? 'border-white/10 text-gray-300 hover:bg-white/10' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'}
            `}
          >
            {lang === 'EN' ? '中文' : 'EN'}
          </button>
        </div>

        {!isGuest && (
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
              ${isDark 
                ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' 
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}
            `}
          >
            <LogOut size={16} />
            <span>{lang === 'EN' ? 'Log out' : '登出'}</span>
          </button>
        )}
      </div>
    </div>
  );


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

      {/* Mobile Header (Hamburger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#343541] border-b border-white/10 text-[#ECECF1] px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1 -ml-1 hover:bg-[#2A2B32] rounded-md"
        >
          <Menu size={24} />
        </button>
        <div className="font-medium">BA14</div>
        <div className="w-8" /> {/* Spacer for balance */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 h-full shadow-xl transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex h-screen bg-apple-light-bg dark:bg-apple-dark-bg text-[#1D1D1F] dark:text-[#F5F5F7]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-[280px] flex-col fixed inset-y-0 left-0 z-50">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative h-full overflow-y-auto md:ml-[280px] transition-all duration-300">
          {/* Mobile Header Spacer */}
          <div className="h-16 md:h-0" />

          <div className="layout-grid animate-fade-in">
            {activeView === "gpa" && (
                <GPACalculatorMinimal lang={lang} />
            )}
            {activeView === "calendar" && (
                <CalendarMinimal lang={lang} />
            )}
            {activeView === "flashcards" && (
                <FlashcardsMinimal lang={lang} />
            )}
            {activeView === "tips" && (
                <AssociateDegreeTips lang={lang} />
            )}
            {activeView === "about" && (
                <AboutMe lang={lang} />
            )}
          </div>
          
          <Footer lang={lang} />
        </main>
      </div>
    </>
  );
}
