import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, RotateCcw, Trash2, Copy, Settings2 } from "lucide-react";
import { saveData, loadData } from "./db";
import { AppleEmoji } from "./components/AppleEmoji";
import { DataTable, GradeBadge, InsightPanel, EmptyState, SkeletonTable, SkeletonInsightPanel } from "./components/premium";
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

const SAMPLE_COURSES: Course[] = [
  { id: "sample-1", name: "Computer Science 101", grade: "A", credits: 3 },
  { id: "sample-2", name: "Mathematics II", grade: "B+", credits: 3 },
  { id: "sample-3", name: "English Composition", grade: "A-", credits: 3 },
  { id: "sample-4", name: "Physics Lab", grade: "B", credits: 2 },
  { id: "sample-5", name: "General Education", grade: "A", credits: 3 },
];

interface SavedInputs {
  currentCGPA?: string;
  completedCredits?: string;
  targetCGPA?: string;
  nextCredits?: string;
}

// --- Tab Component ---
function TabButton({ active, onClick, label, icon }: { 
  active: boolean; 
  onClick: () => void; 
  label: string;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-3 
        text-[var(--text-body-sm)] font-medium whitespace-nowrap
        transition-all duration-[var(--duration-fast)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30
        ${active 
          ? 'text-[var(--color-primary)]' 
          : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
        }
      `}
    >
      {icon && <AppleEmoji emoji={icon} className="w-4 h-4" />}
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary)] rounded-t-full" />
      )}
    </button>
  );
}

// --- Main Component ---
export default function GPACalculatorPremium({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'tgpa' | 'cgpa' | 'target' | 'prediction'>('tgpa');
  const [scale, setScale] = useState<GPAScale>("4.0");
  
  // Inputs
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [completedCredits, setCompletedCredits] = useState("");
  const [targetCGPA, setTargetCGPA] = useState("");
  const [nextCredits, setNextCredits] = useState("");

  const [courses, setCourses] = useState<Course[]>([]);

  // Load data
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

  // Save data
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

  const projectedCGPA = useMemo(() => {
    const c_gpa = parseFloat(currentCGPA);
    const c_credits = parseFloat(completedCredits);
    if (isNaN(c_gpa) || isNaN(c_credits)) return null;
    const currentPoints = c_gpa * c_credits;
    const newPoints = currentPoints + (thisSemGPA * thisSemCredits);
    const newTotalCredits = c_credits + thisSemCredits;
    return newTotalCredits > 0 ? newPoints / newTotalCredits : 0;
  }, [currentCGPA, completedCredits, thisSemGPA, thisSemCredits]);

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
    return neededPoints / n_credits;
  }, [currentCGPA, completedCredits, targetCGPA, nextCredits]);

  // --- Handlers ---
  const addCourse = useCallback(() => {
    setCourses(prev => [...prev, { 
      id: `course-${Date.now()}`, 
      name: "", 
      grade: "", 
      credits: 3 
    }]);
  }, []);

  const updateCourse = useCallback((id: string, field: string, value: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  const duplicateCourse = useCallback((id: string) => {
    setCourses(prev => {
      const course = prev.find(c => c.id === id);
      if (!course) return prev;
      return [...prev, { ...course, id: `course-${Date.now()}` }];
    });
  }, []);

  const loadSampleData = useCallback(() => {
    setCourses(SAMPLE_COURSES.map(c => ({ ...c, id: `course-${Date.now()}-${Math.random()}` })));
  }, []);

  const resetAll = useCallback(() => {
    setCourses([]);
    setCurrentCGPA("");
    setCompletedCredits("");
    setTargetCGPA("");
    setNextCredits("");
  }, []);

  // --- Table Columns ---
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
      width: '15%',
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
          return <span className="text-[var(--color-text-quaternary)]">—</span>;
        }
        return (
          <span className="font-mono text-[var(--text-body-sm)] text-[var(--color-text-secondary)]">
            {(gradeValues[row.grade] * row.credits).toFixed(1)}
          </span>
        );
      },
    },
  ], [t, grades, gradeValues, lang]);

  // --- Loading State ---
  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="mb-8 space-y-2">
          <div className="skeleton h-10 w-64 rounded-[var(--radius-lg)]" />
          <div className="skeleton h-5 w-96 rounded-[var(--radius-md)]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonTable rows={5} />
          </div>
          <div>
            <SkeletonInsightPanel />
          </div>
        </div>
      </div>
    );
  }

  // --- Input Section for CGPA/Target ---
  const renderInputSection = () => (
    <div className="card p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-[var(--text-label)] text-[var(--color-text-tertiary)] mb-2">
            {t.currentCGPA}
          </label>
          <input
            type="number"
            step="0.01"
            value={currentCGPA}
            onChange={(e) => setCurrentCGPA(e.target.value)}
            placeholder="0.00"
            className="input-base w-full font-mono"
          />
        </div>
        <div>
          <label className="block text-[var(--text-label)] text-[var(--color-text-tertiary)] mb-2">
            {t.completedCredits}
          </label>
          <input
            type="number"
            value={completedCredits}
            onChange={(e) => setCompletedCredits(e.target.value)}
            placeholder="0"
            className="input-base w-full font-mono"
          />
        </div>
        <div>
          <label className="block text-[var(--text-label)] text-[var(--color-text-tertiary)] mb-2">
            {t.targetCGPA}
          </label>
          <input
            type="number"
            step="0.01"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(e.target.value)}
            placeholder="3.50"
            className="input-base w-full font-mono"
          />
        </div>
        <div>
          <label className="block text-[var(--text-label)] text-[var(--color-text-tertiary)] mb-2">
            {t.nextCredits}
          </label>
          <input
            type="number"
            value={nextCredits}
            onChange={(e) => setNextCredits(e.target.value)}
            placeholder="15"
            className="input-base w-full font-mono"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h1 text-[var(--color-text-primary)] mb-1">{t.title}</h1>
          <p className="text-[var(--text-body)] text-[var(--color-text-tertiary)]">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Scale Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] border border-[var(--color-border-primary)]">
            <span className="text-[var(--text-caption)] text-[var(--color-text-quaternary)] px-2">{t.scale}</span>
            <button
              onClick={() => setScale("4.0")}
              className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-caption)] font-semibold transition-all ${
                scale === "4.0" 
                  ? "bg-[var(--color-primary)] text-white shadow-sm" 
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              4.0
            </button>
            <button
              onClick={() => setScale("4.3")}
              className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-caption)] font-semibold transition-all ${
                scale === "4.3" 
                  ? "bg-[var(--color-primary)] text-white shadow-sm" 
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              4.3
            </button>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={resetAll}
            className="btn btn-ghost btn-sm text-[var(--color-text-tertiary)]"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">{t.reset}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-[var(--color-border-primary)] mb-6 overflow-x-auto">
        <TabButton
          active={activeTab === 'tgpa'}
          onClick={() => setActiveTab('tgpa')}
          label={t.tab_tgpa}
          icon="📊"
        />
        <TabButton
          active={activeTab === 'cgpa'}
          onClick={() => setActiveTab('cgpa')}
          label={t.tab_cgpa}
          icon="📈"
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
        ) : (
          <>
            {/* Input Section - Show on CGPA and Target tabs */}
            {(activeTab === 'cgpa' || activeTab === 'target') && renderInputSection()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Table */}
              <div className="lg:col-span-2 space-y-4">
                {courses.length === 0 ? (
                  <EmptyState
                    icon="📚"
                    title={t.emptyTitle}
                    description={t.emptyDesc}
                    primaryAction={{
                      label: t.addFirst,
                      onClick: addCourse
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
                    
                    {/* Add Course Button */}
                    <button
                      onClick={addCourse}
                      className="w-full py-3.5 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border-secondary)] text-[var(--color-text-tertiary)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      {t.addCourse}
                    </button>
                    
                    {/* Sticky Summary */}
                    <div className="card p-4 flex items-center justify-between sticky bottom-4 shadow-lg">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-[var(--text-caption)] text-[var(--color-text-quaternary)] block">
                            {lang === 'EN' ? 'Total Credits' : '總學分'}
                          </span>
                          <span className="text-[var(--text-h3)] font-bold font-mono text-[var(--color-text-primary)]">
                            {thisSemCredits}
                          </span>
                        </div>
                        <div className="w-px h-10 bg-[var(--color-border-primary)]" />
                        <div>
                          <span className="text-[var(--text-caption)] text-[var(--color-text-quaternary)] block">
                            {lang === 'EN' ? 'Semester GPA' : '本學期 GPA'}
                          </span>
                          <span className="text-[var(--text-h3)] font-bold font-mono text-[var(--color-primary)]">
                            {thisSemGPA.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[var(--text-body-sm)] text-[var(--color-text-quaternary)]">
                        {courses.length} {lang === 'EN' ? 'courses' : '門課'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Insight Panel */}
              <div className="lg:col-span-1">
                <InsightPanel
                  lang={lang}
                  thisSemGPA={thisSemGPA}
                  thisSemCredits={thisSemCredits}
                  currentCGPA={currentCGPA}
                  completedCredits={completedCredits}
                  projectedCGPA={projectedCGPA}
                  targetCGPA={targetCGPA}
                  requiredGPA={requiredGPA}
                  maxGPA={maxGPA}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
