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
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {/* Title */}
      <h3 className="text-lg font-medium text-[var(--color-text-tertiary)] mb-0">
        {title}
      </h3>
    </div>
  );
}
