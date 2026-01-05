import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Copy, ChevronDown } from 'lucide-react';

/**
 * Premium Data Table Component
 * Apple-quality inline editing with keyboard navigation
 */

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  editable?: boolean;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  validate?: (value: any) => string | null; // returns error message or null
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onUpdate: (id: string, key: string, value: any) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  emptyState?: React.ReactNode;
  stickyHeader?: boolean;
  className?: string;
}

interface EditingCell {
  rowId: string;
  columnKey: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onUpdate,
  onDelete,
  onDuplicate,
  emptyState,
  stickyHeader = true,
  className = ''
}: DataTableProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const startEditing = useCallback((rowId: string, columnKey: string, currentValue: any) => {
    setEditingCell({ rowId, columnKey });
    setEditValue(String(currentValue ?? ''));
    setError(null);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
    setError(null);
  }, []);

  const saveEditing = useCallback(() => {
    if (!editingCell) return;

    const column = columns.find(c => c.key === editingCell.columnKey);
    
    // Validate if validator exists
    if (column?.validate) {
      const validationError = column.validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Convert value based on type
    let finalValue: any = editValue;
    if (column?.type === 'number') {
      finalValue = parseFloat(editValue) || 0;
    }

    onUpdate(editingCell.rowId, editingCell.columnKey, finalValue);
    cancelEditing();
  }, [editingCell, editValue, columns, onUpdate, cancelEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  }, [saveEditing, cancelEditing]);

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  // Find columns for specific fields
  const nameCol = columns.find(c => c.key === 'name');
  const creditsCol = columns.find(c => c.key === 'credits');
  const gradeCol = columns.find(c => c.key === 'grade');

  return (
    <div className={`bg-[var(--color-bg-elevated)] rounded-[20px] overflow-hidden border border-[var(--color-border-primary)] ${className}`}>
      {data.map((row, rowIndex) => {
        const isLast = rowIndex === data.length - 1;
        
        return (
          <div 
            key={row.id}
            className={`
              h-[72px] flex items-center justify-between px-4 
              ${!isLast ? 'border-b border-[var(--color-border-primary)]' : ''}
            `}
          >
            {/* Left Side: Name & Credits */}
            <div className="flex flex-col justify-center flex-1 min-w-0 mr-4">
              {/* Course Name Input */}
              <input
                type="text"
                value={(row as any).name}
                onChange={(e) => onUpdate(row.id, 'name', e.target.value)}
                className="font-bold text-[var(--color-text-primary)] bg-transparent border-none p-0 focus:ring-0 text-base w-full truncate placeholder-[var(--color-text-quaternary)]"
                placeholder="Course Name"
              />
              
              {/* Credits Input */}
              <div className="flex items-center gap-1 mt-0.5">
                <input
                  type="number"
                  value={(row as any).credits}
                  onChange={(e) => onUpdate(row.id, 'credits', parseFloat(e.target.value) || 0)}
                  className="text-sm text-[var(--color-text-tertiary)] bg-transparent border-none p-0 focus:ring-0 w-8"
                  min="0"
                  max="10"
                />
                <span className="text-sm text-[var(--color-text-tertiary)]">Credits</span>
              </div>
            </div>

            {/* Right Side: Grade Selector & Actions */}
            <div className="flex items-center gap-3">
              {/* Grade Selector Button */}
              <div className="relative">
                <select
                  value={(row as any).grade}
                  onChange={(e) => onUpdate(row.id, 'grade', e.target.value)}
                  className="appearance-none bg-[var(--color-surface-secondary)] text-[var(--color-text-primary)] font-medium px-4 py-2 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-colors"
                >
                  {gradeCol?.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none" />
              </div>

              {/* Delete Action */}
              {onDelete && (
                <button
                  onClick={() => onDelete(row.id)}
                  className="p-2 text-[var(--color-text-quaternary)] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Grade Badge Component for GPA Table
 */
interface GradeBadgeProps {
  grade: string;
  className?: string;
}

export function GradeBadge({ grade, className = '' }: GradeBadgeProps) {
  if (!grade) return <span className="text-[var(--color-text-tertiary)]">—</span>;

  let colorClasses = 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]';
  
  if (grade.startsWith('A')) {
    colorClasses = 'bg-[var(--color-grade-a-bg)] text-[var(--color-grade-a)]';
  } else if (grade.startsWith('B')) {
    colorClasses = 'bg-[var(--color-grade-b-bg)] text-[var(--color-text-primary)]';
  } else if (grade.startsWith('C')) {
    colorClasses = 'bg-[var(--color-grade-c-bg)] text-[var(--color-grade-c)]';
  } else if (grade === 'D' || grade === 'F') {
    colorClasses = 'bg-[var(--color-grade-d-bg)] text-[var(--color-grade-d)]';
  }

  return (
    <span className={`
      inline-flex items-center justify-center
      px-3 py-1 rounded-full
      text-xs font-bold
      ${colorClasses}
      ${className}
    `}>
      {grade}
    </span>
  );
}

export default DataTable;
