import React, { useState, useEffect, useMemo } from "react";
import { saveData, loadData } from "./db";
import { AppleEmoji } from "./components/AppleEmoji";

const TRANSLATIONS = {
  EN: {
    title: "GPA Calculator",
    subtitle: "Plan your semester, track progress, and set goals.",
    scale: "Scale",
    
    // Tabs
    tab_tgpa: "This Sem (TGPA)",
    tab_cgpa: "Cumulative (CGPA)",
    tab_target: "Goal / Target",

    // TGPA Section
    tgpa_title: "This Semester",
    addCourse: "Add Course",
    courseName: "Course Name",
    grade: "Grade",
    credits: "Credits",
    semResult: "Semester GPA",
    semCredits: "Sem Credits",
    noCourses: "No courses added",
    startAdding: "Add courses to calculate TGPA",

    // CGPA Section
    cgpa_title: "My Progress",
    currentCGPA: "Current cGPA",
    completedCredits: "Completed Credits",
    projectedCGPA: "Projected cGPA",
    projected_desc: "After this semester",

    // Target Section
    target_title: "Goal Setting",
    targetCGPA: "Target cGPA",
    nextCredits: "Next Sem Credits",
    neededGPA: "Required Next Sem GPA",
    
    // Feasibility
    feat_easy: "Reasonable ✅",
    feat_medium: "Ambitious 🔥",
    feat_hard: "High Risk ⚠️",
    feat_impossible: "Impossible 🤯",
    
    // Actions
    reset: "Reset",
  },
  粵: {
    title: "GPA 計算機",
    subtitle: "規劃本學期，追蹤進度，設定目標。",
    scale: "學制",
    
    // Tabs
    tab_tgpa: "本學期 TGPA",
    tab_cgpa: "累積 CGPA",
    tab_target: "目標 / 追分",

    // TGPA Section
    tgpa_title: "本學期規劃",
    addCourse: "新增課程",
    courseName: "課程名稱",
    grade: "成績",
    credits: "學分",
    semResult: "本學期 GPA",
    semCredits: "本學期學分",
    noCourses: "未有課程",
    startAdding: "新增課程以計算 TGPA",

    // CGPA Section
    cgpa_title: "累積進度",
    currentCGPA: "現時 cGPA",
    completedCredits: "已修學分",
    projectedCGPA: "預計 cGPA",
    projected_desc: "完成本學期後",

    // Target Section
    target_title: "目標 / 追分",
    targetCGPA: "目標 cGPA",
    nextCredits: "下學期學分",
    neededGPA: "下學期需達",
    
    // Feasibility
    feat_easy: "合理 ✅",
    feat_medium: "偏進取 🔥",
    feat_hard: "高風險 ⚠️",
    feat_impossible: "不可能 🤯",
    
    // Actions
    reset: "重置",
  },
};

type GPAScale = "4.0" | "4.3";

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GRADES_4_0 = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
const GRADES_4_3 = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

const GRADE_VALUES_4_0: Record<string, number> = {
  "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0,
};

const GRADE_VALUES_4_3: Record<string, number> = {
  "A+": 4.3, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7, "D": 1.0, "F": 0.0,
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative overflow-hidden bg-[var(--surface)]/80 backdrop-blur-xl border border-[var(--border-subtle)] shadow-xl shadow-black/5 rounded-[2rem] ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--text)]/5 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

// Visual Components
const GradeBadge = ({ grade }: { grade: string }) => {
  if (!grade) return <span className="text-[var(--text-muted)]">-</span>;
  
  let color = "bg-gray-100 text-gray-600";
  if (grade.startsWith("A")) color = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  else if (grade.startsWith("B")) color = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  else if (grade.startsWith("C")) color = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  else if (grade === "D" || grade === "F") color = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span className={`px-2.5 py-1 rounded-lg text-sm font-bold ${color}`}>
      {grade}
    </span>
  );
};

const FeasibilityGauge = ({ value, max }: { value: number | null, max: number }) => {
  if (value === null) return null;
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  let color = "text-green-500";
  if (value > max) color = "text-red-500";
  else if (value > max - 0.3) color = "text-orange-500";
  else if (value > max - 0.7) color = "text-yellow-500";

  return (
    <div className="relative w-full h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden mt-2">
      <div 
        className={`h-full transition-all duration-500 ease-out ${value > max ? 'bg-red-500' : 'bg-[var(--primary)]'}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
        active
          ? "bg-[var(--primary)] text-[var(--bg)] shadow-md scale-[1.02]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
      }`}
    >
      {label}
    </button>
  );
}

interface SavedInputs {
  currentCGPA?: string;
  completedCredits?: string;
  targetCGPA?: string;
  nextCredits?: string;
}

