import React, { useState, useEffect } from "react";
import { Sun, Moon, LogOut, Menu, X } from "lucide-react";
import GPACalculatorMinimal from "./GPACalculatorNew";
import FlashcardsMinimal from "./FlashcardsMinimal";
import AboutMe from "./AboutMe";
import AssociateDegreeTips from "./AssociateDegreeTips";
import IGCSEGuideView from "./IGCSEGuideView";
import Yr1GuideView from "./Yr1GuideView";
import FullCertGuideView from "./FullCertGuideView";
import InterviewGuideView from "./InterviewGuideView";
import OfferGuideView from "./OfferGuideView";
import IeltsPrep from "./IeltsPrep";
import Footer from "./components/Footer";
import { AppleEmoji } from "./components/AppleEmoji";
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

type View = "gpa" | "flashcards" | "guide" | "igcse" | "yr1" | "fullcert" | "interview" | "offer" | "about" | "ielts";

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--surface)] rounded-2xl shadow-lg p-8 border border-[var(--border-subtle)]">
          <h1 className="text-2xl font-bold text-center mb-2 text-[var(--text)]">
            BA14
          </h1>
          <p className="text-center text-sm text-[var(--text-muted)] mb-6">
            {isSignUp 
              ? (lang === "EN" ? "Create your account" : "建立帳戶")
              : (lang === "EN" ? "Sign in to sync your data" : "登入以同步數據")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                {lang === "EN" ? "Email" : "電郵"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border-subtle)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder={lang === "EN" ? "you@example.com" : "你的電郵"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                {lang === "EN" ? "Password" : "密碼"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg)] border border-[var(--border-subtle)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder={lang === "EN" ? "At least 6 characters" : "最少6個字元"}
              />
            </div>

            {message && (
              <div className={`text-sm text-center p-3 rounded-lg ${
                message.includes("Error") || message.includes("錯誤") || message.includes("failed") || message.includes("失敗")
                  ? "bg-[var(--error)]/20 text-[var(--error)]"
                  : message.includes("success") || message.includes("成功")
                  ? "bg-[var(--success)]/20 text-[var(--success)]"
                  : "bg-[var(--primary)]/20 text-[var(--primary)]"
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary-strong)] disabled:bg-[var(--text-muted)] text-[#020617] font-bold rounded-lg transition-colors"
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
                <div className="w-full border-t border-[var(--border-subtle)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--surface)] px-2 text-[var(--text-muted)]">
                  {lang === "EN" ? "Or" : "或"}
                </span>
              </div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full py-3 bg-[var(--surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg)] text-[var(--text)] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
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
              className="text-sm text-[var(--primary)] hover:underline"
            >
              {isSignUp
                ? (lang === "EN" ? "Already have an account? Sign in" : "已有帳戶？登入")
                : (lang === "EN" ? "Don't have an account? Sign up" : "未有帳戶？註冊")}
            </button>
          </div>

          {/* Continue as Guest button */}
          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <button
              onClick={onContinueAsGuest}
              className="w-full py-3 bg-[var(--bg)] hover:bg-[var(--border-subtle)] text-[var(--text)] font-medium rounded-lg transition-colors"
            >
              {lang === "EN" ? "Continue as Guest" : "訪客模式繼續"}
            </button>
            <p className="mt-2 text-xs text-center text-[var(--text-muted)]">
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
  const [activeView, setActiveView] = useState<View>("guide");
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
    { id: "gpa" as View, emoji: "🧮", label: lang === "EN" ? "GPA Calculator" : "GPA 計算器" },
    { id: "flashcards" as View, emoji: "🔖", label: lang === "EN" ? "Flashcards" : "字卡" },
    { id: "ielts" as View, emoji: "🎓", label: lang === "EN" ? "IELTS Prep" : "IELTS 準備" },
    { id: "igcse" as View, emoji: "📖", label: lang === "EN" ? "IGCSE Guide" : "IGCSE 指南" },
    { id: "yr1" as View, emoji: "🚀", label: lang === "EN" ? "Yr1 Admission" : "Yr1 入學" },
    { id: "fullcert" as View, emoji: "📜", label: lang === "EN" ? "Full Cert" : "Full Cert" },
    { id: "interview" as View, emoji: "🎙️", label: lang === "EN" ? "Interview Prep" : "面試攻略" },
    { id: "offer" as View, emoji: "🎉", label: lang === "EN" ? "Offer & Deposit" : "Offer & 留位" },
    { id: "guide" as View, emoji: "🚩", label: lang === "EN" ? "Survival Guide" : "時間線" },
    { id: "about" as View, emoji: "🧑‍💻", label: lang === "EN" ? "About Me" : "關於我" },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-muted)]">
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
    <div className="flex flex-col h-full transition-colors duration-300 bg-[var(--bg)] border-r border-[var(--border-subtle)]">
      
      {/* Sidebar Header / BA14 Button */}
      <div className="p-6">
        <button 
          onClick={() => { setActiveView('guide'); setMobileMenuOpen(false); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group hover:bg-[var(--surface)] text-[var(--text)]"
        >
          <div className="p-2 rounded-lg bg-[var(--primary-soft)] text-[var(--primary-strong)]">
            <AppleEmoji emoji="💬" className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">BA14</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 sidebar-scroll space-y-1">
        <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
          {lang === "EN" ? "Menu" : "選單"}
        </div>
        {navItems.map((item) => {
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
                ? 'bg-[var(--primary)] text-[#020617] shadow-md shadow-[var(--primary)]/20' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'}
            `}
          >
            <AppleEmoji emoji={item.emoji} className="w-[18px] h-[18px]" />
            <span className="truncate">{item.label}</span>
          </button>
        )})}
      </div>

      {/* Sidebar Footer (User/Settings) */}
      <div className="p-6 border-t border-[var(--border-subtle)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            {lang === 'EN' ? '中文' : 'EN'}
          </button>
        </div>

        {!isGuest && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
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
              className="absolute -top-3 -right-3 p-2 bg-[var(--surface)] rounded-full shadow-lg z-10 hover:bg-[var(--bg)]"
            >
              <span className="text-2xl leading-none text-[var(--text-muted)]">×</span>
            </button>
            <LoginForm lang={lang} onContinueAsGuest={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {/* Mobile Header (Hamburger) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--bg)] border-b border-[var(--border-subtle)] text-[var(--text)] px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1 -ml-1 hover:bg-[var(--surface)] rounded-md"
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

      <div className="flex h-screen bg-[var(--bg)] text-[var(--text)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-[280px] flex-col fixed inset-y-0 left-0 z-50">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main id="main-scroll-container" className="flex-1 relative h-full overflow-y-auto md:ml-[280px] transition-all duration-300">
          {/* Mobile Header Spacer */}
          <div className="h-16 md:h-0" />

          {activeView === "guide" ? (
            <div className="animate-fade-in">
              <AssociateDegreeTips lang={lang} />
            </div>
          ) : activeView === "igcse" ? (
            <div className="animate-fade-in">
              <IGCSEGuideView />
            </div>
          ) : activeView === "yr1" ? (
            <div className="animate-fade-in">
              <Yr1GuideView />
            </div>
          ) : activeView === "fullcert" ? (
            <div className="animate-fade-in">
              <FullCertGuideView />
            </div>
          ) : activeView === "interview" ? (
            <div className="animate-fade-in">
              <InterviewGuideView />
            </div>
          ) : activeView === "offer" ? (
            <div className="animate-fade-in">
              <OfferGuideView />
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
              {activeView === "gpa" && <GPACalculatorMinimal lang={lang} />}
              {activeView === "flashcards" && <FlashcardsMinimal lang={lang} />}
              {activeView === "ielts" && <IeltsPrep lang={lang} />}
              {activeView === "about" && <AboutMe lang={lang} />}
            </div>
          )}
          
          <Footer lang={lang} />
        </main>
      </div>
    </>
  );
}
