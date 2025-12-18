import React from 'react';
import { AppleEmoji } from '../AppleEmoji';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Premium Empty State Component
 * Follows Apple HIG - informative, actionable, visually balanced
 */
export function EmptyState({
  icon = '📭',
  title,
  description,
  primaryAction,
  secondaryAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {/* Icon */}
      <div className="mb-6 p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)]">
        <AppleEmoji emoji={icon} className="w-12 h-12" />
      </div>
      
      {/* Title */}
      <h3 className="text-[var(--text-h3)] font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className="text-[var(--text-body)] text-[var(--color-text-tertiary)] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      
      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="btn btn-primary"
            >
              {primaryAction.label}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="btn btn-ghost text-[var(--color-text-tertiary)]"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton Loader Components
 */
export function SkeletonText({ lines = 1, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="skeleton skeleton-circle w-12 h-12" />
        <div className="flex-1 space-y-2">
          <div className="skeleton skeleton-text w-1/3 h-4" />
          <div className="skeleton skeleton-text w-1/2 h-3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-secondary)]">
        <div className="flex gap-4">
          <div className="skeleton skeleton-text w-1/4 h-4" />
          <div className="skeleton skeleton-text w-1/6 h-4" />
          <div className="skeleton skeleton-text w-1/6 h-4" />
          <div className="skeleton skeleton-text w-1/6 h-4" />
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-[var(--color-border-primary)] last:border-0">
          <div className="flex items-center gap-4">
            <div className="skeleton skeleton-text flex-1 h-4" />
            <div className="skeleton skeleton-text w-16 h-6 rounded-[var(--radius-sm)]" />
            <div className="skeleton skeleton-text w-12 h-4" />
            <div className="skeleton skeleton-text w-12 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonInsightPanel() {
  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="skeleton skeleton-text w-24 h-5" />
        <div className="skeleton skeleton-text w-16 h-8 rounded-[var(--radius-md)]" />
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-secondary)]">
          <div className="skeleton skeleton-text w-20 h-3 mb-2" />
          <div className="skeleton skeleton-text w-24 h-8" />
        </div>
        
        <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-secondary)]">
          <div className="skeleton skeleton-text w-20 h-3 mb-2" />
          <div className="skeleton skeleton-text w-full h-2 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Error State Component
 */
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  lang?: string;
}

export function ErrorState({ 
  title, 
  message, 
  onRetry,
  lang = 'EN'
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6 p-4 rounded-[var(--radius-xl)] bg-[var(--color-error-subtle)]">
        <AppleEmoji emoji="⚠️" className="w-12 h-12" />
      </div>
      
      <h3 className="text-[var(--text-h3)] font-semibold text-[var(--color-text-primary)] mb-2">
        {title || (lang === 'EN' ? 'Something went wrong' : '出現錯誤')}
      </h3>
      
      <p className="text-[var(--text-body)] text-[var(--color-text-tertiary)] max-w-sm mb-6">
        {message}
      </p>
      
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          {lang === 'EN' ? 'Try Again' : '重試'}
        </button>
      )}
    </div>
  );
}

/**
 * Success State Component
 */
interface SuccessStateProps {
  title: string;
  message?: string;
  onDismiss?: () => void;
}

export function SuccessState({ title, message, onDismiss }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-scale-in">
      <div className="mb-4 p-4 rounded-full bg-[var(--color-success-subtle)]">
        <AppleEmoji emoji="✅" className="w-10 h-10" />
      </div>
      
      <h3 className="text-[var(--text-h3)] font-semibold text-[var(--color-success)] mb-1">
        {title}
      </h3>
      
      {message && (
        <p className="text-[var(--text-body)] text-[var(--color-text-tertiary)] max-w-sm">
          {message}
        </p>
      )}
      
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="mt-4 btn btn-ghost"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

export default EmptyState;
