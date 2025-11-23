import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Target, Calculator } from "lucide-react";
import { saveData, loadData } from "./db";

const TRANSLATIONS = {
  EN: {
    title: "GPA Calculator",
    scale: "Grading Scale",
    addCourse: "Add Course",
    courseName: "Course Name",
    grade: "Grade",
    credits: "Credits",
    currentGPA: "Current GPA",
    targetGPA: "Target Calculator",
    requiredGPA: "Required GPA",
    cumulativeGPA: "Current Cumulative GPA",
    currentCredits: "Completed Credits",
    upcomingCredits: "Upcoming Credits",
    targetGoal: "Target Goal",
    calculate: "Calculate",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
    noCourses: "No courses added",
    startAdding: "Add a course to get started",
  },
  粵: {
    title: "GPA 計算機",
    scale: "評分標準",
    addCourse: "新增課程",
    courseName: "課程名稱",
    grade: "成績",
    credits: "學分",
    currentGPA: "現時 GPA",
    targetGPA: "目標計算",
    requiredGPA: "所需 GPA",
    cumulativeGPA: "現時累積 GPA",
    currentCredits: "已完成學分",
    upcomingCredits: "下學期學分",
    targetGoal: "目標 GPA",
    calculate: "計算",
    excellent: "優秀",
    good: "良好",
    average: "平均",
    poor: "欠佳",
    noCourses: "未有課程",
    startAdding: "新增課程以開始",
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

function getGPAColor(gpa: number, scale: GPAScale) {
  const maxGPA = scale === "4.3" ? 4.3 : 4.0;
  const percentage = (gpa / maxGPA) * 100;
  
  if (percentage >= 85) return { color: "#34C759", label: "excellent" }; // Apple Green
  if (percentage >= 70) return { color: "#007AFF", label: "good" }; // Apple Blue
  if (percentage >= 50) return { color: "#FF9500", label: "average" }; // Apple Orange
  return { color: "#FF3B30", label: "poor" }; // Apple Red
}

function CircularProgress({ gpa, scale, lang }: { gpa: number; scale: GPAScale; lang: "EN" | "粵" }) {
  const t = TRANSLATIONS[lang];
  const maxGPA = scale === "4.3" ? 4.3 : 4.0;
  const percentage = Math.min(100, Math.max(0, (gpa / maxGPA) * 100));
  const { color, label } = getGPAColor(gpa, scale);
  
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      <div className="relative w-52 h-52">
        <svg className="transform -rotate-90 w-full h-full drop-shadow-xl">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-[#E5E5EA] dark:text-[#2C2C2E]"
          />
          {/* Progress circle */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke={color}
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7]" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
            {gpa.toFixed(2)}
          </span>
          <span className="text-sm font-semibold uppercase tracking-wide mt-2 px-3 py-1 rounded-full bg-opacity-10" style={{ color: color, backgroundColor: `${color}20` }}>
            {t[label as keyof typeof t]}
          </span>
        </div>
      </div>
    </div>
  );
}

function SegmentedControl({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) {
  return (
    <div className="flex p-1 bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-lg relative">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 z-10 ${
            value === option
              ? "bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm"
              : "text-[#8E8E93] hover:text-black dark:hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function GPACalculatorNew({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState<GPAScale>("4.0");
  
  const [courses, setCourses] = useState<Course[]>(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `course-${Date.now()}-${i}`,
      name: "",
      grade: "",
      credits: 3
    }));
  });
  
  const [targetGPA, setTargetGPA] = useState("");
  const [upcomingCredits, setUpcomingCredits] = useState("");
  const [cumulativeGPA, setCumulativeGPA] = useState("");
  const [cumulativeCredits, setCumulativeCredits] = useState("");

  useEffect(() => {
    (async () => {
      const savedCourses = await loadData('gpa', 'courses', []);
      if (savedCourses.length > 0) setCourses(savedCourses);
      const savedScale = await loadData('gpa', 'scale', '4.0');
      setScale(savedScale as GPAScale);
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) saveData('gpa', 'courses', courses);
  }, [courses, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveData('gpa', 'scale', scale);
  }, [scale, isLoaded]);

  const currentGPA = useMemo(() => {
    const gradeValues = scale === "4.0" ? GRADE_VALUES_4_0 : GRADE_VALUES_4_3;
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      if (course.grade && gradeValues[course.grade] !== undefined) {
        totalPoints += gradeValues[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [courses, scale]);

  const totalCredits = useMemo(() => {
    return courses.reduce((sum, c) => sum + (c.grade ? c.credits : 0), 0);
  }, [courses]);

  const requiredGPA = useMemo(() => {
    if (!targetGPA || !upcomingCredits || !cumulativeGPA || !cumulativeCredits) return null;
    
    const target = parseFloat(targetGPA);
    const upcoming = parseFloat(upcomingCredits);
    const cumulative = parseFloat(cumulativeGPA);
    const completed = parseFloat(cumulativeCredits);
    
    if (isNaN(target) || isNaN(upcoming) || isNaN(cumulative) || isNaN(completed)) return null;
    
    const totalFutureCredits = completed + upcoming;
    const requiredPoints = (target * totalFutureCredits) - (cumulative * completed);
    const required = requiredPoints / upcoming;
    
    return required;
  }, [targetGPA, upcomingCredits, cumulativeGPA, cumulativeCredits]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: "", grade: "", credits: 3 }]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const grades = scale === "4.0" ? GRADES_4_0 : GRADES_4_3;
  const maxGPA = scale === "4.3" ? 4.3 : 4.0;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            {t.title}
          </h1>
          <p className="text-[#86868B] dark:text-[#86868B] mt-1 text-lg">
            {lang === "EN" ? "Track your academic progress" : "追蹤你嘅學業進度"}
          </p>
        </div>
        <div className="w-full md:w-48">
          <div className="text-xs font-medium text-[#86868B] mb-2 uppercase tracking-wider ml-1">{t.scale}</div>
          <SegmentedControl 
            options={["4.0", "4.3"]} 
            value={scale} 
            onChange={(val) => setScale(val as GPAScale)} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Target */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main GPA Card */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E]">
            <h3 className="text-sm font-semibold text-[#86868B] uppercase tracking-wider mb-2 text-center">
              {t.currentGPA}
            </h3>
            <CircularProgress gpa={currentGPA} scale={scale} lang={lang} />
            <div className="flex justify-center gap-8 mt-2">
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{totalCredits}</div>
                <div className="text-xs text-[#86868B] uppercase tracking-wide">{t.credits}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{courses.filter(c => c.grade).length}</div>
                <div className="text-xs text-[#86868B] uppercase tracking-wide">{lang === "EN" ? "Courses" : "課程"}</div>
              </div>
            </div>
          </div>

          {/* Target Calculator */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E]">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-[#007AFF] rounded-lg">
                <Target size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {t.targetGPA}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868B] ml-1">{t.cumulativeGPA}</label>
                  <input
                    type="number"
                    value={cumulativeGPA}
                    onChange={(e) => setCumulativeGPA(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868B] ml-1">{t.currentCredits}</label>
                  <input
                    type="number"
                    value={cumulativeCredits}
                    onChange={(e) => setCumulativeCredits(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868B] ml-1">{t.targetGoal}</label>
                  <input
                    type="number"
                    value={targetGPA}
                    onChange={(e) => setTargetGPA(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#86868B] ml-1">{t.upcomingCredits}</label>
                  <input
                    type="number"
                    value={upcomingCredits}
                    onChange={(e) => setUpcomingCredits(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              {requiredGPA !== null && (
                <div className={`mt-6 p-4 rounded-2xl ${
                  requiredGPA > maxGPA 
                    ? "bg-[#FF3B30]/10 text-[#FF3B30]" 
                    : "bg-[#34C759]/10 text-[#34C759]"
                }`}>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium opacity-80">{t.requiredGPA}</span>
                    <span className="text-3xl font-bold tracking-tight">{requiredGPA.toFixed(2)}</span>
                  </div>
                  {requiredGPA > maxGPA && (
                    <p className="text-xs mt-2 opacity-80">
                      {lang === "EN" ? "This goal is mathematically impossible." : "此目標在數學上是不可能的。"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Course List */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-sm border border-[#E5E5EA] dark:border-[#2C2C2E] overflow-hidden">
            <div className="p-6 border-b border-[#E5E5EA] dark:border-[#2C2C2E] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {lang === "EN" ? "This Semester" : "本學期"}
              </h3>
              <button
                onClick={addCourse}
                className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] hover:bg-[#0071E3] text-white rounded-full text-sm font-medium transition-colors"
              >
                <Plus size={16} strokeWidth={2.5} />
                {t.addCourse}
              </button>
            </div>

            <div className="divide-y divide-[#E5E5EA] dark:divide-[#2C2C2E]">
              {courses.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator size={32} className="text-[#86868B]" />
                  </div>
                  <h3 className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium mb-1">{t.noCourses}</h3>
                  <p className="text-[#86868B] text-sm">{t.startAdding}</p>
                </div>
              ) : (
                courses.map((course, index) => (
                  <div key={course.id} className="group p-4 hover:bg-[#F9F9F9] dark:hover:bg-[#252525] transition-colors flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-xs font-medium text-[#86868B] flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-6">
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                          placeholder={t.courseName}
                          className="w-full bg-transparent text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none font-medium"
                        />
                      </div>
                      
                      <div className="md:col-span-3">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, { grade: e.target.value })}
                          className={`w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-colors ${
                            !course.grade ? "text-[#86868B]" : "text-[#1D1D1F] dark:text-[#F5F5F7]"
                          }`}
                        >
                          <option value="">{t.grade}</option>
                          {grades.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="md:col-span-3 relative">
                        <input
                          type="number"
                          value={course.credits || ""}
                          onChange={(e) => updateCourse(course.id, { credits: parseFloat(e.target.value) || 0 })}
                          placeholder={t.credits}
                          className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg px-3 py-2 text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-colors"
                          min="0"
                          step="0.5"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#86868B] pointer-events-none">
                          {lang === "EN" ? "Cr" : "學分"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-2 text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF3B30]/10 rounded-lg"
                      title="Delete course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
