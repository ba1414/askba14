import React, { useState, useEffect } from "react";
import { MapPin, Mail, Github, Linkedin, Globe, Code, Heart, Coffee, Music, Camera, Book, ArrowUpRight, Sparkles, Play, Pause, SkipForward, Languages, Terminal, Cpu, Palette, Briefcase, GraduationCap } from "lucide-react";

const TRANSLATIONS = {
  EN: {
    title: "About Me",
    subtitle: "DSE 14 Points • No Full Cert • HKU in 1 Year",
    bio: "DSE 14 Points, No Full Cert. From having no university offers to getting into HKU in just one year.",
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
    philosophy: "Linguistics x Tech",
    philosophyText: "Language is the original code. Understanding syntax, semantics, and pragmatics in human speech helps me write cleaner, more semantic code and design more intuitive user interfaces."
  },
  粵: {
    title: "關於我",
    subtitle: "DSE 14分 • 冇Full Cert • 一年入HKU",
    bio: "Dse 14分冇full cert 由無任何大學收，到一年入HKU",
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
    philosophy: "語言學 x 科技",
    philosophyText: "語言係最原始嘅代碼。理解人類語言中嘅句法、語義同語用，幫助我編寫更簡潔、更具語義嘅代碼，並設計更直觀嘅用戶界面。"
  },
};

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className={`transition-all duration-200 ease-out ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ 
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
};

const MusicPlayer = ({ t }: { t: any }) => {
  const [playing, setPlaying] = useState(true);
  
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden group cursor-pointer">
        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Album Art" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-0.5">{t.nowPlaying}</p>
        <p className="text-sm font-bold text-white truncate">{t.song}</p>
        <p className="text-xs text-white/80 truncate">{t.artist}</p>
      </div>
      <button 
        onClick={() => setPlaying(!playing)}
        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
      >
        {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
    </div>
  );
};

const ExperienceItem = ({ year, title, company, desc }: any) => (
  <div className="relative pl-6 pb-8 last:pb-0 border-l border-white/10 last:border-0 group">
    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-apple-red-500 ring-4 ring-card group-hover:scale-125 transition-transform duration-300"></div>
    <span className="text-[10px] font-bold text-apple-red-400 mb-1 block uppercase tracking-wider">{year}</span>
    <h4 className="font-bold text-primary text-sm mb-0.5">{title}</h4>
    <p className="text-xs text-secondary font-medium mb-2">{company}</p>
    <p className="text-xs text-muted leading-relaxed opacity-80">{desc}</p>
  </div>
);

const ProjectCard = ({ title, desc, tags, color, icon: Icon }: any) => (
  <div className={`p-6 rounded-[32px] ${color} hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full relative overflow-hidden group border border-white/5`}>
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
      <Icon size={80} />
    </div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
        <Icon size={20} className="text-primary" />
      </div>
      <ArrowUpRight className="text-white/50" />
    </div>
    <h3 className="text-xl font-bold text-primary mb-2 relative z-10">{title}</h3>
    <p className="text-secondary text-sm mb-6 leading-relaxed relative z-10 flex-grow">{desc}</p>
    <div className="flex gap-2 flex-wrap relative z-10">
      {tags.map((tag: string) => (
        <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] font-medium backdrop-blur-sm border border-white/5">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default function AboutMe({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  return (
    <div className="main-grid col-span-full">
      
      <div className="col-span-full w-full max-w-7xl mx-auto animate-fade-in p-4 md:p-8 relative z-10" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', 'Segoe UI', Roboto, sans-serif" }}>
        {/* Header */}
        <div className="mb-16 text-center relative z-10">
          <h1 className="relative text-6xl md:text-8xl font-bold text-primary tracking-tighter mb-6">
            {t.title}
          </h1>
          <p className="relative text-xl md:text-2xl text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[minmax(180px,auto)] relative z-10">
          
          {/* Profile Card - Large */}
          <TiltCard className="md:col-span-2 md:row-span-2 bg-white dark:bg-zinc-900 rounded-[40px] p-10 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            
            <div className="relative w-56 h-56 mb-10 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="relative w-full h-full rounded-full p-1.5 bg-gray-100 dark:bg-zinc-800">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-inner">
                  <img 
                    src="/askba14/profile.png" 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 right-4 bg-white dark:bg-zinc-800 text-2xl shadow-lg rounded-full p-2 border border-black/5 dark:border-white/10">
                👋
              </div>
            </div>

            <h2 className="text-7xl font-bold mb-3 text-primary tracking-tighter">
              BA
            </h2>
            <div className="flex items-center gap-2 text-secondary bg-gray-100 dark:bg-zinc-800 px-5 py-2.5 rounded-full text-sm font-semibold border border-black/5 dark:border-white/5">
              <MapPin size={16} className="text-primary" />
              {t.location}
            </div>
          </TiltCard>

          {/* Bio Card - Expanded */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-[40px] p-10 flex flex-col justify-center relative overflow-hidden group border border-black/5 dark:border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 duration-500">
              <Sparkles size={120} className="text-primary" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Languages size={24} />
              </div>
              <p className="text-xl md:text-2xl leading-relaxed text-primary font-medium">
                {t.bio}
              </p>
            </div>
          </div>

          {/* Education Card */}
          <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-black/5 dark:border-white/10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
            <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:rotate-12 transition-transform duration-300">
              <GraduationCap size={28} />
            </div>
            <div>
              <h3 className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">{t.education}</h3>
              <p className="font-bold text-lg text-primary leading-tight mb-1">{t.university}</p>
              <p className="text-sm font-medium text-secondary leading-snug">{t.major}</p>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="md:col-span-1 md:row-span-2 bg-white dark:bg-zinc-900 rounded-[40px] p-8 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-primary">
                <Briefcase size={20} />
              </div>
              <h3 className="font-bold text-lg text-primary">{t.experience}</h3>
            </div>
            <div className="space-y-2">
              <ExperienceItem 
                year="2024 - Present" 
                title="Full Stack Developer" 
                company="Freelance" 
                desc="Building accessible web apps with React & Node.js."
              />
              <ExperienceItem 
                year="2023 - 2024" 
                title="Frontend Intern" 
                company="Tech Startup HK" 
                desc="Optimized UI/UX for high-traffic dashboard."
              />
              <ExperienceItem 
                year="2020 - 2024" 
                title="Student" 
                company="HKU" 
                desc="Specialized in Computational Linguistics."
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-[40px] p-8 text-primary flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 border border-black/5 dark:border-white/10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-black/5 dark:border-white/5">
                  <Code size={28} className="text-primary" />
                </div>
                <ArrowUpRight className="text-secondary" />
              </div>
              <h3 className="text-secondary text-xs font-bold uppercase tracking-widest mb-4">{t.skills}</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">Frontend</p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Next.js'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-[11px] font-semibold border border-black/5 dark:border-white/5 text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Backend & Tools</p>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'Python', 'Firebase', 'Git', 'Figma'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-full text-[11px] font-semibold border border-black/10 dark:border-white/10 text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Row */}
          <div className="md:col-span-1">
            <ProjectCard 
              title="AskBA" 
              desc="Interactive survival guide for Associate Degree students." 
              tags={['React', 'Vite', 'Tailwind']}
              color="bg-white dark:bg-zinc-900"
              icon={Terminal}
            />
          </div>
          <div className="md:col-span-1">
            <ProjectCard 
              title="LinguaFlow" 
              desc="NLP tool for analyzing sentence structures." 
              tags={['Python', 'NLTK', 'Flask']}
              color="bg-white dark:bg-zinc-900"
              icon={Cpu}
            />
          </div>

          {/* Philosophy Card */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-[40px] p-10 text-primary relative overflow-hidden group border border-black/5 dark:border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 dark:bg-zinc-800 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-primary">
                  <Palette size={20} />
                </div>
                <h3 className="font-bold text-lg">{t.philosophy}</h3>
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-primary/90 font-medium">
                "{t.philosophyText}"
              </p>
            </div>
          </div>

          {/* Interests / Vibe Card */}
          <div className="md:col-span-2 bg-zinc-900 dark:bg-white rounded-[40px] p-8 text-white dark:text-black shadow-xl relative overflow-hidden group flex flex-col justify-between">
            
            <div className="relative z-10 flex justify-between items-start mb-8">
              <div>
                <h3 className="text-white/60 dark:text-black/60 text-xs font-bold uppercase tracking-widest mb-1">{t.interests}</h3>
                <p className="text-2xl font-bold">Creative Flow</p>
              </div>
              <div className="flex gap-2">
                {[Camera, Coffee, Globe].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center border border-white/10 dark:border-black/10">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <MusicPlayer t={t} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}