import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap, CheckCircle2, AlertCircle, ChevronDown,
  BookOpen, Users, Brain, ArrowRight, Clock, FileText,
  Scale, School, Trophy, Mail, Lock, Unlock, Star,
  Zap, Target, HelpCircle, XCircle, Play, Pause, RotateCcw,
  Check, Sparkles, RefreshCw, Shield, Swords, Map, Flag, Briefcase
} from "lucide-react";

// --- Animation & Layout Components ---

const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting));
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.98]'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Interactive Widgets ---

const HeroCard = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="relative w-full max-w-4xl mx-auto mb-32 pt-20 pb-12 text-center perspective-1000"
    >
      <div 
        className="absolute top-0 left-4 md:left-0 hidden md:block transition-transform duration-200 ease-out"
        style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
      >
        <span className="px-6 py-3 rounded-full bg-white dark:bg-[#1C1C1E] text-sm font-bold text-gray-900 dark:text-white -rotate-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10">Level 1</span>
      </div>
      <div 
        className="absolute top-20 right-4 md:right-0 hidden md:block transition-transform duration-200 ease-out"
        style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
      >
        <span className="px-6 py-3 rounded-full bg-white dark:bg-[#1C1C1E] text-sm font-bold text-gray-900 dark:text-white rotate-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10">Start Game</span>
      </div>

      <div 
        className="relative z-10 flex flex-col items-center transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${mousePos.y * 10}deg) rotateY(${mousePos.x * 10}deg)` }}
      >
        <div className="mb-10 p-8 rounded-[2.5rem] bg-white dark:bg-[#1C1C1E] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10">
          <GraduationCap size={80} strokeWidth={1} className="text-gray-900 dark:text-white" />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl font-medium leading-relaxed tracking-tight">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

const RetakeAssoSplit = () => {
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);
  
  return (
    <div className="flex w-full h-64 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1C1C1E]">
      <div 
        className={`flex-1 relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${hovered === 'right' ? 'flex-[0.6] opacity-40 grayscale' : 'flex-[1.4]'}`}
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute inset-0 bg-gray-50 dark:bg-white/5 transition-colors duration-500 hover:bg-white dark:hover:bg-white/10"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center mb-4 shadow-sm">
            <RotateCcw size={32} strokeWidth={1.5} />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Retake DSE</span>
          <p className="text-xs text-gray-500 mt-2 max-w-[150px]">100% Exam Focus. High Pressure. One Shot.</p>
        </div>
      </div>
      
      <div className="w-px bg-gray-100 dark:bg-white/5"></div>
      
      <div 
        className={`flex-1 relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${hovered === 'left' ? 'flex-[0.6] opacity-40 grayscale' : 'flex-[1.4]'}`}
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/20 transition-colors duration-500 hover:bg-white dark:hover:bg-zinc-900/30"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-4 shadow-lg shadow-black/20 dark:shadow-white/20">
            <Swords size={32} strokeWidth={1.5} />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Associate Degree</span>
          <p className="text-xs text-gray-500 mt-2 max-w-[150px]">Continuous Assessment. Assignments + Exams. New Game.</p>
        </div>
      </div>
    </div>
  );
};

const MindsetReset = () => {
  const [reset, setReset] = useState(false);
  
  return (
    <div className="w-full p-8 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none text-center">
      <div className={`transition-all duration-1000 ${reset ? "opacity-0 scale-90 h-0 overflow-hidden" : "opacity-100 scale-100 h-auto"}`}>
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Game Over?</h3>
        <p className="text-gray-500 mb-8">DSE didn't go as planned. You feel stuck.</p>
        <button 
          onClick={() => setReset(true)}
          className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
        >
          Insert Coin to Continue
        </button>
      </div>
      <div className={`transition-all duration-1000 ${!reset ? "opacity-0 scale-90 h-0 overflow-hidden" : "opacity-100 scale-100 h-auto"}`}>
        <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
          <Sparkles size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">New Game Started</h3>
        <p className="text-gray-500">Welcome to Year 1. This is your second chance. Reset your mindset.</p>
      </div>
    </div>
  );
};

