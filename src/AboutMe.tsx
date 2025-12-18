import React, { useState, useEffect } from "react";
import { AppleEmoji } from "./components/AppleEmoji";

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

const GlassCard = ({ children, className = "", hoverEffect = true }: { children: React.ReactNode, className?: string, hoverEffect?: boolean }) => (
  <div className={`relative overflow-hidden bg-[var(--surface)] border border-[var(--border-subtle)] shadow-sm rounded-[2rem] ${hoverEffect ? 'transition-all duration-300 hover:shadow-md hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

const StatBadge = ({ emoji, label, value, color }: any) => (
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] shadow-sm">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-md`}>
      <AppleEmoji emoji={emoji} className="w-5 h-5" />
    </div>
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
      <div className="text-lg font-black text-[var(--text)] leading-none">{value}</div>
    </div>
  </div>
);

const ExperienceItem = ({ year, title, company, desc, isLast }: any) => (
  <div className="relative pl-8 pb-8 group">
    {!isLast && <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-[var(--border-subtle)] group-hover:bg-[var(--primary)]/30 transition-colors"></div>}
    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-[var(--surface)] bg-[var(--primary)] shadow-md group-hover:scale-110 transition-transform"></div>
    
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 w-fit">
        {year}
      </span>
      <h4 className="font-bold text-[var(--text)] text-base">{title}</h4>
    </div>
    <p className="text-xs font-bold text-[var(--secondary)] mb-2 flex items-center gap-1">
      <AppleEmoji emoji="💼" className="w-3 h-3" /> {company}
    </p>
    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{desc}</p>
  </div>
);

const SkillTag = ({ name, emoji }: any) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors cursor-default">
    {emoji && <AppleEmoji emoji={emoji} className="w-3.5 h-3.5" />}
    {name}
  </div>
);

export default function AboutMe({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  return (
    <div className="main-grid col-span-full">
      
      <div className="col-span-full w-full max-w-7xl mx-auto animate-fade-in p-4 md:p-8 relative z-10">
        
        {/* Hero Section */}
        <div className="relative mb-20 pt-10">
          <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border-4 border-[var(--surface)] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="/askba14/profile.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-widest border border-[var(--primary)]/20">
                  Student
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--surface)] text-[var(--text-muted)] text-xs font-bold border border-[var(--border-subtle)] flex items-center gap-1">
                  <AppleEmoji emoji="📍" className="w-3 h-3" /> {t.location}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text)] mb-4 leading-[0.9]">
                <a 
                  href="https://www.instagram.com/baaa.14_?igsh=OTAwZ3Fuemx4OWg5&utm_source=qr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  BA<span className="text-[var(--primary)]">.</span>14
                </a>
              </h1>
              <p className="text-xl text-[var(--text-muted)] font-medium max-w-2xl leading-relaxed">
                {t.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Philosophy Card - Large */}
          <div className="md:col-span-2">
            <GlassCard className="h-full p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-orange-500/5">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-500/10 rounded-xl">
                    <AppleEmoji emoji="💡" className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl text-[var(--text)] uppercase tracking-widest">{t.philosophy}</h3>
                </div>
                
                <div className="space-y-6">
                  {lang === "粵" ? (
                    <>
                      <p className="text-xl md:text-2xl font-bold leading-relaxed text-[var(--text)]">
                        "Hi, 我整呢個 website 係希望可以幫到而家覺得迷惘嘅你，因為我以前都經歷過同樣嘅階段。"
                      </p>
                      <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 transition-colors hover:bg-orange-500/20 cursor-pointer">
                        <AppleEmoji emoji="💬" className="w-5 h-5 shrink-0" />
                        <p className="text-base font-bold">
                          如果你有任何問題，都可以去我嘅 <span className="underline decoration-2 underline-offset-2">WhatsApp group / IG</span> 搵我傾計!
                        </p>
                      </div>
                    </>
                  ) : (
                    <blockquote className="text-2xl md:text-3xl font-bold leading-relaxed text-[var(--text)]">
                      "{t.philosophyText}"
                    </blockquote>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          



        </div>
      </div>
    </div>
  );
}