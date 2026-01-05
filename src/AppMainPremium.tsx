import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import GPACalculatorPremium from "./GPACalculatorPremium";
import JournalView from "./JournalView";
import AboutMe from "./AboutMe";
import AssociateDegreeTips from "./AssociateDegreeTips";
import IGCSEGuideView from "./IGCSEGuideView";
import Yr1GuideView from "./Yr1GuideView";
import FullCertGuideView from "./FullCertGuideViewV2";
import InterviewGuideView from "./InterviewGuideViewV2";
import OfferGuideView from "./OfferGuideView";
import IeltsPrep from "./IeltsPrep";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import { auth, googleProvider } from "./firebase";
import { useTheme } from "./context/ThemeContext";
import { 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";

/**
 * Premium App Layout
 * Apple-quality UI with design system tokens
 */

type View = "gpa" | "guide" | "igcse" | "yr1" | "fullcert" | "interview" | "offer" | "about" | "ielts" | "journal";

function useLang() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem("lang") || "EN");
  React.useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);
  return [lang, setLang] as const;
}

// --- Login Form Component ---
function LoginForm({ lang, onContinueAsGuest }: { lang: string; onContinueAsGuest: () => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setMessage("正在轉至 Google...");
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setMessage("錯誤：域名未授權。請在 Firebase 控制台添加此域名。");
      } else if (error.code === 'auth/popup-blocked') {
        setMessage("彈窗被阻擋。正在轉址...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
          setMessage("登入失敗");
        }
      } else {
        setMessage(error.message || "登入失敗");
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
        setMessage("帳戶已建立！登入中...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("登入成功！");
      }
    } catch (error: any) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)] px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-h1 text-center mb-2 text-[var(--color-text-primary)]">
            <a 
              href="https://www.instagram.com/baaa.14_" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              @baaa.14_
            </a>
          </h1>
          <p className="text-center text-[var(--text-body-sm)] text-[var(--color-text-tertiary)] mb-8">
            {isSignUp ? "建立帳戶" : "登入以同步數據"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label text-[var(--color-text-tertiary)] mb-2 block">
                電郵
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-base w-full"
                placeholder="你的電郵"
              />
            </div>

            <div>
              <label className="text-label text-[var(--color-text-tertiary)] mb-2 block">
                密碼
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="input-base w-full"
                placeholder="最少6個字元"
              />
            </div>

            {message && (
              <div className={`text-[var(--text-body-sm)] text-center p-3 rounded-[var(--radius-md)] ${
                message.includes("Error") || message.includes("錯誤") || message.includes("failed") || message.includes("失敗")
                  ? "bg-[var(--color-error-subtle)] text-[var(--color-error)] border border-[var(--color-error)]/20"
                  : message.includes("success") || message.includes("成功")
                  ? "bg-[var(--color-success-subtle)] text-[var(--color-success)] border border-[var(--color-success)]/20"
                  : "bg-[var(--color-info-subtle)] text-[var(--color-info)] border border-[var(--color-info)]/20"
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? "載入中..." : isSignUp ? "註冊" : "登入"}
            </button>
          </form>

          {/* Google Sign In */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border-primary)]"></div>
              </div>
              <div className="relative flex justify-center text-[var(--text-caption)]">
                <span className="bg-[var(--color-bg-elevated)] px-3 text-[var(--color-text-quaternary)]">
                  或
                </span>
              </div>
            </div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-secondary w-full mt-6 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-black dark:border-gray-800 dark:text-white dark:hover:bg-gray-900"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 登入
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--text-body-sm)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {isSignUp ? "已有帳戶？登入" : "未有帳戶？註冊"}
            </button>
          </div>

          {/* Continue as Guest button */}
          <div className="mt-6 pt-6 border-t border-[var(--color-border-primary)]">
            <button
              onClick={onContinueAsGuest}
              className="btn btn-ghost w-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              訪客模式繼續
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useLang();
  const [activeView, setActiveView] = useState<View>("guide");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isDark = theme === "dark";

  // Check authentication on mount
  useEffect(() => {
    const guestMode = localStorage.getItem("guestMode");
    if (guestMode === "true") {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setIsGuest(false);
          localStorage.removeItem("guestMode");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Redirect error:", error);
        setLoading(false);
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

  const toggleLang = () => setLang("粵");

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-page)]">
        <div className="text-[var(--color-text-tertiary)] animate-pulse">
          載入中...
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
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="relative max-w-md w-full animate-scale-in">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-3 -right-3 p-2 bg-[var(--color-bg-elevated)] rounded-full shadow-lg z-10 hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-primary)]"
            >
              <X size={20} />
            </button>
            <LoginForm lang={lang} onContinueAsGuest={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isDark={isDark}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLang={toggleLang}
        user={user}
        handleLogout={handleLogout}
      />

      <Layout>
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
          <div className="w-full animate-fade-in">
            {activeView === "gpa" && <GPACalculatorPremium lang={lang} />}
            {activeView === "ielts" && <IeltsPrep lang={lang} />}
            {activeView === "journal" && <JournalView />}
            {activeView === "about" && <AboutMe lang={lang} />}
          </div>
        )}
        
        <Footer />
      </Layout>
    </>
  );
}
