import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Copy, GripVertical, ChevronDown } from 'lucide-react';

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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
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
      e.preventDefault();
      cancelEditing();
    } else if (e.key === 'Tab') {
      // Navigate to next editable cell
      // TODO: Implement tab navigation
    }
  }, [saveEditing, cancelEditing]);

  const renderCell = (row: T, column: Column<T>, rowIndex: number) => {
    const value = (row as any)[column.key];
    const isEditing = editingCell?.rowId === row.id && editingCell?.columnKey === column.key;

    // Custom renderer - wrap in button if editable
    if (column.render && !isEditing) {
      const rendered = column.render(value, row, rowIndex);
      if (column.editable) {
        return (
          <button
            onClick={() => startEditing(row.id, column.key as string, value)}
            className="w-full h-9 flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--color-surface-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30 transition-colors duration-[var(--duration-fast)]"
          >
            {rendered}
          </button>
        );
      }
      return rendered;
    }

    // Editing state
    if (isEditing && column.editable) {
      if (column.type === 'select' && column.options) {
        const filteredOptions = column.options.filter(opt => 
          opt.value.toLowerCase().includes(editValue.toLowerCase())
        );
        
        return (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Use first filtered option or keep current value
                  const target = filteredOptions[0]?.value || editValue;
                  onUpdate(row.id, column.key as string, target);
                  cancelEditing();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEditing();
                } else if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
                  e.preventDefault();
                  setEditValue(filteredOptions[0].value);
                }
              }}
              placeholder="Type or click below..."
              className="w-full h-9 px-3 rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] border-2 border-[var(--color-primary)] text-[var(--text-body-sm)] text-center font-semibold focus:outline-none uppercase"
              autoFocus
            />
            
            {/* Dropdown with clickable options */}
            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-[var(--color-bg-elevated)] border border-[var(--color-border-primary)] rounded-[var(--radius-md)] shadow-lg z-50">
              {filteredOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onUpdate(row.id, column.key as string, opt.value);
                    cancelEditing();
                  }}
                  className="w-full px-3 py-2 text-center text-[var(--text-body-sm)] font-semibold hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  {opt.label}
                </button>
              ))}
              {filteredOptions.length === 0 && editValue && (
                <div className="px-3 py-2 text-center text-[var(--text-body-sm)] text-[var(--color-text-tertiary)]">
                  No matches
                </div>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="relative">
          <input
            ref={inputRef}
            type={column.type === 'number' ? 'number' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEditing}
            onKeyDown={handleKeyDown}
            className={`
              w-full h-9 px-3 rounded-[var(--radius-md)] 
              bg-[var(--color-bg-elevated)] 
              border-2 ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-primary)]'}
              text-[var(--text-body-sm)] 
              focus:outline-none
              ${column.type === 'number' ? 'text-right font-mono' : ''}
            `}
          />
          {error && (
            <div className="absolute top-full left-0 mt-1 px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--color-error)] text-white text-[var(--text-micro)] whitespace-nowrap z-10">
              {error}
            </div>
          )}
        </div>
      );
    }

    // Display state (clickable if editable)
    if (column.editable) {
      return (
        <button
          onClick={() => startEditing(row.id, column.key as string, value)}
          className={`
            w-full h-9 px-3 rounded-[var(--radius-md)] 
            text-left text-[var(--text-body-sm)]
            ${value ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-quaternary)]'}
            hover:bg-[var(--color-surface-secondary)]
            focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30
            transition-colors duration-[var(--duration-fast)]
            ${column.type === 'number' ? 'text-right font-mono' : ''}
          `}
        >
          {value || '—'}
        </button>
      );
    }

    // Non-editable display
    return (
      <span className={`
        text-[var(--text-body-sm)] text-[var(--color-text-primary)]
        ${column.type === 'number' ? 'font-mono' : ''}
      `}>
        {value ?? '—'}
      </span>
    );
  };

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="bg-[var(--color-surface-secondary)] border-b border-[var(--color-border-primary)]">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`
                    h-[var(--table-header-height)] px-4
                    text-[var(--text-label)] text-[var(--color-text-tertiary)]
                    font-semibold
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
              {(onDelete || onDuplicate) && (
                <th className="w-24 px-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`
                  border-b border-[var(--color-border-primary)] last:border-0
                  transition-colors duration-[var(--duration-fast)]
                  ${hoveredRow === row.id ? 'bg-[var(--color-surface-secondary)]' : ''}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className={`
                      h-[var(--table-row-height)] px-4
                      ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                    `}
                  >
                    {renderCell(row, column, rowIndex)}
                  </td>
                ))}

                {/* Row Actions */}
                {(onDelete || onDuplicate) && (
                  <td className="px-4">
                    <div className={`
                      flex items-center justify-end gap-1
                      transition-opacity duration-[var(--duration-fast)]
                      ${hoveredRow === row.id ? 'opacity-100' : 'opacity-0'}
                    `}>
                      {onDuplicate && (
                        <button
                          onClick={() => onDuplicate(row.id)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-quaternary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-tertiary)] transition-colors"
                          aria-label="Duplicate row"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-quaternary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-subtle)] transition-colors"
                          aria-label="Delete row"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  if (!grade) return <span className="text-[var(--color-text-quaternary)]">—</span>;

  let colorClasses = 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)]';
  
  if (grade.startsWith('A')) {
    colorClasses = 'bg-[var(--color-grade-a-bg)] text-[var(--color-grade-a)]';
  } else if (grade.startsWith('B')) {
    colorClasses = 'bg-[var(--color-grade-b-bg)] text-[var(--color-grade-b)]';
  } else if (grade.startsWith('C')) {
    colorClasses = 'bg-[var(--color-grade-c-bg)] text-[var(--color-grade-c)]';
  } else if (grade === 'D' || grade === 'F') {
    colorClasses = 'bg-[var(--color-grade-d-bg)] text-[var(--color-grade-d)]';
  }

  return (
    <span className={`
      inline-flex items-center justify-center
      px-2.5 py-1 rounded-[var(--radius-sm)]
      text-[var(--text-label)] font-bold
      ${colorClasses}
      ${className}
    `}>
      {grade}
    </span>
  );
}

export default DataTable;
