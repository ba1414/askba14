import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Calculator, AlertCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface Assessment {
  id: string;
  name: string;
  weight: number;
  grade: string; // User input: "A", "B+", "85", "16/20"
}

interface Course {
  id: string;
  name: string;
  credits: number;
  assessments: Assessment[];
  isOpen: boolean;
}

interface GradePredictionProps {
  lang: string;
  scale: "4.0" | "4.3";
}

const TRANSLATIONS = {
  EN: {
    title: "Course Grade Estimator",
    subtitle: "Quickly estimate your final grades for multiple courses.",
    addCourse: "Add Course",
    courseName: "Course Name",
    credits: "Credits",
    assessments: "Assessments",
    addAssessment: "Add Item",
    componentName: "Name (e.g. Midterm)",
    weight: "Weight %",
    grade: "Grade (Letter/Score)",
    currentStanding: "Current Standing",
    estimatedFinal: "Estimated Final",
    overallSummary: "Overall Summary",
    predictedGPA: "Predicted GPA",
    totalCredits: "Total Credits",
    disclaimer: "⚠️ Estimates only. Actual grades may vary due to curves or rounding.",
    weightWarning: "Weights ≠ 100%",
    noCourses: "No courses added yet.",
    deleteCourse: "Delete Course",
    gradePlaceholder: "A, 85, 16/20",
    basedOn: "based on",
    completed: "completed",
    remove: "Remove"
  },
  粵: {
    title: "課程成績預測",
    subtitle: "快速預測多個課程的最終成績。",
    addCourse: "新增課程",
    courseName: "課程名稱",
    credits: "學分",
    assessments: "評估項目",
    addAssessment: "新增項目",
    componentName: "名稱 (例: 期中考)",
    weight: "比重 %",
    grade: "成績 (等級/分數)",
    currentStanding: "現時成績",
    estimatedFinal: "預計最終成績",
    overallSummary: "總結",
    predictedGPA: "預測 GPA",
    totalCredits: "總學分",
    disclaimer: "⚠️ 僅供參考。實際成績可能因調分或進位而異。",
    weightWarning: "比重 ≠ 100%",
    noCourses: "尚未新增課程。",
    deleteCourse: "刪除課程",
    gradePlaceholder: "A, 85, 16/20",
    basedOn: "基於",
    completed: "已完成",
    remove: "移除"
  }
};

const GRADE_THRESHOLDS_4_0 = [
  { grade: "A", min: 93, max: 100, gpa: 4.0 },
  { grade: "A-", min: 90, max: 92.99, gpa: 3.7 },
  { grade: "B+", min: 87, max: 89.99, gpa: 3.3 },
  { grade: "B", min: 83, max: 86.99, gpa: 3.0 },
  { grade: "B-", min: 80, max: 82.99, gpa: 2.7 },
  { grade: "C+", min: 77, max: 79.99, gpa: 2.3 },
  { grade: "C", min: 73, max: 76.99, gpa: 2.0 },
  { grade: "C-", min: 70, max: 72.99, gpa: 1.7 },
  { grade: "D", min: 60, max: 69.99, gpa: 1.0 },
  { grade: "F", min: 0, max: 59.99, gpa: 0.0 }
];

const GRADE_THRESHOLDS_4_3 = [
  { grade: "A+", min: 97, max: 100, gpa: 4.3 },
  { grade: "A", min: 93, max: 96.99, gpa: 4.0 },
  { grade: "A-", min: 90, max: 92.99, gpa: 3.7 },
  { grade: "B+", min: 87, max: 89.99, gpa: 3.3 },
  { grade: "B", min: 83, max: 86.99, gpa: 3.0 },
  { grade: "B-", min: 80, max: 82.99, gpa: 2.7 },
  { grade: "C+", min: 77, max: 79.99, gpa: 2.3 },
  { grade: "C", min: 73, max: 76.99, gpa: 2.0 },
  { grade: "C-", min: 70, max: 72.99, gpa: 1.7 },
  { grade: "D", min: 60, max: 69.99, gpa: 1.0 },
  { grade: "F", min: 0, max: 59.99, gpa: 0.0 }
];