const ChecklistWithProgress = ({ items, title }: { items: string[], title?: string }) => {
  const [checkedState, setCheckedState] = useState(new Array(items.length).fill(false));
  const progress = (checkedState.filter(Boolean).length / items.length) * 100;

  const toggle = (idx: number) => {
    const next = [...checkedState];
    next[idx] = !next[idx];
    setCheckedState(next);
  };

  return (
    <div className="w-full bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none">
      {title && <h4 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">{title}</h4>}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progress</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gray-900 dark:bg-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div 
            key={idx}
            onClick={() => toggle(idx)}
            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all duration-300 border ${
              checkedState[idx]
                ? "bg-gray-50 dark:bg-white/10 border-gray-200 dark:border-white/20"
                : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20"
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              checkedState[idx] 
                ? "bg-black dark:bg-white border-black dark:border-white scale-110" 
                : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-400"
            }`}>
              {checkedState[idx] && <Check size={14} className="text-white dark:text-black" />}
            </div>
            <span className={`text-[15px] font-medium transition-all ${checkedState[idx] ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-200"}`}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GPASimulator = () => {
  const [gpa, setGpa] = useState(3.0);
  
  return (
    <div className="flex flex-col items-center w-full py-8 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none">
      <div className="relative w-64 h-64 mb-10 group">
        <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-2xl">
          <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-[#2C2C2E]" />
          <circle
            cx="128" cy="128" r="110"
            stroke="currentColor" strokeWidth="8"
            fill="transparent"
            strokeDasharray={691}
            strokeDashoffset={691 - (691 * (gpa / 4.3))}
            className="text-black dark:text-white transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-7xl font-bold text-gray-900 dark:text-white tracking-tighter tabular-nums">{gpa.toFixed(1)}</span>
          <span className="text-xs text-gray-400 uppercase tracking-[0.3em] mt-4 font-bold">CGPA</span>
        </div>
      </div>
      
      <div className="w-full px-10">
        <input 
          type="range" 
          min="0" max="4.3" step="0.1" 
          value={gpa}
          onChange={(e) => setGpa(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-gray-200 dark:bg-[#2C2C2E] rounded-full appearance-none cursor-pointer accent-black dark:accent-white hover:accent-gray-800 dark:hover:accent-gray-200 transition-all"
        />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-6 font-mono uppercase tracking-widest">
          <span>0.0</span>
          <span className="text-gray-900 dark:text-white">Drag to simulate</span>
          <span>4.3</span>
        </div>
      </div>
    </div>
  );
};

const RadarChart = ({ labels, data }: { labels: string[], data: number[] }) => {
  // Simple pentagon radar chart
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;
  
  const points = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const val = data[i] / 100;
    return `${center + Math.cos(angle) * radius * val},${center + Math.sin(angle) * radius * val}`;
  }).join(" ");

  const bgPoints = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
  }).join(" ");

  return (
    <div className="w-full flex flex-col items-center bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none">
      <div className="relative w-[200px] h-[200px]">
        <svg width="200" height="200" className="overflow-visible">
          <polygon points={bgPoints} fill="none" stroke="currentColor" className="text-gray-200 dark:text-white/10" strokeWidth="1" />
          <polygon points={points} fill="currentColor" className="text-black/20 dark:text-white/20" stroke="currentColor" strokeWidth="2" />
          {labels.map((label, i) => {
             const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
             const x = center + Math.cos(angle) * (radius + 20);
             const y = center + Math.sin(angle) * (radius + 20);
             return (
               <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold fill-gray-500 dark:fill-gray-400 uppercase">
                 {label}
               </text>
             );
          })}
        </svg>
      </div>
      <p className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Non-JUPAS Readiness</p>
    </div>
  );
};

const LockCard = ({ type, title, subtitle }: { type: "direct" | "conditional", title: string, subtitle: string }) => {
  return (
    <div className={`group p-8 rounded-[2rem] border transition-all duration-500 hover:scale-[1.02] ${
      type === 'direct' 
        ? 'bg-white dark:bg-[#1C1C1E] border-gray-200 dark:border-white/10 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none' 
        : 'bg-gray-50 dark:bg-[#1C1C1E] border-gray-200 dark:border-white/10 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none'
    }`}>
      <div className="flex items-start justify-between mb-8">
        <div className={`p-4 rounded-2xl ${type === 'direct' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
          {type === 'direct' ? <Unlock size={28} strokeWidth={1.5} /> : <Lock size={28} strokeWidth={1.5} className="group-hover:animate-[shake_0.5s_ease-in-out]" />}
        </div>
        <span className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] ${
          type === 'direct' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400'
        }`}>
          {type === 'direct' ? 'SECURE' : 'PENDING'}
        </span>
      </div>
      <h4 className={`text-2xl font-bold mb-3 ${type === 'direct' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        {title}
      </h4>
      <p className={`text-sm font-medium ${type === 'direct' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
        {subtitle}
      </p>
    </div>
  );
};

const CONTENT = {
  EN: {
    hero: {
      title: "The Game of Asso",
      subtitle: "Player: Year 1 Student. Objective: University Offer."
    },
    sections: [
      {
        id: "0",
        title: "Stage 0: The Choice",
        visual: <RetakeAssoSplit />,
        details: "After DSE, you are confused. Two paths: Retake (Exam Focus) or Associate Degree (Continuous Assessment). Don't do both. Pick one main quest."
      },
      {
        id: "1",
        title: "Stage 1: New Game",
        visual: <MindsetReset />,
        details: "Reset your mindset. This is a new game. Check your language requirements (Full Cert?). If you missed English/Chinese, plan a retake NOW."
      },
      {
        id: "2",
        title: "Stage 2: The Rules",
        visual: (
          <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="flex justify-between items-end h-32 gap-4">
              <div className="w-full bg-gray-100 dark:bg-white/10 rounded-t-xl relative group">
                <div className="absolute bottom-0 w-full bg-gray-400 dark:bg-gray-600 h-[80%] rounded-t-xl transition-all group-hover:bg-black dark:group-hover:bg-white"></div>
                <span className="absolute -top-6 w-full text-center text-xs font-bold">4.0 Cap</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/10 rounded-t-xl relative group">
                <div className="absolute bottom-0 w-full bg-gray-400 dark:bg-gray-600 h-[90%] rounded-t-xl transition-all group-hover:bg-black dark:group-hover:bg-white"></div>
                <span className="absolute -top-6 w-full text-center text-xs font-bold">4.3 Internal</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">Know your max GPA. It's curved.</p>
          </div>
        ),
        details: "Understand the grading system. 4.3 scale vs 4.0 cap. Grading is curved - your grade depends on how others perform."
      },
      {
        id: "3",
        title: "Stage 3: Teammates",
        visual: (
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
               <CheckCircle2 className="text-green-600 mb-2" />
               <h4 className="font-bold text-green-900 dark:text-green-400">Carry</h4>
               <p className="text-xs text-green-700 dark:text-green-300">Sits in front. Asks questions.</p>
             </div>
             <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
               <XCircle className="text-red-600 mb-2" />
               <h4 className="font-bold text-red-900 dark:text-red-400">Freerider</h4>
               <p className="text-xs text-red-700 dark:text-red-300">Ghost. Document everything.</p>
             </div>
          </div>
        ),
        details: "Continuous Assessment is your friend. Don't rely on the final exam. Manage your groupmates. Document freeriders."
      },
      {
        id: "4",
        title: "Stage 4: First Loot",
        visual: <GPASimulator />,
        details: "Sem 1 ends. Check your GPA. If it's bad, calculate what you need to recover. Appeal only if you are sure about marking errors."
      },
      {
        id: "5",
        title: "Stage 5: Side Quest",
        visual: <ChecklistWithProgress items={["Review Sem 1 Notes", "Set Sem 2 Goal", "Register IELTS/DSE"]} title="Sem Break Tasks" />,
        details: "Sem Break is for resetting and language side quests. If you need to retake English/Chinese, do it now."
      },
      {
        id: "6",
        title: "Stage 6: Stability",
        visual: (
          <div className="flex flex-col gap-2">
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
              <Clock size={20} /> <span>Timetable Strategy</span>
            </div>
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
              <Brain size={20} /> <span>Feynman Method</span>
            </div>
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
              <Target size={20} /> <span>Priority: GPA</span>
            </div>
          </div>
        ),
        details: "Build a study system. Balance your timetable. Prioritize GPA over everything else."
      },
      {
        id: "7",
        title: "Stage 7: Upgrade",
        visual: (
          <div className="grid grid-cols-3 gap-2">
            <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-xl text-center">
              <span className="text-xs font-bold block mb-2">Summer</span>
              <BookOpen className="mx-auto mb-2" size={20} />
              <span className="text-[10px]">Retake</span>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-xl text-center">
              <span className="text-xs font-bold block mb-2">Intern</span>
              <Briefcase className="mx-auto mb-2" size={20} />
              <span className="text-[10px]">CV Boost</span>
            </div>
            <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-center shadow-lg">
              <span className="text-xs font-bold block mb-2">Plan</span>
              <Map className="mx-auto mb-2" size={20} />
              <span className="text-[10px]">Non-JUPAS</span>
            </div>
          </div>
        ),
        details: "Summer options: Retake courses to save GPA, Intern for CV, or Plan your Non-JUPAS strategy."
      },
      {
        id: "8",
        title: "Stage 8: Non-JUPAS",
        visual: <RadarChart labels={["GPA", "PS", "Docs", "Interview", "Choice"]} data={[80, 60, 100, 40, 90]} />,
        details: "Year 2 Sem 1. Apply for Non-JUPAS. Prepare documents (Soft Copy). Write your Personal Statement (don't copy DSE one)."
      },
      {
        id: "9",
        title: "Stage 9: Interview",
        visual: <ChecklistWithProgress items={["Check Email Daily", "Prepare Intro", "Mock Interview"]} title="Interview Prep" />,
        details: "Interview season. Check emails daily. Prepare for group discussions. It's about listening and integrating, not just talking."
      },
      {
        id: "10",
        title: "Stage 10: Boss Fight",
        visual: (
          <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 text-center">
            <Shield size={48} className="mx-auto text-red-500 mb-4" />
            <h4 className="text-xl font-bold text-red-900 dark:text-red-400">Killer Subject</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">Don't complain. Find help. Survive.</p>
          </div>
        ),
        details: "Year 2 Sem 2. The final stretch. Manage 'Killer' subjects. Every assignment adds HP to your offer chances."
      },
      {
        id: "11",
        title: "Stage 11: The Offer",
        visual: (
          <div className="grid grid-cols-1 gap-4">
            <LockCard type="direct" title="Direct Offer" subtitle="Secure" />
            <LockCard type="conditional" title="Conditional" subtitle="GPA Req." />
          </div>
        ),
        details: "Direct vs Conditional. Pay the deposit (non-refundable). If you miss a deadline, email immediately."
      },
      {
        id: "12",
        title: "Stage 12: Final Boss",
        visual: <ChecklistWithProgress items={["Official Transcript", "DSE Cert", "Language Cert", "Oath"]} title="Paperwork" />,
        details: "Paperwork hell. Official transcripts, oaths, mailing documents. Do exactly as instructed."
      },
      {
        id: "13",
        title: "Stage 13: Victory",
        visual: (
          <div className="p-8 bg-yellow-50 dark:bg-yellow-900/10 rounded-[2rem] border border-yellow-100 dark:border-yellow-900/20 text-center">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
            <h4 className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">University Student</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">Level Up Complete.</p>
          </div>
        ),
        details: "You made it. It wasn't luck. It was strategy. Welcome back to University."
      }
    ]
  },
  ZH: {
    hero: {
      title: "Asso 遊戲攻略",
      subtitle: "玩家：Year 1 新生。目標：大學 Offer。"
    },
    sections: [
      {
        id: "0",
        title: "Stage 0: 抉擇",
        visual: <RetakeAssoSplit />,
        details: "DSE 後好迷惘？兩條路：Retake (一試定生死) 或 Asso (持續評估)。唔好雙修，揀定一條主線。"
      },
      {
        id: "1",
        title: "Stage 1: 新遊戲",
        visual: <MindsetReset />,
        details: "Reset 心態。呢個係二周目。Check 下有冇 Full Cert (3322)。如果中英文未達標，Year 1 就要報重考。"
      },
      {
        id: "2",
        title: "Stage 2: 遊戲規則",
        visual: (
          <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="flex justify-between items-end h-32 gap-4">
              <div className="w-full bg-gray-100 dark:bg-white/10 rounded-t-xl relative group">
                <div className="absolute bottom-0 w-full bg-gray-400 dark:bg-gray-600 h-[80%] rounded-t-xl transition-all group-hover:bg-black dark:group-hover:bg-white"></div>
                <span className="absolute -top-6 w-full text-center text-xs font-bold">4.0 Cap</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-white/10 rounded-t-xl relative group">
                <div className="absolute bottom-0 w-full bg-gray-400 dark:bg-gray-600 h-[90%] rounded-t-xl transition-all group-hover:bg-black dark:group-hover:bg-white"></div>
                <span className="absolute -top-6 w-full text-center text-xs font-bold">4.3 Internal</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">留意 GPA 上限。拉 Curve 機制。</p>
          </div>
        ),
        details: "了解 GPA 系統。4.3 scale vs 4.0 cap。成績係拉 Curve 嘅，你嘅 Grade 取決於其他人考成點。"
      },
      {
        id: "3",
        title: "Stage 3: 隊友與敵人",
        visual: (
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30">
               <CheckCircle2 className="text-green-600 mb-2" />
               <h4 className="font-bold text-green-900 dark:text-green-400">Carry</h4>
               <p className="text-xs text-green-700 dark:text-green-300">坐前排，會主動。</p>
             </div>
             <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30">
               <XCircle className="text-red-600 mb-2" />
               <h4 className="font-bold text-red-900 dark:text-red-400">Freerider</h4>
               <p className="text-xs text-red-700 dark:text-red-300">潛水。記得留證據。</p>
             </div>
          </div>
        ),
        details: "Continuous Assessment 係你朋友。唔好靠 Final Exam。小心揀 Groupmate，遇到 Freerider 要狠心 Report。"
      },
      {
        id: "4",
        title: "Stage 4: 第一份戰利品",
        visual: <GPASimulator />,
        details: "Sem 1 出 Grade。睇 GPA。如果爛咗，計下要點追。除非好肯定計錯分，否則唔好亂 Appeal。"
      },
      {
        id: "5",
        title: "Stage 5: 支線任務",
        visual: <ChecklistWithProgress items={["整理 Sem 1 Notes", "設定 Sem 2 目標", "報考 IELTS/DSE"]} title="Sem Break 任務" />,
        details: "Sem Break 係用嚟 Reset 同埋搞語文支線。如果中英文未搞掂，而家好報名啦。"
      },
      {
        id: "6",
        title: "Stage 6: 穩定輸出",
        visual: (
          <div className="flex flex-col gap-2">
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
              <Clock size={20} /> <span>自砌 Timetable</span>
            </div>
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
              <Brain size={20} /> <span>Feynman 學習法</span>
            </div>
            <div className="p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
              <Target size={20} /> <span>GPA 優先</span>
            </div>
          </div>
        ),
        details: "建立讀書系統。平衡 Timetable。記住 GPA 係主線，其他嘢都要讓路。"
      },
      {
        id: "7",
        title: "Stage 7: 升級路線",
        visual: (
          <div className="grid grid-cols-3 gap-2">
            <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-xl text-center">
              <span className="text-xs font-bold block mb-2">暑修</span>
              <BookOpen className="mx-auto mb-2" size={20} />
              <span className="text-[10px]">救 GPA</span>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-white/10 rounded-xl text-center">
              <span className="text-xs font-bold block mb-2">實習</span>
              <Briefcase className="mx-auto mb-2" size={20} />
              <span className="text-[10px]">刷 CV</span>
            </div>
            <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-center shadow-lg">
              <span className="text-xs font-bold block mb-2">規劃</span>
              <Map className="mx-auto mb-2" size={20} />
              <span className="text-[10px]">Non-JUPAS</span>
            </div>
          </div>
        ),
        details: "暑假三條路：暑修救 Grade、實習刷 CV、或者開始規劃 Non-JUPAS 策略。"
      },
      {
        id: "8",
        title: "Stage 8: Non-JUPAS",
        visual: <RadarChart labels={["GPA", "PS", "文件", "面試", "選科"]} data={[80, 60, 100, 40, 90]} />,
        details: "Year 2 Sem 1。報 Non-JUPAS。準備 Soft Copy 文件。寫 Personal Statement (唔好 Copy DSE 嗰篇)。"
      },
      {
        id: "9",
        title: "Stage 9: 面試季節",
        visual: <ChecklistWithProgress items={["每日 Check Email", "準備自我介紹", "Mock Interview"]} title="面試準備" />,
        details: "面試高峰期。每日 Check Email。準備小組討論。重點係聆聽同整合，唔係鬥講得多。"
      },
      {
        id: "10",
        title: "Stage 10: Boss Fight",
        visual: (
          <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 text-center">
            <Shield size={48} className="mx-auto text-red-500 mb-4" />
            <h4 className="text-xl font-bold text-red-900 dark:text-red-400">Killer 科</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">唔好怨。搵人幫。頂住。</p>
          </div>
        ),
        details: "Year 2 Sem 2。最後衝刺。處理 Killer 科。每一份功課都係幫你個 Offer 加血。"
      },
      {
        id: "11",
        title: "Stage 11: 收成期",
        visual: (
          <div className="grid grid-cols-1 gap-4">
            <LockCard type="direct" title="Direct Offer" subtitle="直接取錄" />
            <LockCard type="conditional" title="Conditional" subtitle="需達 GPA" />
          </div>
        ),
        details: "Direct vs Conditional。交留位費 (通常無得退)。Miss 咗 Deadline 要即刻 Email 求情。"
      },
      {
        id: "12",
        title: "Stage 12: 最終 Boss",
        visual: <ChecklistWithProgress items={["正式成績表", "DSE 證書", "語文成績", "宣誓"]} title="文件地獄" />,
        details: "Paperwork 地獄。正式 Transcript、宣誓、寄文件。跟足指示做，唔好懶。"
      },
      {
        id: "13",
        title: "Stage 13: 通關",
        visual: (
          <div className="p-8 bg-yellow-50 dark:bg-yellow-900/10 rounded-[2rem] border border-yellow-100 dark:border-yellow-900/20 text-center">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
            <h4 className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">大學生</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">Level Up Complete.</p>
          </div>
        ),
        details: "你得咗。唔係靠運氣，係靠策略。歡迎返嚟大學世界。"
      }
    ]
  }
};


export default function AssociateDegreeTips({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "ZH" : "EN") as "EN" | "ZH";
  const t = CONTENT[lang];

  return (
    <div className="col-span-full w-full">
      <div className="w-full py-12 md:py-24">
        
        <HeroCard title={t.hero.title} subtitle={t.hero.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Spine - Sticky Navigation */}
          <div className="hidden md:block md:col-span-3 relative">
            <div className="sticky top-32">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
              <div className="pl-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Stage Map</div>
                {t.sections.map((section, index) => (
                  <a 
                    key={section.id} 
                    href={`#section-${section.id}`}
                    className="group flex items-center gap-4 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span className="text-[10px] font-mono opacity-30 group-hover:opacity-100 transition-opacity w-6">{index}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300 truncate">{section.title.split(':')[1] || section.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="md:col-span-9 space-y-32">
            {t.sections.map((section, index) => (
              <div key={section.id} id={`section-${section.id}`} className="scroll-mt-32">
                <FadeInSection delay={100}>
                  <div className="flex items-center gap-6 mb-10">
                    <div className="flex items-center justify-center w-16 h-16 rounded-[2rem] bg-white dark:bg-white/5 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 text-xl font-bold text-gray-400 dark:text-gray-600 font-mono">
                      {index}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Visual Widget Area - Wider */}
                    <div className="lg:col-span-3">
                      {section.visual}
                    </div>

                    {/* Text / Details Area - Narrower */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                      <div className="p-8 rounded-[2rem] bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-500">
                        <BookOpen className="text-gray-900 dark:text-white mb-6" size={28} />
                        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-300 font-medium">
                          {section.details}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-48 text-center border-t border-gray-100 dark:border-white/5 pt-24">
          <p className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black dark:from-gray-400 dark:to-white max-w-3xl mx-auto leading-tight">
            {lang === "EN" 
              ? "\"It's not luck. It's a game you can win.\"" 
              : "「升返 U 唔係靠運氣，係一個可以被攻略嘅遊戲。」"}
          </p>
        </div>
      </div>
    </div>
  );
}