export default function GPACalculatorNew({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'tgpa' | 'cgpa' | 'target'>('tgpa');
  const [scale, setScale] = useState<GPAScale>("4.0");
  
  // Inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedCredits, setCompletedCredits] = useState("");
  const [targetCGPA, setTargetCGPA] = useState("");
  const [nextCredits, setNextCredits] = useState("");

  const [courses, setCourses] = useState<Course[]>(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `course-${Date.now()}-${i}`,
      name: "",
      grade: "",
      credits: 3
    }));
  });

  useEffect(() => {
    (async () => {
      const savedCourses = await loadData('gpa', 'courses', []);
      if (savedCourses.length > 0) setCourses(savedCourses);
      
      const savedScale = await loadData('gpa', 'scale', '4.0');
      setScale(savedScale as GPAScale);

      const savedInputs = await loadData('gpa', 'inputs', {}) as SavedInputs;
      if (savedInputs.currentCGPA) setCurrentCGPA(savedInputs.currentCGPA);
      if (savedInputs.completedCredits) setCompletedCredits(savedInputs.completedCredits);
      if (savedInputs.targetCGPA) setTargetCGPA(savedInputs.targetCGPA);
      if (savedInputs.nextCredits) setNextCredits(savedInputs.nextCredits);

      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData('gpa', 'courses', courses);
      saveData('gpa', 'scale', scale);
      saveData('gpa', 'inputs', { currentCGPA, completedCredits, targetCGPA, nextCredits });
    }
  }, [courses, scale, currentCGPA, completedCredits, targetCGPA, nextCredits, isLoaded]);

  // --- Calculations ---

  const maxGPA = scale === "4.3" ? 4.3 : 4.0;
  const gradeValues = scale === "4.0" ? GRADE_VALUES_4_0 : GRADE_VALUES_4_3;
  const grades = scale === "4.0" ? GRADES_4_0 : GRADES_4_3;

  // 1. TGPA (This Semester)
  const { thisSemGPA, thisSemCredits } = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      if (c.grade && gradeValues[c.grade] !== undefined) {
        totalPoints += gradeValues[c.grade] * c.credits;
        totalCredits += c.credits;
      }
    });
    return {
      thisSemGPA: totalCredits > 0 ? totalPoints / totalCredits : 0,
      thisSemCredits: totalCredits
    };
  }, [courses, gradeValues]);

  // 2. Projected CGPA
  const projectedCGPA = useMemo(() => {
    const c_gpa = parseFloat(currentCGPA);
    const c_credits = parseFloat(completedCredits);
    
    if (isNaN(c_gpa) || isNaN(c_credits)) return null;
    
    const currentPoints = c_gpa * c_credits;
    const newPoints = currentPoints + (thisSemGPA * thisSemCredits);
    const newTotalCredits = c_credits + thisSemCredits;
    
    return newTotalCredits > 0 ? newPoints / newTotalCredits : 0;
  }, [currentCGPA, completedCredits, thisSemGPA, thisSemCredits]);

  // 3. Target / Required GPA
  const requiredGPA = useMemo(() => {
    const c_gpa = parseFloat(currentCGPA);
    const c_credits = parseFloat(completedCredits);
    const t_gpa = parseFloat(targetCGPA);
    const n_credits = parseFloat(nextCredits);

    if (isNaN(c_gpa) || isNaN(c_credits) || isNaN(t_gpa) || isNaN(n_credits) || n_credits <= 0) {
      return null;
    }

    const totalCredits = c_credits + n_credits;
    const totalPointsNeeded = t_gpa * totalCredits;
    const currentPoints = c_gpa * c_credits;
    const neededPoints = totalPointsNeeded - currentPoints;
    const result = neededPoints / n_credits;

    return result;
  }, [currentCGPA, completedCredits, targetCGPA, nextCredits]);

  const feasibility = useMemo(() => {
    if (requiredGPA === null) return null;
    if (requiredGPA > maxGPA) return { label: t.feat_impossible, color: "text-red-500", bg: "bg-red-500/10" };
    if (requiredGPA > (maxGPA - 0.3)) return { label: t.feat_hard, color: "text-orange-500", bg: "bg-orange-500/10" };
    if (requiredGPA > (maxGPA - 0.7)) return { label: t.feat_medium, color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { label: t.feat_easy, color: "text-green-500", bg: "bg-green-500/10" };
  }, [requiredGPA, maxGPA, t]);

  // --- Handlers ---

  const addCourse = () => {
    setCourses([...courses, { id: `course-${Date.now()}`, name: "", grade: "", credits: 3 }]);
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // --- Renderers ---

  const renderCourseTable = () => (
    <GlassCard className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AppleEmoji emoji="📝" /> {t.tgpa_title}
        </h2>
        <div className="text-right">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">{t.semResult}</div>
          <div className="text-4xl font-black text-[var(--primary)] font-mono tracking-tight">
            {thisSemGPA.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {courses.map((course, index) => (
          <div key={course.id} className="group flex items-center gap-3 p-3 bg-[var(--bg)]/50 rounded-xl border border-[var(--border-subtle)] transition-all hover:bg-[var(--surface-hover)] focus-within:border-[var(--primary)] focus-within:ring-1 focus-within:ring-[var(--primary)]">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder={t.courseName}
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm font-medium placeholder-[var(--text-muted)] focus:ring-0"
              />
            </div>
            
            <div className="w-24 relative">
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                className="w-full bg-[var(--surface)] border-none rounded-lg text-sm font-bold pl-2 pr-6 py-1.5 focus:ring-0 cursor-pointer appearance-none"
              >
                <option value="">-</option>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <GradeBadge grade={course.grade} />
              </div>
            </div>

            <div className="w-16">
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, "credits", parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent border-none p-0 text-sm text-center font-mono focus:ring-0"
              />
            </div>

            <button 
              onClick={() => removeCourse(course.id)}
              className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addCourse}
        className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all flex items-center justify-center gap-2"
      >
        <span>+</span> {t.addCourse}
      </button>
    </GlassCard>
  );

  const renderCGPASummary = () => (
    <GlassCard className="p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <AppleEmoji emoji="📊" /> {t.cgpa_title}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--text-muted)]">{t.currentCGPA}</label>
          <input
            type="number"
            value={currentCGPA}
            onChange={(e) => setCurrentCGPA(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[var(--bg)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 font-mono text-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--text-muted)]">{t.completedCredits}</label>
          <input
            type="number"
            value={completedCredits}
            onChange={(e) => setCompletedCredits(e.target.value)}
            placeholder="0"
            className="w-full bg-[var(--bg)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 font-mono text-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
      </div>

      {projectedCGPA !== null && (
        <div className="p-4 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-xs font-bold text-[var(--primary)] mb-1">{t.projectedCGPA}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[var(--primary)] font-mono tracking-tight">
                {projectedCGPA.toFixed(2)}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                {t.projected_desc}
              </span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
             <AppleEmoji emoji="📈" className="w-24 h-24" />
          </div>
        </div>
      )}
    </GlassCard>
  );

  const renderTargetCalculator = () => (
    <GlassCard className="p-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <AppleEmoji emoji="🎯" /> {t.target_title}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--text-muted)]">{t.targetCGPA}</label>
          <input
            type="number"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(e.target.value)}
            placeholder="3.50"
            className="w-full bg-[var(--bg)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 font-mono text-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--text-muted)]">{t.nextCredits}</label>
          <input
            type="number"
            value={nextCredits}
            onChange={(e) => setNextCredits(e.target.value)}
            placeholder="15"
            className="w-full bg-[var(--bg)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 font-mono text-lg focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
      </div>

      {requiredGPA !== null && (
        <div className={`p-5 rounded-2xl border ${feasibility?.bg || 'bg-[var(--surface)]'} ${feasibility?.color || ''} border-current/20 transition-all duration-500`}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-xs font-bold opacity-80">{t.neededGPA}</div>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
              {feasibility?.label}
            </span>
          </div>
          
          <div className="text-4xl font-black font-mono tracking-tight mb-3">
            {requiredGPA.toFixed(2)}
          </div>
          
          <FeasibilityGauge value={requiredGPA} max={maxGPA} />
        </div>
      )}
    </GlassCard>
  );

  if (!isLoaded) return <div className="p-8 text-center text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">{t.title}</h1>
          <p className="text-[var(--text-muted)] font-medium">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 bg-[var(--surface)] p-1.5 rounded-xl border border-[var(--border-subtle)] self-start md:self-auto shadow-sm">
          <span className="text-xs font-bold text-[var(--text-muted)] px-2">{t.scale}</span>
          <button
            onClick={() => setScale("4.0")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scale === "4.0" ? "bg-[var(--primary)] text-[var(--bg)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            4.0
          </button>
          <button
            onClick={() => setScale("4.3")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scale === "4.3" ? "bg-[var(--primary)] text-[var(--bg)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            4.3
          </button>
        </div>
      </div>

      {/* Content - Single View Dashboard */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 min-h-[500px]">
            {renderCourseTable()}
          </div>
          <div className="space-y-6">
            {renderCGPASummary()}
            {renderTargetCalculator()}
          </div>
        </div>
      </div>
    </div>
  );
}


