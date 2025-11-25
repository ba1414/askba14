import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Target, Calculator, TrendingUp, Award, BookOpen } from "lucide-react";
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
    semester: "This Semester",
    stats: "Statistics",
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
    semester: "本學期",
    stats: "統計",
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
    <div className="relative flex flex-col items-center justify-center py-8 group cursor-default">
      <div className="relative w-52 h-52 transition-transform duration-500 ease-out group-hover:scale-105">
        <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r={radius}
            stroke="currentColor"
            strokeWidth="16"
            fill="none"
            className="text-[#E5E5EA] dark:text-[#2C2C2E] transition-colors duration-300"
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
          <span className="text-6xl font-bold tracking-tighter text-[#1D1D1F] dark:text-[#F5F5F7] transition-all duration-300 group-hover:scale-110" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
            {gpa.toFixed(2)}
          </span>
          <span className="text-sm font-semibold uppercase tracking-wide mt-2 px-3 py-1 rounded-full bg-opacity-10 transition-all duration-300 group-hover:bg-opacity-20" style={{ color: color, backgroundColor: `${color}20` }}>
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
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-300 z-10 ${
            value === option
              ? "bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm scale-100"
              : "text-[#8E8E93] hover:text-black dark:hover:text-white scale-95 hover:scale-100"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: any, value: string | number, label: string, color: string }) {
  return (
    <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl p-4 flex items-center gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-md">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} bg-opacity-10`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <div className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{value}</div>
        <div className="text-xs font-medium text-[#86868B] uppercase tracking-wide">{label}</div>
      </div>
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
    <div className="col-span-full w-full max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-[#1D1D1F] dark:text-[#F5F5F7]">
            {t.title}
          </h1>
          <p className="text-[#86868B] mt-2 text-xl font-medium">
            {lang === "EN" ? "Track your academic progress" : "追蹤你嘅學業進度"}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <div className="text-xs font-bold text-[#86868B] mb-2 uppercase tracking-wider ml-1">{t.scale}</div>
          <SegmentedControl 
            options={["4.0", "4.3"]} 
            value={scale} 
            onChange={(val) => setScale(val as GPAScale)} 
          />
        </div>
      </div>

      {/* GPA Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Main GPA Ring */}
        <div className="lg:col-span-4 apple-card p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#34C759] via-[#007AFF] to-[#FF9500] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-6 text-center">
            {t.currentGPA}
          </h3>
          <CircularProgress gpa={currentGPA} scale={scale} lang={lang} />
        </div>

        {/* Stats & Target Group */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stats */}
          <div className="apple-card p-6 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-[#86868B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> {t.stats}
            </h3>
            <div className="space-y-4">
              <StatCard 
                icon={BookOpen} 
                value={totalCredits} 
                label={t.credits} 
                color="bg-blue-500 text-blue-500" 
              />
              <StatCard 
                icon={Award} 
                value={courses.filter(c => c.grade).length} 
                label={lang === "EN" ? "Courses Graded" : "已評分課程"} 
                color="bg-purple-500 text-purple-500" 
              />
            </div>
          </div>

          {/* Target Calculator */}
          <div className="apple-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-[#007AFF] rounded-lg shadow-sm">
                <Target size={16} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {t.targetGPA}
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#86868B] ml-1 uppercase tracking-wider">{t.cumulativeGPA}</label>
                  <input
                    type="number"
                    value={cumulativeGPA}
                    onChange={(e) => setCumulativeGPA(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all text-sm font-medium"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#86868B] ml-1 uppercase tracking-wider">{t.currentCredits}</label>
                  <input
                    type="number"
                    value={cumulativeCredits}
                    onChange={(e) => setCumulativeCredits(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all text-sm font-medium"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#86868B] ml-1 uppercase tracking-wider">{t.targetGoal}</label>
                  <input
                    type="number"
                    value={targetGPA}
                    onChange={(e) => setTargetGPA(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all text-sm font-medium"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#86868B] ml-1 uppercase tracking-wider">{t.upcomingCredits}</label>
                  <input
                    type="number"
                    value={upcomingCredits}
                    onChange={(e) => setUpcomingCredits(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all text-sm font-medium"
                    placeholder="0"
                  />
                </div>
              </div>

              {requiredGPA !== null && (
                <div className={`mt-4 p-3 rounded-lg transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 ${
                  requiredGPA > maxGPA 
                    ? "bg-[#FF3B30]/10 text-[#FF3B30]" 
                    : "bg-[#34C759]/10 text-[#34C759]"
                }`}>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{t.requiredGPA}</span>
                    <span className="text-xl font-bold tracking-tight">{requiredGPA.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course List (Full Width) */}
      <div className="apple-card overflow-hidden">
        <div className="p-6 border-b border-[#E5E5EA] dark:border-[#2C2C2E] flex justify-between items-center bg-white/50 dark:bg-[#1C1C1E]/50 backdrop-blur-xl sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-2">
            <BookOpen size={20} className="text-[#007AFF]" />
            {t.semester}
          </h3>
          <button
            onClick={addCourse}
            className="apple-button-primary flex items-center gap-2 text-sm shadow-lg shadow-blue-500/30"
          >
            <Plus size={16} strokeWidth={2.5} />
            {t.addCourse}
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F9F9F9] dark:bg-[#252525] border-b border-[#E5E5EA] dark:border-[#2C2C2E] text-xs font-bold text-[#86868B] uppercase tracking-wider">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 md:col-span-5">{t.courseName}</div>
          <div className="col-span-3 md:col-span-3">{t.grade}</div>
          <div className="col-span-2 md:col-span-3">{t.credits}</div>
        </div>

        <div className="divide-y divide-[#E5E5EA] dark:divide-[#2C2C2E]">
          {courses.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full flex items-center justify-center mb-4">
                <Calculator size={32} className="text-[#86868B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">{t.noCourses}</h3>
              <p className="text-[#86868B] text-sm">{t.startAdding}</p>
            </div>
          ) : (
            courses.map((course, index) => (
              <div key={course.id} className="group grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[#F9F9F9] dark:hover:bg-[#252525] transition-colors duration-200 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="col-span-1 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-xs font-bold text-[#86868B] group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                </div>
                
                <div className="col-span-6 md:col-span-5">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                    placeholder={t.courseName}
                    className="w-full bg-transparent text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none font-medium text-base"
                  />
                </div>
                
                <div className="col-span-3 md:col-span-3">
                  <div className="relative">
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, { grade: e.target.value })}
                      className={`w-full appearance-none bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all cursor-pointer hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] ${
                        !course.grade ? "text-[#86868B]" : "text-[#1D1D1F] dark:text-[#F5F5F7]"
                      }`}
                    >
                      <option value="">-</option>
                      {grades.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="col-span-2 md:col-span-3 relative flex items-center gap-2">
                  <input
                    type="number"
                    value={course.credits || ""}
                    onChange={(e) => updateCourse(course.id, { credits: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-16 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg px-3 py-2 text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C]"
                    min="0"
                    step="0.5"
                  />
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="ml-auto p-2 text-[#FF3B30] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#FF3B30]/10 rounded-lg"
                    title="Delete course"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
