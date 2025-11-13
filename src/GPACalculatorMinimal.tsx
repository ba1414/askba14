import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

/**
 * Minimal GPA Calculator - ChatGPT style
 * No decorations, flat design
 */

const TRANSLATIONS = {
  EN: {
    title: "GPA Calculator",
    scale: "Scale",
    addCourse: "Add Course",
    courseName: "Course name...",
    grade: "Grade",
    credits: "Credits",
    currentGPA: "Current GPA",
    targetGPA: "Target GPA",
    requiredGPA: "Required GPA",
    cumulativeGPA: "Cumulative GPA",
    currentCredits: "Current Credits",
    upcomingCredits: "Upcoming Credits",
    calculate: "Calculate Required GPA",
  },
  粵: {
    title: "GPA 計算機",
    scale: "評分制",
    addCourse: "新增課程",
    courseName: "課程名稱...",
    grade: "成績",
    credits: "學分",
    currentGPA: "現時 GPA",
    targetGPA: "目標 GPA",
    requiredGPA: "所需 GPA",
    cumulativeGPA: "累積 GPA",
    currentCredits: "現時學分",
    upcomingCredits: "下學期學分",
    calculate: "計算所需 GPA",
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

export default function GPACalculatorMinimal({ lang: propLang }: { lang: string }) {
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('gpa_calculator_data');
      if (saved) {
        const data = JSON.parse(saved);
        return data;
      }
    } catch (error) {
      console.error('Failed to load GPA data:', error);
    }
    return {
      scale: "4.0" as GPAScale,
      courses: [
        { id: "1", name: "", grade: "", credits: 3 },
        { id: "2", name: "", grade: "", credits: 3 },
        { id: "3", name: "", grade: "", credits: 3 },
      ],
    };
  };

  const savedData = loadSavedData();
  const [scale, setScale] = useState<GPAScale>(savedData.scale);
  const [courses, setCourses] = useState<Course[]>(savedData.courses);

  useEffect(() => {
    try {
      localStorage.setItem('gpa_calculator_data', JSON.stringify({ scale, courses }));
    } catch (error) {
      console.error('Failed to save GPA data:', error);
    }
  }, [scale, courses]);

  const gpa = useMemo(() => {
    const gradeValues = scale === "4.0" ? GRADE_VALUES_4_0 : GRADE_VALUES_4_3;
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      if (course.grade && gradeValues[course.grade] !== undefined) {
        totalPoints += gradeValues[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [courses, scale]);

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

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">
          {lang === "EN" ? "Calculate your cumulative grade point average" : "計算你嘅總平均績點"}
        </p>
      </div>

      {/* GPA Display */}
      <div className="mb-10 flex justify-center">
        <div className="relative">
          <div className="w-52 h-52 rounded-full bg-gradient-to-br from-white to-[#F9FAFB] dark:from-[#252525] dark:to-[#1A1A1A] flex items-center justify-center shadow-xl border border-[#E5E7EB] dark:border-[#323232]">
            <div className="text-center">
              <div className="text-6xl font-bold text-[#0F0F0F] dark:text-[#F0F0F0] mb-2">
                {gpa}
              </div>
              <div className="text-xs font-medium text-[#6B6B6B] dark:text-[#9B9B9B] uppercase tracking-widest">
                Current GPA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scale Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex bg-[#F3F4F6] dark:bg-[#252525] rounded-xl p-1 gap-1 shadow-sm border border-[#E5E7EB] dark:border-[#323232]">
          <button
            onClick={() => setScale("4.0")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              scale === "4.0"
                ? "bg-white dark:bg-[#353535] text-[#0F0F0F] dark:text-[#F0F0F0] shadow-sm"
                : "text-[#6B6B6B] dark:text-[#9B9B9B] hover:text-[#0F0F0F] dark:hover:text-[#E8E8E8]"
            }`}
          >
            {t.scale} 4.0
          </button>
          <button
            onClick={() => setScale("4.3")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              scale === "4.3"
                ? "bg-white dark:bg-[#353535] text-[#0F0F0F] dark:text-[#F0F0F0] shadow-sm"
                : "text-[#6B6B6B] dark:text-[#9B9B9B] hover:text-[#0F0F0F] dark:hover:text-[#E8E8E8]"
            }`}
          >
            {t.scale} 4.3
          </button>
        </div>
      </div>

      {/* Courses */}
      <div className="space-y-3 mb-6">
        {courses.map((course, index) => (
          <div key={course.id} className="group">
            <div className="bg-white dark:bg-[#212121] border border-[#E8E8E8] dark:border-[#2F2F2F] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex gap-3 items-center">
                {/* Course Number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#2A2A2A] flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#6B6B6B] dark:text-[#9B9B9B]">{index + 1}</span>
                </div>
                
                {/* Course Name */}
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                  placeholder={t.courseName}
                  className="flex-1 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F0F0F] dark:focus:ring-[#F0F0F0] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all"
                />
                
                {/* Grade */}
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, { grade: e.target.value })}
                  className="px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F0F0F] dark:focus:ring-[#F0F0F0] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] transition-all font-medium"
                >
                  <option value="">{t.grade}</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                
                {/* Credits */}
                <input
                  type="number"
                  value={course.credits || ""}
                  onChange={(e) => updateCourse(course.id, { credits: parseFloat(e.target.value) || 0 })}
                  placeholder={t.credits}
                  className="w-24 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#323232] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#0F0F0F] dark:focus:ring-[#F0F0F0] focus:border-transparent text-[#0F0F0F] dark:text-[#F0F0F0] placeholder-[#9B9B9B] dark:placeholder-[#6B6B6B] transition-all font-medium"
                  min="0"
                  step="0.5"
                />
                
                {/* Delete */}
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

      {/* Add Course Button */}
      <button
        onClick={addCourse}
        className="w-full px-6 py-4 border-2 border-dashed border-[#E5E7EB] dark:border-[#323232] rounded-xl text-sm font-medium text-[#6B6B6B] dark:text-[#9B9B9B] hover:border-[#0F0F0F] dark:hover:border-[#F0F0F0] hover:text-[#0F0F0F] dark:hover:text-[#F0F0F0] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1A1A] flex items-center justify-center gap-2 transition-all duration-200"
      >
        <Plus size={20} strokeWidth={2} />
        {t.addCourse}
      </button>

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
