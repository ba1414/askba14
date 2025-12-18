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
    if (required > maxGPA) return { label: labels.feasibility.impossible, color: 'var(--color-error)', progress: 100 };
    if (required > maxGPA - 0.3) return { label: labels.feasibility.hard, color: 'var(--color-warning)', progress: 85 };
    if (required > maxGPA - 0.7) return { label: labels.feasibility.medium, color: '#FFD60A', progress: 65 };
    return { label: labels.feasibility.easy, color: 'var(--color-success)', progress: 40 };
  };

  const feasibility = getFeasibility(requiredGPA);

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* This Semester GPA - Hero Card */}
      <div className="card p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--color-primary)]/10 to-transparent rounded-bl-[100px]" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-primary-subtle)]">
              <AppleEmoji emoji="📊" className="w-4 h-4" />
            </div>
            <span className="text-[var(--text-label)] text-[var(--color-text-tertiary)]">
              {labels.semesterGPA}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-[3rem] font-bold text-[var(--color-text-primary)] font-mono tracking-tight leading-none">
              {thisSemGPA.toFixed(2)}
            </span>
            <span className="text-[var(--text-h4)] text-[var(--color-text-quaternary)]">
              / {maxGPA.toFixed(1)}
            </span>
          </div>
          
          <div className="mt-3 flex items-center gap-2 text-[var(--text-body-sm)] text-[var(--color-text-tertiary)]">
            <span>{thisSemCredits}</span>
            <span>{labels.semCredits}</span>
          </div>
        </div>
      </div>

      {/* Cumulative Progress */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-info-subtle)]">
            <TrendingUp size={14} className="text-[var(--color-info)]" />
          </div>
          <span className="text-[var(--text-label)] text-[var(--color-text-tertiary)]">
            {labels.cumulativeProgress}
          </span>
        </div>
        
        <div className="space-y-4">
          {/* Current CGPA */}
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-body-sm)] text-[var(--color-text-secondary)]">
              {labels.currentCGPA}
            </span>
            <span className="text-[var(--text-h3)] font-bold text-[var(--color-text-primary)] font-mono">
              {currentCGPA || '—'}
            </span>
          </div>
          
          {/* Projected CGPA */}
          {projectedCGPA !== null && (
            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-primary-subtle)] border border-[var(--color-primary)]/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[var(--text-caption)] text-[var(--color-primary)] font-medium">
                  {labels.afterSemester}
                </span>
                <Sparkles size={14} className="text-[var(--color-primary)]" />
              </div>
              <span className="text-[var(--text-h2)] font-bold text-[var(--color-primary)] font-mono">
                {projectedCGPA.toFixed(2)}
              </span>
            </div>
          )}
          
          {/* Progress Bar */}
          {currentCGPA && (
            <div className="space-y-2">
              <div className="flex justify-between text-[var(--text-micro)] text-[var(--color-text-quaternary)]">
                <span>0.00</span>
                <span>{maxGPA.toFixed(1)}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-surface-tertiary)] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-info)] transition-all duration-500"
                  style={{ width: `${Math.min((parseFloat(currentCGPA) / maxGPA) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goal Tracking */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-success-subtle)]">
            <Target size={14} className="text-[var(--color-success)]" />
          </div>
          <span className="text-[var(--text-label)] text-[var(--color-text-tertiary)]">
            {labels.goalTracking}
          </span>
        </div>

        <div className="space-y-4">
          {/* Target CGPA */}
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-body-sm)] text-[var(--color-text-secondary)]">
              {labels.targetCGPA}
            </span>
            <span className="text-[var(--text-h4)] font-semibold text-[var(--color-text-primary)] font-mono">
              {targetCGPA || '—'}
            </span>
          </div>

          {/* Required GPA */}
          {requiredGPA !== null && feasibility && (
            <div 
              className="p-4 rounded-[var(--radius-lg)] border"
              style={{ 
                backgroundColor: `color-mix(in srgb, ${feasibility.color} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${feasibility.color} 30%, transparent)`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--text-caption)] font-medium" style={{ color: feasibility.color }}>
                  {labels.requiredGPA}
                </span>
                <span 
                  className="px-2 py-0.5 rounded-[var(--radius-sm)] text-[var(--text-micro)] font-bold"
                  style={{ 
                    backgroundColor: `color-mix(in srgb, ${feasibility.color} 20%, transparent)`,
                    color: feasibility.color
                  }}
                >
                  {feasibility.label}
                </span>
              </div>
              
              <span 
                className="text-[var(--text-h2)] font-bold font-mono"
                style={{ color: feasibility.color }}
              >
                {requiredGPA.toFixed(2)}
              </span>
              
              {/* Difficulty gauge */}
              <div className="mt-3 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${feasibility.progress}%`,
                    backgroundColor: feasibility.color
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsightPanel;