const getLetterGrade = (percentage: number, scale: "4.0" | "4.3") => {
  const thresholds = scale === "4.3" ? GRADE_THRESHOLDS_4_3 : GRADE_THRESHOLDS_4_0;
  const match = thresholds.find(t => percentage >= t.min && percentage <= t.max);
  return match || thresholds[thresholds.length - 1];
};

const parseScoreInput = (input: string, scale: "4.0" | "4.3"): number | null => {
  const cleanInput = input.trim().toUpperCase();
  if (!cleanInput) return null;

  // Try parsing "X/Y"
  if (cleanInput.includes('/')) {
    const [num, den] = cleanInput.split('/').map(Number);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return Math.min(100, Math.max(0, (num / den) * 100));
    }
  }

  // Try parsing number
  const num = parseFloat(cleanInput);
  if (!isNaN(num)) {
    return Math.min(100, Math.max(0, num));
  }

  // Try parsing letter grade
  const thresholds = scale === "4.3" ? GRADE_THRESHOLDS_4_3 : GRADE_THRESHOLDS_4_0;
  const match = thresholds.find(t => t.grade === cleanInput);
  if (match) {
    // Return midpoint of the grade range
    return (match.min + match.max) / 2;
  }

  return null;
};

export default function GradePrediction({ lang, scale }: GradePredictionProps) {
  const isEn = lang === "EN";
  const t = TRANSLATIONS[isEn ? "EN" : "粵"];

  const [courses, setCourses] = useState<Course[]>([]);

  // Load and Migrate Data
  useEffect(() => {
    const savedCourses = localStorage.getItem('grade_prediction_courses');
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (e) {
        console.error('Failed to load courses', e);
      }
    } else {
      // Migration from old single-course format
      const oldComponents = localStorage.getItem('grade_prediction_components');
      if (oldComponents) {
        try {
          const parsed = JSON.parse(oldComponents);
          const migratedCourse: Course = {
            id: `course-${Date.now()}`,
            name: "Course 1",
            credits: 3,
            isOpen: true,
            assessments: parsed.map((c: any) => ({
              id: c.id,
              name: c.name,
              weight: c.weight,
              grade: c.scoreRaw || (c.score ? c.score.toString() : "")
            }))
          };
          setCourses([migratedCourse]);
          localStorage.removeItem('grade_prediction_components'); // Clean up old key
        } catch (e) {
          console.error('Failed to migrate old data', e);
        }
      }
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('grade_prediction_courses', JSON.stringify(courses));
    }
  }, [courses]);

  const addCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: "",
      credits: 3,
      isOpen: true,
      assessments: [
        { id: `as-${Date.now()}-1`, name: "Assignment 1", weight: 20, grade: "" },
        { id: `as-${Date.now()}-2`, name: "Midterm", weight: 30, grade: "" },
        { id: `as-${Date.now()}-3`, name: "Final", weight: 50, grade: "" },
      ]
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    if (confirm(t.deleteCourse + "?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const toggleCourseOpen = (id: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
  };

  const addAssessment = (courseId: string) => {
    setCourses(courses.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        assessments: [...c.assessments, { id: `as-${Date.now()}`, name: "", weight: 0, grade: "" }]
      };
    }));
  };

  const updateAssessment = (courseId: string, assessmentId: string, updates: Partial<Assessment>) => {
    setCourses(courses.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        assessments: c.assessments.map(a => a.id === assessmentId ? { ...a, ...updates } : a)
      };
    }));
  };

  const deleteAssessment = (courseId: string, assessmentId: string) => {
    setCourses(courses.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        assessments: c.assessments.filter(a => a.id !== assessmentId)
      };
    }));
  };

  // Calculations
  const calculateCourseStats = (course: Course) => {
    let totalWeight = 0;
    let completedWeight = 0;
    let earnedPoints = 0;

    course.assessments.forEach(a => {
      const w = a.weight || 0;
      totalWeight += w;
      const score = parseScoreInput(a.grade, scale);
      if (score !== null) {
        completedWeight += w;
        earnedPoints += (score / 100) * w;
      }
    });

    // Current Standing: Grade based only on what's completed
    const currentStanding = completedWeight > 0 ? (earnedPoints / completedWeight) * 100 : 0;

    // Projected Final: Two scenarios
    // 1. If total weight = 100%, show what you'd get if you maintain current performance
    // 2. If total weight < 100%, we can't reliably project
    // 3. If total weight > 100%, normalize it
    
    let projectedScore = 0;
    
    if (completedWeight === 0) {
      // Nothing completed yet - can't predict
      projectedScore = 0;
    } else if (Math.abs(totalWeight - 100) < 0.1) {
      // Total weight is 100% - project based on current average
      const currentAvgPercentage = currentStanding;
      const remainingWeight = 100 - completedWeight;
      projectedScore = earnedPoints + (currentAvgPercentage / 100) * remainingWeight;
    } else if (totalWeight > 0) {
      // Weights don't add to 100 - show current standing normalized
      projectedScore = currentStanding;
    }
    
    const projectedLetter = getLetterGrade(projectedScore, scale);

    return {
      totalWeight,
      completedWeight,
      currentStanding,
      projectedScore,
      projectedLetter
    };
  };

  const overallStats = useMemo(() => {
    let totalCredits = 0;
    let totalGPA = 0;
    let validCourses = 0;

    courses.forEach(c => {
      const stats = calculateCourseStats(c);
      if (stats.completedWeight > 0) {
        totalCredits += c.credits || 0;
        totalGPA += stats.projectedLetter.gpa * (c.credits || 0);
        validCourses++;
      }
    });

    const gpa = totalCredits > 0 ? totalGPA / totalCredits : 0;

    return { gpa, totalCredits, validCourses };
  }, [courses, scale]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{t.title}</h2>
        <p className="text-[var(--color-text-secondary)]">{t.subtitle}</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800 dark:text-yellow-300">{t.disclaimer}</p>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {courses.map(course => {
          const stats = calculateCourseStats(course);
          const isWeightInvalid = Math.abs(stats.totalWeight - 100) > 0.1;

          return (
            <div key={course.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-sm">
              {/* Course Header */}
              <div 
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--color-surface-primary)] cursor-pointer hover:bg-[var(--color-surface-secondary)] transition-colors"
                onClick={() => toggleCourseOpen(course.id)}
              >
                <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                  {course.isOpen ? <ChevronUp size={20} className="text-[var(--color-text-tertiary)] flex-shrink-0" /> : <ChevronDown size={20} className="text-[var(--color-text-tertiary)] flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={t.courseName}
                      className="bg-transparent font-bold text-lg text-[var(--color-text-primary)] outline-none placeholder-[var(--color-text-quaternary)] w-full focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded px-2 -ml-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">{t.credits}</span>
                    <input
                      type="number"
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, { credits: parseFloat(e.target.value) || 0 })}
                      className="w-14 px-2 py-1.5 bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-primary)] text-center text-sm font-semibold focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[var(--color-primary)]">
                      {stats.projectedLetter.grade}
                    </div>
                    <div className="text-xs text-[var(--color-text-tertiary)] font-medium">
                      {stats.projectedScore.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Body */}
              {course.isOpen && (
                <div className="p-4 border-t border-[var(--border-subtle)]">
                  {/* Assessments Table */}
                  <div className="mb-6">
                    <div className="hidden sm:grid grid-cols-[1fr_100px_140px_44px] gap-3 mb-3 px-2">
                      <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">{t.componentName}</div>
                      <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider text-center">{t.weight}</div>
                      <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider text-center">{t.grade}</div>
                      <div></div>
                    </div>
                    
                    <div className="space-y-3">
                      {course.assessments.map(assessment => (
                        <div key={assessment.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_140px_44px] gap-2 sm:gap-3 items-start sm:items-center bg-[var(--color-bg-elevated)] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                          <input
                            type="text"
                            value={assessment.name}
                            onChange={(e) => updateAssessment(course.id, assessment.id, { name: e.target.value })}
                            placeholder="Assignment"
                            className="px-4 py-2.5 bg-[var(--color-bg-page)] sm:bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-primary)] text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                          />
                          <div className="flex gap-2 sm:block">
                            <div className="flex-1 sm:hidden">
                              <label className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">{t.weight}</label>
                            </div>
                            <input
                              type="number"
                              value={assessment.weight || ""}
                              onChange={(e) => updateAssessment(course.id, assessment.id, { weight: parseFloat(e.target.value) || 0 })}
                              placeholder="0"
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-[var(--color-bg-page)] sm:bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-primary)] text-sm text-center outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-semibold"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 sm:hidden">
                              <label className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1">{t.grade}</label>
                            </div>
                            <input
                              type="text"
                              value={assessment.grade}
                              onChange={(e) => updateAssessment(course.id, assessment.id, { grade: e.target.value })}
                              placeholder={t.gradePlaceholder}
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-[var(--color-bg-page)] sm:bg-[var(--color-bg-elevated)] rounded-lg border border-[var(--color-border-primary)] text-sm text-center outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all font-semibold"
                            />
                            <button
                              onClick={() => deleteAssessment(course.id, assessment.id)}
                              className="sm:hidden p-2 text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <button
                            onClick={() => deleteAssessment(course.id, assessment.id)}
                            className="hidden sm:block p-2 text-[var(--color-text-tertiary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Warnings */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => addAssessment(course.id)}
                      className="flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:opacity-80 px-2 py-1"
                    >
                      <Plus size={16} />
                      {t.addAssessment}
                    </button>
                    {isWeightInvalid && (
                      <span className="text-xs font-medium text-orange-500">
                        {t.weightWarning} ({stats.totalWeight}%)
                      </span>
                    )}
                  </div>

                  {/* Course Summary Footer */}
                  <div className="bg-[var(--bg-subtle)] rounded-xl p-4 flex flex-wrap gap-6 items-center justify-between">
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-1">{t.currentStanding}</div>
                      <div className="text-lg font-bold text-[var(--text)]">
                        {stats.currentStanding.toFixed(1)}%
                        <span className="text-xs font-normal text-[var(--text-muted)] ml-2">
                          ({t.basedOn} {stats.completedWeight}% {t.completed})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        {t.deleteCourse}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {courses.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-subtle)] rounded-2xl">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">{t.noCourses}</p>
          </div>
        )}

        <button
          onClick={addCourse}
          className="w-full py-4 bg-[var(--surface)] border-2 border-dashed border-[var(--border-subtle)] rounded-2xl text-[var(--text-muted)] font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {t.addCourse}
        </button>
      </div>

      {/* Overall Summary */}
      {courses.length > 0 && overallStats.validCourses > 0 && (
        <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 rounded-2xl p-6 md:p-8 border border-[var(--color-primary)]/20 shadow-lg">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {t.overallSummary}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-5 border border-[var(--color-border-primary)]">
              <div className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wider">{t.predictedGPA}</div>
              <div className="text-5xl font-black text-[var(--color-primary)]">
                {overallStats.gpa.toFixed(2)}
              </div>
            </div>
            <div className="bg-[var(--color-bg-elevated)] rounded-xl p-5 border border-[var(--color-border-primary)]">
              <div className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wider">{t.totalCredits}</div>
              <div className="text-4xl font-bold text-[var(--color-text-primary)]">
                {overallStats.totalCredits}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}