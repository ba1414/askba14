import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Target } from "lucide-react";
import { saveData, loadData } from "./db";

const TRANSLATIONS = {
  EN: {
    title: "GPA Calculator",
    scale: "Scale",
    addCourse: "Add Course",
    courseName: "Course name...",
    grade: "Grade",
    credits: "Credits",
    currentGPA: "Current",
    targetGPA: "Target GPA",
    requiredGPA: "Need",
    cumulativeGPA: "Cumulative GPA",
    currentCredits: "Completed Credits",
    upcomingCredits: "Upcoming Credits",
    calculate: "Calculate",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
  },
  粵: {
    title: "GPA 計算機",
    scale: "評分制",
    addCourse: "新增課程",
    courseName: "課程名稱...",
    grade: "成績",
    credits: "學分",
    currentGPA: "現時",
    targetGPA: "目標 GPA",
    requiredGPA: "所需",
    cumulativeGPA: "累積 GPA",
    currentCredits: "已完成學分",
    upcomingCredits: "下學期學分",
    calculate: "計算",
    excellent: "優秀",
    good: "良好",
    average: "平均",
    poor: "欠佳",
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
  
  if (percentage >= 85) return { color: "#10B981", label: "excellent" }; // Green
  if (percentage >= 70) return { color: "#3B82F6", label: "good" }; // Blue
  if (percentage >= 50) return { color: "#F59E0B", label: "average" }; // Orange
  return { color: "#EF4444", label: "poor" }; // Red
}

function CircularProgress({ gpa, scale, lang }: { gpa: number; scale: GPAScale; lang: "EN" | "粵" }) {
  const t = TRANSLATIONS[lang];
  const maxGPA = scale === "4.3" ? 4.3 : 4.0;
  const percentage = (gpa / maxGPA) * 100;
  const { color, label } = getGPAColor(gpa, scale);
  
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r="70"
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
          className="dark:stroke-[#323232]"
        />
        {/* Progress circle with animation */}
        <circle
          cx="96"
          cy="96"
          r="70"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-[#0F0F0F] dark:text-[#F0F0F0]">
          {gpa.toFixed(2)}
        </div>
        <div className="text-xs font-medium uppercase tracking-wider mt-1" style={{ color }}>
          {t[label as keyof typeof t]}
        </div>
      </div>
    </div>
  );
}

export default function GPACalculatorNew({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const [scale, setScale] = useState<GPAScale>("4.0");
  
  const [courses, setCourses] = useState<Course[]>(() => {
    // Always start with 5 default courses
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

  // Load data from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const savedCourses = await loadData('gpa', 'courses', []);
      if (savedCourses.length > 0) {
        setCourses(savedCourses);
      }
      const savedScale = await loadData('gpa', 'scale', '4.0');
      setScale(savedScale as GPAScale);
    })();
  }, []);

  // Save courses to IndexedDB
  useEffect(() => {
    saveData('gpa', 'courses', courses);
  }, [courses]);

  // Save scale to IndexedDB
  useEffect(() => {
    saveData('gpa', 'scale', scale);
  }, [scale]);

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
    <div className="w-full max-w-5xl mx-auto p-2 md:p-4 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">
          {lang === "EN" ? "Calculate and forecast your grade point average" : "計算同預測你嘅平均績點"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current GPA Card */}
        <div className="bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#252525] dark:to-[#1E1E1E] border border-[#E5E7EB] dark:border-[#323232] rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-semibold text-[#6B6B6B] dark:text-[#9B9B9B] mb-6 uppercase tracking-wider">
            {t.currentGPA}
          </h3>
          <CircularProgress gpa={currentGPA} scale={scale} lang={lang} />
          <div className="mt-6 text-center">
            <p className="text-xs text-[#9B9B9B] dark:text-[#6B6B6B]">
              {totalCredits} {t.credits}
            </p>
          </div>
        </div>

        {/* Scale Toggle */}
        <div className="bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#6B6B6B] dark:text-[#9B9B9B] mb-4 uppercase tracking-wider">
            {t.scale}
          </h3>
          <div className="flex flex-col gap-3">
            {(["4.3", "4.0"] as GPAScale[]).map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`w-full px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 ${
                  scale === s
                    ? "bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-lg scale-105"
                    : "bg-[#F3F4F6] dark:bg-[#2A2A2A] text-[#6B6B6B] dark:text-[#9B9B9B] hover:bg-[#E5E7EB] dark:hover:bg-[#323232]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Target GPA Calculator */}
        <div className="bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-[#007AFF] dark:text-[#0A84FF]" strokeWidth={2.5} />
            <h3 className="text-sm font-semibold text-[#6B6B6B] dark:text-[#9B9B9B] uppercase tracking-wider">
              {t.targetGPA}
            </h3>
          </div>
          <div className="space-y-3">
            <input
              type="number"
              value={cumulativeGPA}
              onChange={(e) => setCumulativeGPA(e.target.value)}
              placeholder={t.cumulativeGPA}
              step="0.01"
              max={maxGPA}
              className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B]"
            />
            <input
              type="number"
              value={cumulativeCredits}
              onChange={(e) => setCumulativeCredits(e.target.value)}
              placeholder={t.currentCredits}
              step="1"
              className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B]"
            />
            <input
              type="number"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              placeholder={t.targetGPA}
              step="0.01"
              max={maxGPA}
              className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B]"
            />
            <input
              type="number"
              value={upcomingCredits}
              onChange={(e) => setUpcomingCredits(e.target.value)}
              placeholder={t.upcomingCredits}
              step="1"
              className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B]"
            />
            {requiredGPA !== null && (
              <div className="mt-4 p-3 bg-[#F0F9FF] dark:bg-[#1E3A4F] rounded-lg">
                <p className="text-xs text-[#6B6B6B] dark:text-[#9B9B9B] mb-1">{t.requiredGPA}</p>
                <p className="text-2xl font-bold text-[#007AFF] dark:text-[#0A84FF]">
                  {requiredGPA.toFixed(2)}
                </p>
                {requiredGPA > maxGPA && (
                  <p className="text-xs text-[#EF4444] dark:text-[#F87171] mt-1">
                    {lang === "EN" ? "Target not achievable" : "目標無法達到"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Course Button */}
      <button
        onClick={addCourse}
        className="w-full mb-6 px-6 py-4 border-2 border-dashed border-[#E5E7EB] dark:border-[#323232] rounded-xl text-sm font-medium text-[#6B6B6B] dark:text-[#9B9B9B] hover:border-[#007AFF] dark:hover:border-[#0A84FF] hover:text-[#007AFF] dark:hover:text-[#0A84FF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] flex items-center justify-center gap-2 transition-all duration-200"
      >
        <Plus size={20} strokeWidth={2} />
        {t.addCourse}
      </button>

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course, index) => (
          <div key={course.id} className="group">
            <div className="bg-white dark:bg-[#212121] border border-[#E8E8E8] dark:border-[#2F2F2F] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#6B6B6B] dark:text-[#9B9B9B]">{index + 1}</span>
                </div>
                
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                  placeholder={t.courseName}
                  className="flex-1 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all"
                />
                
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, { grade: e.target.value })}
                  className="px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] transition-all font-medium"
                >
                  <option value="">{t.grade}</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                
                <input
                  type="number"
                  value={course.credits || ""}
                  onChange={(e) => updateCourse(course.id, { credits: parseFloat(e.target.value) || 0 })}
                  placeholder={t.credits}
                  className="w-24 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all font-medium"
                  min="0"
                  step="0.5"
                />
                
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="p-2.5 text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-[#3F1F1F] rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20">
          <div className="text-sm text-[#9B9B9B] dark:text-[#6B6B6B] mb-4">
            {lang === "EN" ? "No courses added yet" : "未有課程"}
          </div>
          <p className="text-xs text-[#BFBFBF] dark:text-[#5B5B5B]">
            {lang === "EN" ? "Add your first course to calculate your GPA" : "新增第一個課程開始計算"}
          </p>
        </div>
      )}
    </div>
  );
}
