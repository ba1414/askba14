import React from "react";
import { AppleEmoji } from "./components/AppleEmoji";
import { MapPin, GraduationCap, Briefcase, MessageCircle } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "About Me",
    subtitle: "DSE 14 Points • No Full Cert • HKU in 1 Year",
    bio: "From a 14-point DSE score to HKU in just one year.",
    location: "Hong Kong",
    skills: "Tech Stack",
    interests: "Vibe Check",
    contact: "Get in Touch",
    education: "Education",
    university: "University of Hong Kong",
    major: "BA in English & Linguistics",
    nowPlaying: "Now Playing",
    song: "Lofi Beats to Code To",
    artist: "Chill Hop",
    experience: "Journey",
    projects: "Featured Projects",
    philosophy: "Philosophy",
    philosophyText: "Hi, I created this website hoping to help you if you're feeling lost right now, because I've been through the same phase myself.",
    exchange: "Exchange at NUS (Asia's #1 University)"
  },
  粵: {
    title: "關於我",
    subtitle: "DSE 14分 • 冇Full Cert • 一年入HKU",
    bio: "由 DSE 14分、冇 Full Cert、無任何大學收，到一年入 HKU。",
    location: "香港",
    skills: "技術棧",
    interests: "生活態度",
    contact: "聯絡我",
    education: "學歷",
    university: "香港大學",
    major: "文學士 (英文 & 語言學)",
    nowPlaying: "正在播放",
    song: "Lofi Beats to Code To",
    artist: "Chill Hop",
    experience: "歷程",
    projects: "精選項目",
    philosophy: "理念",
    philosophyText: "Hi我整呢個 website係希望可以幫到而家覺得迷惘嘅你因為我以前都經歷過同樣嘅階段。如果你有任何問題，都可以去我嘅 WhatsApp group／IG搵我傾計!",
    exchange: "新加坡國立大學交流 (亞洲第一學府)"
  },
};

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </h3>
);

export default function AboutMe({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] font-sans text-[var(--color-text-primary)] py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-white/10 shadow-lg">
            <img src="/askba14/profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
                Student
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {t.location}
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              <a 
                href="https://www.instagram.com/baaa.14_?igsh=OTAwZ3Fuemx4OWg5&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                BA<span className="text-blue-500">.</span>14
              </a>
            </h1>
            <p className="text-[19px] text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
              {t.bio}
            </p>
          </div>
        </div>

        {/* Philosophy Card */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-sm border border-[var(--color-border-primary)]">
            <SectionTitle icon={MessageCircle}>{t.philosophy}</SectionTitle>
            <div className="space-y-6">
              {lang === "粵" ? (
                <>
                  <p className="text-xl font-medium leading-relaxed text-[var(--color-text-primary)]">
                    "Hi, 我整呢個 website 係希望可以幫到而家覺得迷惘嘅你，因為我以前都經歷過同樣嘅階段。"
                  </p>
                  <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer w-full">
                    <AppleEmoji emoji="💬" className="w-5 h-5 shrink-0" />
                    <p className="text-[15px] font-bold">
                      如果你有任何問題，都可以去我嘅 <span className="underline decoration-2 underline-offset-2">WhatsApp group / IG</span> 搵我傾計!
                    </p>
                  </div>
                </>
              ) : (
                <blockquote className="text-xl font-medium leading-relaxed text-[var(--color-text-primary)]">
                  "{t.philosophyText}"
                </blockquote>
              )}
            </div>
        </div>

        {/* Education Card */}
        <div className="bg-[var(--color-bg-elevated)] rounded-2xl p-8 shadow-sm border border-[var(--color-border-primary)]">
          <SectionTitle icon={GraduationCap}>{t.education}</SectionTitle>
          <div className="space-y-8">
            
            {/* Research Assistant */}
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 p-1 border border-gray-100 dark:border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                    <img 
                        src="/askba14/samp_logo.jpg" 
                        className="w-full h-full object-contain" 
                        alt="SaMP Lab" 
                    />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[var(--color-text-primary)]">Undergraduate Researcher</h4>
                    <p className="text-[15px] text-[var(--color-text-secondary)]">Speech and Music Perception Lab</p>
                    <p className="text-sm text-[var(--color-text-tertiary)]">Research Assistant</p>
                </div>
            </div>

            {/* HKU */}
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 p-1 border border-gray-100 dark:border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                     <img src="/askba14/hku_logo.jpg" className="w-full h-full object-contain" alt="HKU" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[var(--color-text-primary)]">University of Hong Kong</h4>
                    <p className="text-[15px] text-[var(--color-text-secondary)]">Bachelor of Arts</p>
                    <ul className="list-disc list-inside text-sm text-[var(--color-text-tertiary)] mt-1 space-y-0.5">
                        <li>Double Major: English Studies, General Linguistics</li>
                        <li>Minor: Urban Studies</li>
                    </ul>
                </div>
            </div>

            {/* HKUSPACE */}
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 p-1 border border-gray-100 dark:border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                     <img src="/askba14/hkuspace_logo.png" className="w-full h-full object-contain" alt="HKU SPACE" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[var(--color-text-primary)]">HKUSPACE</h4>
                    <p className="text-[15px] text-[var(--color-text-secondary)]">Associate of Arts</p>
                </div>
            </div>

            {/* NUS */}
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 p-1 border border-gray-100 dark:border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                     <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/NUS_coat_of_arms.svg" className="w-full h-full object-contain" alt="NUS" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[var(--color-text-primary)]">National University of Singapore</h4>
                    <p className="text-[15px] text-[var(--color-text-secondary)]">Exchange Student</p>
                    <p className="text-sm text-[var(--color-text-tertiary)]">Faculty of Arts and Social Sciences</p>
                </div>
            </div>

             {/* DSE */}
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 p-1 border border-gray-100 dark:border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                     <img src="/askba14/HKEAA_logo.jpg" className="w-full h-full object-contain" alt="HKEAA" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[var(--color-text-primary)]">DSE</h4>
                    <p className="text-[15px] text-[var(--color-text-secondary)]">Best 5 only 14 lol</p>
                </div>
            </div>

          </div>
        </div>





      </div>
    </div>
  );
}
