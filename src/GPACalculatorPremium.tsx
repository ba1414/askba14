import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, RotateCcw, Trash2, Copy, Settings2, Target } from "lucide-react";
import { saveData, loadData } from "./db";
import { AppleEmoji } from "./components/AppleEmoji";
import { DataTable, GradeBadge, EmptyState } from "./components/premium";
import GradePrediction from "./GradePrediction";

/**
 * Premium GPA Calculator
 * Apple-quality design with data table, insight panel, and full state coverage
 */

const TRANSLATIONS = {
  EN: {
    title: "GPA Calculator",
    subtitle: "Plan your semester, track progress, and set goals.",
    scale: "Scale",
    
    // Tabs
    tab_tgpa: "This Semester",
    tab_cgpa: "Cumulative",
    tab_target: "Goal Tracker",
    tab_prediction: "Prediction",

    // Table
    courseName: "Course Name",
    grade: "Grade",
    credits: "Credits",
    gradePoints: "Points",
    actions: "Actions",
    addCourse: "Add Course",
    
    // CGPA Inputs
    currentCGPA: "Current CGPA",
    completedCredits: "Completed Credits",
    targetCGPA: "Target CGPA",
    nextCredits: "Next Semester Credits",

    // Empty State
    emptyTitle: "No courses yet",
    emptyDesc: "Add your courses to start calculating your GPA. We'll help you track your progress.",
    addFirst: "Add First Course",
    loadSample: "Load Sample Data",

    // Actions
    reset: "Reset All",
  },
  粵: {
    title: "GPA 計算器",
    subtitle: "規劃本學期，追蹤進度，設定目標。",
    scale: "學制",
    
    // Tabs
    tab_tgpa: "本學期 TGPA",
    tab_cgpa: "累積 CGPA",
    tab_target: "目標追分",
    tab_prediction: "成績預測",

    // Table
    courseName: "課程名稱",
    grade: "成績",
    credits: "學分",
    gradePoints: "等級點",
    actions: "操作",
    addCourse: "新增課程",
    
    // CGPA Inputs
    currentCGPA: "現時 CGPA",
    completedCredits: "已修學分",
    targetCGPA: "目標 CGPA",
    nextCredits: "下學期學分",

    // Empty State
    emptyTitle: "未有課程",
    emptyDesc: "新增課程以開始計算 GPA，我們會幫你追蹤進度。",
    addFirst: "新增第一門課",
    loadSample: "載入示範數據",

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

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

function TabButton({ active, onClick, label, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-4 py-2 flex items-center gap-2 text-sm font-medium transition-all rounded-full
        ${active 
          ? 'bg-[var(--color-text-primary)] text-[var(--color-bg-page)] shadow-md' 
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]'}
      `}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

function TargetCalculator({ lang, scale }: { lang: string, scale: string }) {
  const [desiredCGPA, setDesiredCGPA] = useState("");
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedCredits, setCompletedCredits] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const target = parseFloat(desiredCGPA);
    const current = parseFloat(currentCGPA);
    const completed = parseFloat(completedCredits);
    const remaining = parseFloat(remainingCredits);

    if (!isNaN(target) && !isNaN(current) && !isNaN(completed) && !isNaN(remaining) && remaining > 0) {
      // Formula: (Target * (Completed + Remaining) - (Current * Completed)) / Remaining
      const totalRequiredPoints = target * (completed + remaining);
      const currentPoints = current * completed;
      const neededPoints = totalRequiredPoints - currentPoints;
      const requiredGPA = neededPoints / remaining;
      setResult(requiredGPA);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[var(--color-bg-elevated)] rounded-2xl p-8 border border-[var(--color-border-primary)] shadow-sm">
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        {lang === 'EN' ? 'Target GPA Calculator' : '目標 GPA 計算機'}
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[var(--color-text-secondary)]">
            {lang === 'EN' ? 'Desired Cumulative GPA' : '目標累積 GPA'}
          </label>
          <input
            type="number"
            value={desiredCGPA}
            onChange={(e) => setDesiredCGPA(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border-none text-[var(--color-text-primary)] font-mono font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="4.00"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[var(--color-text-secondary)]">
            {lang === 'EN' ? 'Current Cumulative GPA' : '現時累積 GPA'}
          </label>
          <input
            type="number"
            value={currentCGPA}
            onChange={(e) => setCurrentCGPA(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border-none text-[var(--color-text-primary)] font-mono font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="3.50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[var(--color-text-secondary)]">
            {lang === 'EN' ? 'Completed Credits' : '已修學分'}
          </label>
          <input
            type="number"
            value={completedCredits}
            onChange={(e) => setCompletedCredits(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border-none text-[var(--color-text-primary)] font-mono font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="60"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[var(--color-text-secondary)]">
            {lang === 'EN' ? 'Remaining Credits' : '剩餘學分'}
          </label>
          <input
            type="number"
            value={remainingCredits}
            onChange={(e) => setRemainingCredits(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border-none text-[var(--color-text-primary)] font-mono font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            placeholder="15"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full py-4 rounded-xl bg-[#1D1D1F] dark:bg-white text-white dark:text-black font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {lang === 'EN' ? 'Calculate' : '計算'}
        </button>

        {result !== null && (
          <div className="mt-8 p-6 bg-[var(--color-surface-secondary)] rounded-xl text-center animate-fade-in-up">
            <p className="text-sm text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wider font-bold">
              {lang === 'EN' ? 'You need to average' : '你需要平均考獲'}
            </p>
            <div className={`text-5xl font-black tracking-tight mb-2 ${result > parseFloat(scale) ? 'text-red-500' : 'text-green-500'}`}>
              {result.toFixed(2)}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {result > parseFloat(scale) 
                ? (lang === 'EN' ? 'Impossible with current scale' : '超出學制上限') 
                : (lang === 'EN' ? 'for your remaining credits' : '於剩餘學分')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GPACalculatorPremium({ lang = "EN" }: { lang?: string }) {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS.EN;
  
  // State
  const [scale, setScale] = useState<GPAScale>("4.3");
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedCredits, setCompletedCredits] = useState("");
  const [targetCGPA, setTargetCGPA] = useState("");
  const [nextCredits, setNextCredits] = useState("");
  const [activeTab, setActiveTab] = useState<'tgpa' | 'cgpa' | 'target' | 'prediction'>('tgpa');
  const [isLoaded, setIsLoaded] = useState(false);

  // Derived values
  const grades = scale === "4.0" ? GRADES_4_0 : GRADES_4_3;
  const gradeValues = scale === "4.0" ? GRADE_VALUES_4_0 : GRADE_VALUES_4_3;
  const maxGPA = scale === "4.0" ? 4.0 : 4.3;

  // Load data
  useEffect(() => {
    const load = async () => {
      const data = await loadData();
      if (data) {
        if (data.scale) setScale(data.scale as GPAScale);
        
        // If courses exist, load them. If not, initialize with 5 empty rows for "Fast Shortcut"
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          const initialCourses = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now().toString() + i,
            name: "",
            grade: "B",
            credits: 3,
          }));
          setCourses(initialCourses);
        }

        if (data.currentCGPA) setCurrentCGPA(data.currentCGPA);
        if (data.completedCredits) setCompletedCredits(data.completedCredits);
        if (data.targetCGPA) setTargetCGPA(data.targetCGPA);
        if (data.nextCredits) setNextCredits(data.nextCredits);
      } else {
        // No data found, initialize with 5 empty rows
        const initialCourses = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now().toString() + i,
            name: "",
            grade: "B",
            credits: 3,
        }));
        setCourses(initialCourses);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) {
      saveData({
        scale,
        courses,
        currentCGPA,
        completedCredits,
        targetCGPA,
        nextCredits,
      });
    }
  }, [scale, courses, currentCGPA, completedCredits, targetCGPA, nextCredits, isLoaded]);

  // Calculations
  const thisSemCredits = useMemo(() => 
    courses.reduce((sum, c) => sum + (c.credits || 0), 0),
  [courses]);

  const thisSemPoints = useMemo(() => 
    courses.reduce((sum, c) => {
      const points = gradeValues[c.grade];
      return sum + (points !== undefined ? points * c.credits : 0);
    }, 0),
  [courses, gradeValues]);

  const thisSemGPA = useMemo(() => 
    thisSemCredits > 0 ? thisSemPoints / thisSemCredits : 0.0,
  [thisSemPoints, thisSemCredits]);

  const projectedCGPA = useMemo(() => {
    const currGPA = parseFloat(currentCGPA);
    const currCreds = parseFloat(completedCredits);
    
    if (!isNaN(currGPA) && !isNaN(currCreds) && currCreds + thisSemCredits > 0) {
      const totalPoints = (currGPA * currCreds) + thisSemPoints;
      return totalPoints / (currCreds + thisSemCredits);
    }
    return null;
  }, [currentCGPA, completedCredits, thisSemPoints, thisSemCredits]);

  const requiredGPA = useMemo(() => {
    const target = parseFloat(targetCGPA);
    const currGPA = parseFloat(currentCGPA);
    const currCreds = parseFloat(completedCredits);
    const nextCreds = parseFloat(nextCredits) || thisSemCredits; // Use this sem credits if next not specified

    if (!isNaN(target) && !isNaN(currGPA) && !isNaN(currCreds) && nextCreds > 0) {
      // Formula: (Target * (CurrCreds + NextCreds) - (CurrGPA * CurrCreds)) / NextCreds
      const totalRequiredPoints = target * (currCreds + nextCreds);
      const currentPoints = currGPA * currCreds;
      const neededPoints = totalRequiredPoints - currentPoints;
      return neededPoints / nextCreds;
    }
    return null;
  }, [targetCGPA, currentCGPA, completedCredits, nextCredits, thisSemCredits]);

  // Actions
  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: "",
      grade: "B",
      credits: 3,
    };
    setCourses([...courses, newCourse]);
  };

  const addMultipleCourses = (count: number) => {
    const newCourses = Array.from({ length: count }).map((_, i) => ({
      id: Date.now().toString() + i,
      name: "",
      grade: "B",
      credits: 3,
    }));
    setCourses([...courses, ...newCourses]);
  };

  const updateCourse = (id: string, key: string, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const duplicateCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setCourses([...courses, { ...course, id: Date.now().toString() }]);
    }
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      // Reset to 5 empty rows for quick start
      const initialCourses = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now().toString() + i,
        name: "",
        grade: "B",
        credits: 3,
      }));
      setCourses(initialCourses);
      setCurrentCGPA("");
      setCompletedCredits("");
      setTargetCGPA("");
      setNextCredits("");
    }
  };

  const loadSampleData = () => {
    setCourses([
      { id: "1", name: "Introduction to CS", grade: "A", credits: 3 },
      { id: "2", name: "Calculus I", grade: "B+", credits: 3 },
      { id: "3", name: "English Communication", grade: "A-", credits: 3 },
      { id: "4", name: "Physics", grade: "B", credits: 3 },
    ]);
  };

  // Table Columns
  const tableColumns = useMemo(() => [
    {
      key: 'name',
      header: t.courseName,
      width: '40%',
      editable: true,
      type: 'text' as const,
    },
    {
      key: 'grade',
      header: t.grade,
      width: '20%',
      align: 'center' as const,
      editable: true,
      type: 'select' as const,
      options: grades.map(g => ({ value: g, label: g })),
      render: (value: string) => <GradeBadge grade={value} />,
    },
    {
      key: 'credits',
      header: t.credits,
      width: '15%',
      align: 'center' as const,
      editable: true,
      type: 'number' as const,
      validate: (value: any) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0 || num > 10) return lang === 'EN' ? '0-10 credits' : '0-10 學分';
        return null;
      },
    },
    {
      key: 'gradePoints',
      header: t.gradePoints,
      width: '15%',
      align: 'center' as const,
      render: (_: any, row: Course) => {
        if (!row.grade || gradeValues[row.grade] === undefined) {
          return <span className="text-[#86868B]">—</span>;
        }
        return (
          <span className="font-mono text-sm text-[#1D1D1F]">
            {(gradeValues[row.grade] * row.credits).toFixed(1)}
          </span>
        );
      },
    },
  ], [t, grades, gradeValues, lang]);

  // --- Donut Chart Component ---
  const DonutChart = ({ value, max, size = 120 }: { value: number, max: number, size?: number }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    
    useEffect(() => {
      // Small delay to ensure transition plays
      const timer = setTimeout(() => setAnimatedValue(value), 100);
      return () => clearTimeout(timer);
    }, [value]);

    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(animatedValue / max, 0), 1);
    const strokeDashoffset = circumference - progress * circumference;
    
    let color = '#34C759'; // Green
    if (value < 2.0) color = '#FF3B30'; // Red
    else if (value < 3.0) color = '#FF9500'; // Orange
    else if (value < 3.7) color = '#007AFF'; // Blue

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-[var(--color-surface-tertiary)]"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-bold text-[var(--color-text-secondary)]">
            {((animatedValue / max) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    );
  };

  const [showPrevious, setShowPrevious] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">{t.title}</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Scale Toggle */}
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-primary)]">
            <span className="text-xs font-bold text-[var(--color-text-tertiary)] px-2 uppercase tracking-wider">{t.scale}</span>
            <button
              onClick={() => setScale("4.0")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                scale === "4.0" 
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm" 
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              4.0
            </button>
            <button
              onClick={() => setScale("4.3")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                scale === "4.3" 
                  ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm" 
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              4.3
            </button>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={resetAll}
            className="p-3 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-secondary)] hover:text-red-500 transition-colors"
            title={t.reset}
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <TabButton
          active={activeTab === 'tgpa'}
          onClick={() => setActiveTab('tgpa')}
          label={t.tab_tgpa} // "Dashboard" effectively
          icon="📊"
        />
        <TabButton
          active={activeTab === 'target'}
          onClick={() => setActiveTab('target')}
          label={t.tab_target}
          icon="🎯"
        />
        <TabButton
          active={activeTab === 'prediction'}
          onClick={() => setActiveTab('prediction')}
          label={t.tab_prediction}
          icon="🔮"
        />
      </div>

      {/* Content */}
      <div className="animate-fade-in-up">
        {activeTab === 'prediction' ? (
          <GradePrediction lang={lang} scale={scale} />
        ) : activeTab === 'target' ? (
          <TargetCalculator lang={lang} scale={scale} />
        ) : (
          <>
            {/* Summary Header Card */}
            <div className="bg-[var(--color-bg-elevated)] rounded-[24px] p-8 mb-6 shadow-sm border border-[var(--color-border-primary)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="flex-1 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    {projectedCGPA !== null ? (lang === 'EN' ? 'Cumulative GPA' : '累積 CGPA') : (lang === 'EN' ? 'Current GPA' : '現時 GPA')}
                  </div>
                  {projectedCGPA !== null && (
                    <span className="px-2 py-0.5 rounded-md bg-[var(--color-surface-secondary)] text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">
                      Projected
                    </span>
                  )}
                </div>
                
                <div className="text-7xl font-black tracking-tighter text-[var(--color-text-primary)] mb-4">
                  {(projectedCGPA !== null ? projectedCGPA : thisSemGPA).toFixed(2)}
                  <span className="text-2xl text-[var(--color-text-tertiary)] font-medium ml-2">/ {scale}</span>
                </div>
                
                {/* Target Goal Input (Subtle) */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[var(--color-surface-secondary)] px-3 py-1.5 rounded-lg">
                    <Target size={14} className="text-[var(--color-text-quaternary)]" />
                    <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">{t.targetCGPA}:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={targetCGPA}
                      onChange={(e) => setTargetCGPA(e.target.value)}
                      placeholder="4.00"
                      className="w-12 bg-transparent border-none p-0 text-sm font-bold text-[var(--color-text-primary)] focus:ring-0"
                    />
                  </div>
                  {requiredGPA !== null && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      requiredGPA > maxGPA ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {lang === 'EN' ? 'Need' : '需達'} {requiredGPA.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex-shrink-0 z-10">
                <DonutChart value={projectedCGPA !== null ? projectedCGPA : thisSemGPA} max={maxGPA} />
              </div>
            </div>

            {/* Previous Semesters Shortcut */}
            <div className="mb-6">
              <button 
                onClick={() => setShowPrevious(!showPrevious)}
                className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-3"
              >
                <Settings2 size={16} />
                {showPrevious ? (lang === 'EN' ? 'Hide Previous Semesters' : '隱藏過往學期') : (lang === 'EN' ? 'Add Previous Semesters' : '加入過往學期數據')}
              </button>
              
              {showPrevious && (
                <div className="bg-[var(--color-bg-elevated)] rounded-xl p-6 border border-[var(--color-border-primary)] animate-fade-in-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                        {t.currentCGPA} (Before this sem)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentCGPA}
                        onChange={(e) => setCurrentCGPA(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border-none text-[var(--color-text-primary)] placeholder-[var(--color-text-quaternary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                        {t.completedCredits}
                      </label>
                      <input
                        type="number"
                        value={completedCredits}
                        onChange={(e) => setCompletedCredits(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border-none text-[var(--color-text-primary)] placeholder-[var(--color-text-quaternary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {/* Main Table */}
              <div className="space-y-6">
                {courses.length === 0 ? (
                  <EmptyState
                    title={t.emptyTitle}
                    description={t.emptyDesc}
                    primaryAction={{
                      label: t.addFirst,
                      onClick: () => addMultipleCourses(5)
                    }}
                    secondaryAction={{
                      label: t.loadSample,
                      onClick: loadSampleData
                    }}
                  />
                ) : (
                  <>
                    <DataTable
                      columns={tableColumns}
                      data={courses}
                      onUpdate={updateCourse}
                      onDelete={deleteCourse}
                      onDuplicate={duplicateCourse}
                    />
                    
                    {/* Add Course Button (Floating/Large) */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={addCourse}
                        className="w-full h-14 bg-[#1D1D1F] dark:bg-white text-white dark:text-black rounded-full font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={24} />
                        {t.addCourse}
                      </button>
                      
                      <button
                        onClick={() => addMultipleCourses(5)}
                        className="text-sm font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors py-2"
                      >
                        + {lang === 'EN' ? 'Quick Add 5 Rows' : '快速新增 5 行'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
