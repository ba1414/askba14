import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap, CheckCircle2, AlertCircle, ChevronDown,
  BookOpen, Users, Brain, ArrowRight, Clock, FileText,
  Scale, School, Trophy, Mail, Lock, Unlock, Star,
  Zap, Target, HelpCircle, XCircle, Play, Pause, RotateCcw,
  Check, Sparkles
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

const ExpandableCard = ({ title, icon: Icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-4 bg-white dark:bg-[#1C1C1E] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left group transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}>
            {Icon && <Icon size={20} />}
          </div>
          <span className="font-semibold text-[15px] text-gray-900 dark:text-white">{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-180 text-black dark:text-white" : ""}`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-0 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">
          {children}
        </div>
      </div>
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
      {/* Floating Chips with Parallax */}
      <div 
        className="absolute top-0 left-4 md:left-0 hidden md:block transition-transform duration-200 ease-out"
        style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
      >
        <span className="px-6 py-3 rounded-full bg-white dark:bg-[#1C1C1E] text-sm font-bold text-gray-900 dark:text-white -rotate-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10">GPA 4.0?</span>
      </div>
      <div 
        className="absolute top-20 right-4 md:right-0 hidden md:block transition-transform duration-200 ease-out"
        style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
      >
        <span className="px-6 py-3 rounded-full bg-white dark:bg-[#1C1C1E] text-sm font-bold text-gray-900 dark:text-white rotate-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10">Non-JUPAS</span>
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

const FlipNumber = ({ value }: { value: number }) => {
  return (
    <div className="relative w-16 h-24 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden group hover:-translate-y-2 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/5 pointer-events-none"></div>
      <span className="text-5xl font-mono font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-500 tracking-tighter">
        {value}
      </span>
    </div>
  );
};

const RetakeAssoSplit = () => {
  const [hovered, setHovered] = useState<"left" | "right" | null>(null);
  
  return (
    <div className="flex w-full h-48 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1C1C1E]">
      <div 
        className={`flex-1 relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${hovered === 'right' ? 'flex-[0.6] opacity-40 grayscale' : 'flex-[1.4]'}`}
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute inset-0 bg-gray-50 dark:bg-white/5 transition-colors duration-500 hover:bg-white dark:hover:bg-white/10"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center mb-4 shadow-sm">
            <AlertCircle size={32} strokeWidth={1.5} />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Retake DSE</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">Exam Focus</span>
        </div>
      </div>
      
      <div className="w-px bg-gray-100 dark:bg-white/5"></div>
      
      <div 
        className={`flex-1 relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${hovered === 'left' ? 'flex-[0.6] opacity-40 grayscale' : 'flex-[1.4]'}`}
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/20 transition-colors duration-500 hover:bg-white dark:hover:bg-zinc-900/30"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-4 shadow-lg shadow-black/20 dark:shadow-white/20">
            <CheckCircle2 size={32} strokeWidth={1.5} />
          </div>
          <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Associate Degree</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">New Start</span>
        </div>
      </div>
    </div>
  );
};

const TabbedSelector = () => {
  const [active, setActive] = useState("ability");
  const tabs = [
    { id: "ability", label: "Ability", icon: Brain, color: "text-white dark:text-black", bg: "bg-black dark:bg-white" },
    { id: "interest", label: "Interest", icon: Star, color: "text-white dark:text-black", bg: "bg-black dark:bg-white" },
    { id: "career", label: "Career", icon: Target, color: "text-white dark:text-black", bg: "bg-black dark:bg-white" }
  ];

  return (
    <div className="w-full">
      <div className="flex p-1.5 bg-gray-100 dark:bg-[#2C2C2E] rounded-2xl mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all duration-500 ${
              active === tab.id 
                ? "bg-white dark:bg-[#1C1C1E] shadow-lg shadow-gray-200/50 dark:shadow-none text-black dark:text-white scale-100" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 scale-95"
            }`}
          >
            <tab.icon size={18} className={`transition-colors duration-300 ${active === tab.id ? "text-black dark:text-white" : "currentColor"}`} />
            <span className="hidden md:inline tracking-tight">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="p-10 bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] border border-gray-100 dark:border-white/10 min-h-[160px] flex items-center justify-center text-center shadow-xl shadow-gray-200/50 dark:shadow-none">
        <p className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white animate-[fadeIn_0.5s_ease-out] leading-relaxed max-w-lg">
          {active === "ability" && "Check your DSE electives. Good at Bio? Science. Good at writing? Arts. Don't force it."}
          {active === "interest" && "You will study this for 2-4 years. If you hate it, you won't get a high GPA."}
          {active === "career" && "Look at the university articulation list. Does this Asso program actually lead there?"}
        </p>
      </div>
    </div>
  );
};

const ChecklistWithProgress = ({ items }: { items: string[] }) => {
  const [checkedState, setCheckedState] = useState(new Array(items.length).fill(false));
  const progress = (checkedState.filter(Boolean).length / items.length) * 100;

  const toggle = (idx: number) => {
    const next = [...checkedState];
    next[idx] = !next[idx];
    setCheckedState(next);
  };

  return (
    <div className="w-full">
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
    <div className="flex flex-col items-center w-full py-8">
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

const CharacterCard3D = ({ title, desc, icon: Icon, type }: any) => {
  return (
    <div className="group perspective-1000 w-full h-full">
      <div className="relative h-full p-6 rounded-3xl bg-white dark:bg-[#2C2C2E] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-x-2 hover:rotate-y-2">
        <div className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
          type === 'good' ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-gray-300'
        }`}>
          <Icon size={28} />
        </div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h4>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const FeynmanTimer = () => {
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 mins

  useEffect(() => {
    let interval: any;
    if (active && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, timeLeft]);

  const reset = () => {
    setActive(false);
    setTimeLeft(120);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-[#1C1C1E] rounded-[2.5rem] p-10 flex flex-col items-center text-center border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none">
      <div className="mb-8 relative">
        <span className="relative text-7xl font-mono font-bold text-gray-900 dark:text-white tabular-nums tracking-tighter">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-10 max-w-xs leading-relaxed uppercase tracking-wide">
        Explain a concept in 2 minutes.
      </p>
      <div className="flex gap-4 w-full justify-center">
        {!active ? (
          <button onClick={() => setActive(true)} className="flex-1 max-w-[140px] flex items-center justify-center gap-2 px-6 py-4 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-500/20 dark:shadow-none">
            <Play size={20} fill="currentColor" /> Start
          </button>
        ) : (
          <button onClick={() => setActive(false)} className="flex-1 max-w-[140px] flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-[#2C2C2E] text-black dark:text-white border-2 border-black dark:border-white/20 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-white/10 active:scale-95">
            <Pause size={20} fill="currentColor" /> Pause
          </button>
        )}
        <button onClick={reset} className="p-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors bg-gray-100 dark:bg-[#2C2C2E] rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10">
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

const TargetBars = () => {
  return (
    <div className="space-y-10 w-full px-2">
      <div className="relative pt-2">
        <div className="flex justify-between text-xs font-bold mb-4 uppercase tracking-widest">
          <span className="text-gray-500 dark:text-gray-400">Year 1 Entry</span>
          <span className="text-black dark:text-white bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-lg">~4.0</span>
        </div>
        <div className="h-6 bg-gray-100 dark:bg-[#2C2C2E] rounded-full overflow-hidden">
          <div className="h-full bg-black dark:bg-white w-[95%] animate-[growWidth_1.5s_ease-out] shadow-lg shadow-black/20 dark:shadow-white/20"></div>
        </div>
        {/* Markers */}
        <div className="absolute top-0 left-[70%] -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-20 bg-gray-300 dark:bg-white/10 border-dashed"></div>
          <span className="text-[10px] font-bold text-gray-400 mt-2 bg-white dark:bg-[#1C1C1E] px-2 py-1 rounded border border-gray-100 dark:border-white/10">3.0</span>
        </div>
      </div>
      
      <div className="relative pt-2">
        <div className="flex justify-between text-xs font-bold mb-4 uppercase tracking-widest">
          <span className="text-gray-500 dark:text-gray-400">Senior Year Entry</span>
          <span className="text-black dark:text-white bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-lg">~3.4+</span>
        </div>
        <div className="h-6 bg-gray-100 dark:bg-[#2C2C2E] rounded-full overflow-hidden">
          <div className="h-full bg-gray-600 dark:bg-gray-400 w-[80%] animate-[growWidth_1.5s_ease-out_0.2s_both]"></div>
        </div>
      </div>
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
      title: "The Survival Guide",
      subtitle: "Your interactive journey from DSE to University."
    },
    sections: [
      {
        id: "0",
        title: "Before Results",
        visual: (
          <div className="space-y-6">
            <div className="p-8 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-500/5">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">The Goal: Full Cert</h4>
              <div className="flex gap-4 justify-center">
                <FlipNumber value={3} />
                <FlipNumber value={3} />
                <FlipNumber value={2} />
                <FlipNumber value={2} />
              </div>
              <div className="flex justify-center gap-8 mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <span>Chi</span><span>Eng</span><span>Math</span><span>LS</span>
              </div>
            </div>
            <div className="p-1">
              <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">Missed it? Two paths:</p>
              <RetakeAssoSplit />
            </div>
          </div>
        ),
        details: "Hong Kong universities usually require a 'full cert' (3322). If you miss this, you can Retake or go the Associate Degree route (Non-JUPAS)."
      },
      {
        id: "1",
        title: "DSE Release Day",
        visual: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle size={28} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Score &lt; 3322</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Retake DSE</p>
              <div className="mt-6 text-[10px] font-bold text-gray-900 bg-gray-100 dark:bg-white/10 dark:text-white px-3 py-1.5 rounded-full inline-block uppercase tracking-wider">Exam Focus</div>
            </div>
            <div className="p-6 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Score &ge; 3322</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Associate Degree</p>
              <div className="mt-6 text-[10px] font-bold text-zinc-900 bg-zinc-100 dark:bg-white/10 dark:text-white px-3 py-1.5 rounded-full inline-block uppercase tracking-wider">New Start</div>
            </div>
          </div>
        ),
        details: "Don't mix paths. 'Retake + Asso' is usually a bad idea. Choose one and go all in. If you choose Asso, you are playing a new game with new rules."
      },
      {
        id: "2",
        title: "Choosing Programme",
        visual: <TabbedSelector />,
        details: "Asso (Academic) vs HD (Vocational). Choose based on what you are good at (look at DSE electives), what you like, and where you want to go."
      },
      {
        id: "3",
        title: "Pre-Semester Prep",
        visual: (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-500/5">
            <ChecklistWithProgress items={[
              "Adjust Mindset: It's not easier than Uni",
              "Plan IELTS (Aug or Dec)",
              "Check IGCSE schedules"
            ]} />
          </div>
        ),
        details: "Use the summer to get language requirements out of the way. IELTS is crucial if your DSE English is Level 2 or 3."
      },
      {
        id: "4",
        title: "GPA System",
        visual: <GPASimulator />,
        details: "Many colleges use 4.3 internally but cap at 4.0. Every decimal point counts. Read course outlines immediately."
      },
      {
        id: "5",
        title: "People & Groups",
        visual: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CharacterCard3D
              title="The Serious One"
              desc="Sits in front. Asks questions. Your target groupmate."
              icon={CheckCircle2}
              type="good"
            />
            <CharacterCard3D
              title="The Freerider"
              desc="Disappears. 'Ghost'. Document everything if you meet one."
              icon={XCircle}
              type="bad"
            />
          </div>
        ),
        details: "Group projects are dangerous. Find the serious people early. If you find a freerider, document evidence and report early."
      },
      {
        id: "6",
        title: "Study Method",
        visual: <FeynmanTimer />,
        details: "The Feynman Technique: If you can't explain it simply to a classmate, you don't understand it. Teaching is the best way to learn."
      },
      {
        id: "10",
        title: "GPA Targets",
        visual: <TargetBars />,
        details: "Year 1 entry is brutal (near perfect GPA). Senior Year (Year 3 entry) is the standard path, requiring around 3.4-3.7 depending on the programme."
      },
      {
        id: "11",
        title: "Offers & Deadlines",
        visual: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LockCard type="direct" title="Direct Offer" subtitle="Pay & Secure" />
            <LockCard type="conditional" title="Conditional" subtitle="Meet GPA req." />
          </div>
        ),
        details: "Direct offers are safe. Conditional offers require you to maintain your GPA. Deposits are non-refundable, usually."
      }
    ]
  },
  ZH: {
    hero: {
      title: "副學士生存指南",
      subtitle: "從 DSE 放榜到入讀大學的互動旅程。"
    },
    sections: [
      {
        id: "0",
        title: "放榜前：了解遊戲規則",
        visual: (
          <div className="space-y-6">
            <div className="p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-xl shadow-gray-500/5">
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">目標：Full Cert</h4>
              <div className="flex gap-4 justify-center">
                <FlipNumber value={3} />
                <FlipNumber value={3} />
                <FlipNumber value={2} />
                <FlipNumber value={2} />
              </div>
              <div className="flex justify-center gap-8 mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                <span>中</span><span>英</span><span>數</span><span>通</span>
              </div>
            </div>
            <div className="p-1">
              <p className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">未達標？兩條路：</p>
              <RetakeAssoSplit />
            </div>
          </div>
        ),
        details: "大學通常要求「Full Cert」(3322)。如果未達標，你可以選擇 Retake 或修讀副學士 (Non-JUPAS)。"
      },
      {
        id: "1",
        title: "DSE 放榜日",
        visual: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle size={28} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">分數 &lt; 3322</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Retake DSE</p>
              <div className="mt-6 text-[10px] font-bold text-gray-900 bg-gray-100 dark:bg-white/10 dark:text-white px-3 py-1.5 rounded-full inline-block uppercase tracking-wider">專注考試</div>
            </div>
            <div className="p-6 bg-white dark:bg-[#1C1C1E] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">分數 &ge; 3322</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">副學士 Asso</p>
              <div className="mt-6 text-[10px] font-bold text-zinc-900 bg-zinc-100 dark:bg-white/10 dark:text-white px-3 py-1.5 rounded-full inline-block uppercase tracking-wider">全新環境</div>
            </div>
          </div>
        ),
        details: "不要「Retake + Asso 雙修」，通常兩頭唔到岸。揀定一條路去盡。Asso 係一個全新嘅遊戲。"
      },
      {
        id: "2",
        title: "揀科策略",
        visual: <TabbedSelector />,
        details: "Asso (學術) vs HD (職業)。根據你擅長嘅科目 (睇 DSE 選修)、興趣同埋想入嘅大學學系去揀。"
      },
      {
        id: "3",
        title: "開學前準備",
        visual: (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-500/5">
            <ChecklistWithProgress items={[
              "調整心態：Asso 唔係 Hea 讀",
              "報考 IELTS (8月或12月)",
              "檢查 IGCSE 時間表"
            ]} />
          </div>
        ),
        details: "利用暑假搞掂語文要求。如果 DSE 英文得 Level 2 或 3，IELTS 係必須嘅。"
      },
      {
        id: "4",
        title: "GPA 制度",
        visual: <GPASimulator />,
        details: "好多院校內部計 4.3，但成績表 Cap 4.0。每一個小數點都好重要。即刻睇 Course Outline。"
      },
      {
        id: "5",
        title: "人際與組員",
        visual: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CharacterCard3D
              title="認真型同學"
              desc="坐前排，會發問。你嘅目標組員。"
              icon={CheckCircle2}
              type="good"
            />
            <CharacterCard3D
              title="Freerider"
              desc="消失、潛水。遇到要留證據，儘早匯報。"
              icon={XCircle}
              type="bad"
            />
          </div>
        ),
        details: "Group Project 係高危區。儘早搵認真嘅同學。遇到 Freerider 要留證據保障自己。"
      },
      {
        id: "6",
        title: "讀書方法",
        visual: <FeynmanTimer />,
        details: "Feynman 技巧：如果你唔能夠簡單咁解釋俾同學聽，即係你未識。教人係最好嘅學習方法。"
      },
      {
        id: "10",
        title: "GPA 目標",
        visual: <TargetBars />,
        details: "Year 1 入學極難 (接近滿分)。Senior Year (Year 3 入學) 係主流，通常需要 3.4-3.7，視乎學科。"
      },
      {
        id: "11",
        title: "Offer 種類",
        visual: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <LockCard type="direct" title="Direct Offer" subtitle="交錢留位" />
            <LockCard type="conditional" title="Conditional" subtitle="要過 GPA" />
          </div>
        ),
        details: "Direct Offer 最穩陣。Conditional Offer 要你 Keep 到 GPA。留位費通常無得退。"
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
              <div className="pl-8 space-y-8">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Timeline</div>
                {t.sections.map((section, index) => (
                  <a 
                    key={section.id} 
                    href={`#section-${section.id}`}
                    className="group flex items-center gap-4 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span className="text-[10px] font-mono opacity-30 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{section.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="md:col-span-9 space-y-40">
            {t.sections.map((section, index) => (
              <div key={section.id} id={`section-${section.id}`} className="scroll-mt-32">
                <FadeInSection delay={100}>
                  <div className="flex items-center gap-6 mb-10">
                    <div className="flex items-center justify-center w-16 h-16 rounded-[2rem] bg-white dark:bg-white/5 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/10 text-2xl font-bold text-gray-400 dark:text-gray-600">
                      {index + 1}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>
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
              ? "\"You give yourself a real chance to reach your target degree.\"" 
              : "「給自己一個真正達成大學夢的機會。」"}
          </p>
        </div>
      </div>
    </div>
  );
}

