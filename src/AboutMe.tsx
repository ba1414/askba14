import React from "react";
import { MapPin, Mail, Github, Linkedin, Globe, Code, Heart, Coffee, Music, Camera, Book } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "About Me",
    subtitle: "Developer • Designer • Creator",
    bio: "I'm a passionate developer who loves building beautiful and functional applications. I believe in the power of design to solve problems and enhance user experiences.",
    location: "Hong Kong",
    skills: "Skills",
    interests: "Interests",
    contact: "Get in Touch",
    education: "Education",
    university: "University of Hong Kong",
    major: "Computer Science",
  },
  粵: {
    title: "關於我",
    subtitle: "開發者 • 設計師 • 創作者",
    bio: "我係一個熱愛建立美觀實用應用程式嘅開發者。我相信設計嘅力量可以解決問題並提升用戶體驗。",
    location: "香港",
    skills: "技能",
    interests: "興趣",
    contact: "聯絡我",
    education: "學歷",
    university: "香港大學",
    major: "計算機科學",
  },
};

export default function AboutMe({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif" }}>
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight mb-4">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-[#86868B] font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Profile Card - Large */}
        <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-8 shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-48 h-48 rounded-full mb-8 p-1 bg-gradient-to-br from-[#007AFF] to-[#5856D6] shadow-2xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#1C1C1E] border-4 border-white dark:border-[#1C1C1E]">
              <img 
                src="/askba14/profile.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 
            className="text-6xl font-extrabold mb-2 relative z-10 bg-gradient-to-b from-[#1D1D1F] to-[#1D1D1F]/50 dark:from-[#F5F5F7] dark:to-[#F5F5F7]/50 bg-clip-text text-transparent" 
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif" }}
          >
            BA
          </h2>
          <div className="flex items-center gap-2 text-[#86868B] bg-[#F2F2F7] dark:bg-[#2C2C2E] px-4 py-2 rounded-full text-sm font-medium relative z-10">
            <MapPin size={14} />
            {t.location}
          </div>
        </div>

        {/* Bio Card - Wide */}
        <div className="md:col-span-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[2.5rem] p-8 flex flex-col justify-center hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors duration-300">
          <p className="text-lg md:text-xl leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
            "{t.bio}"
          </p>
        </div>

        {/* Education Card */}
        <div className="md:col-span-1 bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] p-6 border border-[#E5E5EA] dark:border-[#2C2C2E] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div className="w-12 h-12 bg-[#FF9500] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-4">
            <Book size={24} />
          </div>
          <div>
            <h3 className="text-[#86868B] text-xs font-bold uppercase tracking-wider mb-1">{t.education}</h3>
            <p className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{t.university}</p>
            <p className="text-sm text-[#86868B]">{t.major}</p>
          </div>
        </div>

        {/* Skills Card */}
        <div className="md:col-span-1 bg-[#1D1D1F] dark:bg-white rounded-[2.5rem] p-6 text-white dark:text-[#1D1D1F] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-xl">
          <div className="w-12 h-12 bg-white/20 dark:bg-black/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
            <Code size={24} />
          </div>
          <div>
            <h3 className="opacity-60 text-xs font-bold uppercase tracking-wider mb-3">{t.skills}</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Node.js', 'UI/UX'].map(skill => (
                <span key={skill} className="px-2 py-1 bg-white/10 dark:bg-black/5 rounded-lg text-xs font-medium border border-white/10 dark:border-black/5">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Interests Grid */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-[2.5rem] p-8 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-6">{t.interests}</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Camera, label: "Photo" },
                { icon: Music, label: "Music" },
                { icon: Coffee, label: "Coffee" },
                { icon: Globe, label: "Travel" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group/item">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover/item:bg-white/30 transition-colors">
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-medium opacity-80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          {[
            { icon: Github, label: "GitHub", bg: "bg-[#24292e] text-white" },
            { icon: Linkedin, label: "LinkedIn", bg: "bg-[#0077b5] text-white" },
            { icon: Mail, label: "Email", bg: "bg-[#34C759] text-white" }
          ].map((social, i) => (
            <a 
              key={i}
              href="#"
              className={`${social.bg} rounded-[2rem] flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300 shadow-lg`}
            >
              <social.icon size={24} className="mb-2" />
              <span className="text-xs font-bold">{social.label}</span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
