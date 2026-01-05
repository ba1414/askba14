import React from 'react';
import { TrendingUp, Target, Sparkles } from 'lucide-react';
import { AppleEmoji } from '../AppleEmoji';

/**
 * Premium Insight Panel Component
 * Right sidebar panel for GPA pages with cohesive hierarchy
 */

interface InsightPanelProps {
  lang: string;
  thisSemGPA: number;
  thisSemCredits: number;
  currentCGPA: string;
  completedCredits: string;
  projectedCGPA: number | null;
  targetCGPA: string;
  requiredGPA: number | null;
  maxGPA: number;
  className?: string;
}

export function InsightPanel({
  lang,
  thisSemGPA,
  thisSemCredits,
  currentCGPA,
  completedCredits,
  projectedCGPA,
  targetCGPA,
  requiredGPA,
  maxGPA,
  className = ''
}: InsightPanelProps) {
  const t = {
    EN: {
      semesterGPA: 'This Semester',
      semCredits: 'Credits',
      cumulativeProgress: 'Cumulative Progress',
      currentCGPA: 'Current CGPA',
      afterSemester: 'After this semester',
      goalTracking: 'Goal Tracking',
      targetCGPA: 'Target CGPA',
      requiredGPA: 'Required GPA',
      feasibility: {
        easy: 'Achievable',
        medium: 'Ambitious',
        hard: 'Challenging',
        impossible: 'Not Possible'
      }
    },
    粵: {
      semesterGPA: '本學期',
      semCredits: '學分',
      cumulativeProgress: '累積進度',
      currentCGPA: '現時 CGPA',
      afterSemester: '完成本學期後',
      goalTracking: '目標追蹤',
      targetCGPA: '目標 CGPA',
      requiredGPA: '需達 GPA',
      feasibility: {
        easy: '可達成',
        medium: '偏進取',
        hard: '高難度',
        impossible: '不可能'
      }
    }
  };

  const labels = t[lang as keyof typeof t] || t.EN;

  // Feasibility calculation
  const getFeasibility = (required: number | null) => {
    if (required === null) return null;
    if (required > maxGPA) return { label: labels.feasibility.impossible, color: 'text-gray-400', bg: 'bg-gray-400', progress: 100 };
    if (required > maxGPA - 0.3) return { label: labels.feasibility.hard, color: 'text-gray-600', bg: 'bg-gray-600', progress: 85 };
    if (required > maxGPA - 0.7) return { label: labels.feasibility.medium, color: 'text-gray-800', bg: 'bg-gray-800', progress: 65 };
    return { label: labels.feasibility.easy, color: 'text-black', bg: 'bg-black', progress: 40 };
  };

  const feasibility = getFeasibility(requiredGPA);

  // Helper for Donut Chart
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (thisSemGPA / maxGPA) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Color based on GPA
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return '#34C759'; // Green
    if (gpa >= 3.0) return '#007AFF'; // Blue
    if (gpa >= 2.0) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  const gpaColor = getGPAColor(thisSemGPA);

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* This Semester GPA - Hero Card */}
      <div className="card p-6 relative overflow-hidden bg-[var(--color-bg-elevated)] border-[var(--color-border-primary)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[var(--color-surface-secondary)]">
                <AppleEmoji emoji="📊" className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {labels.semesterGPA}
              </span>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-[var(--color-text-primary)] font-mono">
                {thisSemGPA.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-[var(--color-text-tertiary)]">
                / {maxGPA.toFixed(1)}
              </span>
            </div>
            
            <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--color-surface-secondary)] text-xs font-medium text-[var(--color-text-secondary)]">
              {thisSemCredits} {labels.semCredits}
            </div>
          </div>

          {/* Donut Chart */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-[var(--color-surface-secondary)]"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={gpaColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-bold" style={{ color: gpaColor }}>
                 {Math.round(progress)}%
               </span>
            </div>
          </div>
        </div>
      </div>
      {/* Cumulative Progress */}
      <div className="card p-6 bg-[var(--color-bg-elevated)] border-[var(--color-border-primary)]">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-[var(--color-surface-secondary)]">
            <TrendingUp className="w-4 h-4 text-[var(--color-text-primary)]" />
          </div>
          <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
            {labels.cumulativeProgress}
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-[var(--color-text-secondary)]">{labels.currentCGPA}</span>
              <span className="text-xl font-bold text-[var(--color-text-primary)] font-mono">{currentCGPA || '—'}</span>
            </div>
            <div className="w-full h-2 bg-[var(--color-surface-secondary)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-text-primary)] rounded-full transition-all duration-1000"
                style={{ width: `${(parseFloat(currentCGPA || '0') / maxGPA) * 100}%` }}
              />
            </div>
          </div>

          {projectedCGPA !== null && (
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-[#86868B]">{labels.afterSemester}</span>
                <span className="text-xl font-bold text-black">{projectedCGPA.toFixed(2)}</span>
              </div>
              <div className="w-full h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-1000"
                  style={{ width: `${(projectedCGPA / maxGPA) * 100}%` }}
                />
              </div>
            </div>
          )}
          </div>
        </div>

      {/* Goal Tracking */}
      {targetCGPA && (
        <div className="card p-6 bg-[var(--color-bg-elevated)] border-[var(--color-border-primary)]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-[var(--color-surface-secondary)]">
              <Target className="w-4 h-4 text-[var(--color-text-primary)]" />
            </div>
            <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
              {labels.goalTracking}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-surface-secondary)]">
              <span className="text-sm text-[var(--color-text-secondary)]">{labels.targetCGPA}</span>
              <span className="text-lg font-bold text-[var(--color-text-primary)] font-mono">{targetCGPA}</span>
            </div>

            {requiredGPA !== null && feasibility && (
              <>
                <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-surface-secondary)]">
                  <span className="text-sm text-[var(--color-text-secondary)]">{labels.requiredGPA}</span>
                  <span className={`text-lg font-bold ${feasibility.color}`}>
                    {requiredGPA.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${feasibility.bg}`} />
                  <span className={`text-sm font-medium ${feasibility.color}`}>
                    {feasibility.label}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
