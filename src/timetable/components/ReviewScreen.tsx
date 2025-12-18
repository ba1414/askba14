/**
 * Screen 2: Review & Fix Screen
 * Edit and validate imported data
 */

import React, { useState, useCallback, useMemo } from 'react';
import { RawMeetingRow, Course, DAYS, generateId } from '../types';
import { normalizeToCourses, validateRow } from '../utils';
import { DebugPanel, DebugInfo } from './DebugPanel';
import './ReviewScreen.css';

interface ReviewScreenProps {
  initialRows: RawMeetingRow[];
  debugInfo?: DebugInfo | null;
  onContinue: (rows: RawMeetingRow[], courses: Course[]) => void;
  onBack: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  initialRows,
  debugInfo,
  onContinue,
  onBack,
}) => {
  const [rows, setRows] = useState<RawMeetingRow[]>(initialRows);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Stats
  const validCount = useMemo(() => rows.filter(r => r.isValid).length, [rows]);
  const invalidCount = useMemo(() => rows.filter(r => !r.isValid).length, [rows]);
  const needsFixingCount = useMemo(() => rows.filter(r => r.status === 'needs-fixing').length, [rows]);
  
  // Count unique courses and options
  const uniqueCourses = useMemo(() => {
    const codes = new Set(rows.filter(r => r.isValid).map(r => r.courseCode));
    return codes.size;
  }, [rows]);
  
  const uniqueOptions = useMemo(() => {
    const options = new Set(rows.filter(r => r.isValid).map(r => `${r.courseCode}:${r.section}`));
    return options.size;
  }, [rows]);
  
  // Preview normalized courses
  const courses = useMemo(() => normalizeToCourses(rows), [rows]);
  
  const handleEdit = useCallback((id: string, field: keyof RawMeetingRow, value: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== id) return row;
      
      const updated = { ...row, [field]: value };
      // Re-validate
      return validateRow(updated);
    }));
  }, []);
  
  const handleDelete = useCallback((id: string) => {
    setRows(prev => prev.filter(row => row.id !== id));
  }, []);
  
  const handleAddRow = useCallback(() => {
    const newRow = validateRow({
      id: generateId(),
      courseCode: '',
      section: '',
      type: '',
      day: '',
      startTime: '',
      endTime: '',
      location: '',
    });
    setRows(prev => [...prev, newRow]);
    setEditingId(newRow.id);
  }, []);
  
  const handleContinue = useCallback(() => {
    if (validCount > 0) {
      onContinue(rows, courses);
    }
  }, [rows, courses, validCount, onContinue]);
  
  return (
    <div className="review-screen">
      <div className="review-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        
        <div className="review-title">
          <h1>Review & Fix</h1>
          <p>Verify your imported data and fix any errors</p>
        </div>
        
        <button 
          className="continue-button" 
          onClick={handleContinue}
          disabled={validCount === 0}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="review-stats">
        <div className="stat valid">
          <span className="stat-value">{validCount}</span>
          <span className="stat-label">Valid entries</span>
        </div>
        <div className="stat invalid">
          <span className="stat-value">{invalidCount}</span>
          <span className="stat-label">Need fixing</span>
        </div>
        <div className="stat courses">
          <span className="stat-value">{uniqueCourses}</span>
          <span className="stat-label">Courses detected</span>
        </div>
        <div className="stat options">
          <span className="stat-value">{uniqueOptions}</span>
          <span className="stat-label">Class options</span>
        </div>
      </div>

      <DebugPanel
        debugInfo={debugInfo || null}
        validCount={validCount}
        uniqueCourses={uniqueCourses}
        uniqueOptions={uniqueOptions}
      />
      
      <div className="review-table-container">
        <table className="review-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Course Code</th>
              <th>Section</th>
              <th>Type</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={row.isValid ? 'valid' : 'invalid'}>
                <td className="status-cell">
                  {row.isValid ? (
                    <span className="status-icon valid" title="Valid">✓</span>
                  ) : (
                    <span className="status-icon invalid" title={row.errors.join('\n')}>!</span>
                  )}
                </td>
                <td>
                  <input
                    type="text"
                    value={row.courseCode}
                    onChange={(e) => handleEdit(row.id, 'courseCode', e.target.value)}
                    placeholder="COMP1010"
                    className={!row.courseCode ? 'error' : ''}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.section}
                    onChange={(e) => handleEdit(row.id, 'section', e.target.value)}
                    placeholder="L1"
                    className={!row.section ? 'error' : ''}
                  />
                </td>
                <td>
                  <select
                    value={row.type}
                    onChange={(e) => handleEdit(row.id, 'type', e.target.value)}
                  >
                    <option value="">—</option>
                    <option value="LEC">Lecture</option>
                    <option value="TUT">Tutorial</option>
                    <option value="LAB">Lab</option>
                    <option value="SEM">Seminar</option>
                    <option value="OTHER">Other</option>
                  </select>
                </td>
                <td>
                  <select
                    value={row.day}
                    onChange={(e) => handleEdit(row.id, 'day', e.target.value)}
                    className={!row.day ? 'error' : ''}
                  >
                    <option value="">Select</option>
                    {DAYS.map((day, i) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={row.startTime}
                    onChange={(e) => handleEdit(row.id, 'startTime', e.target.value)}
                    placeholder="09:00"
                    className={!row.startTime ? 'error' : ''}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.endTime}
                    onChange={(e) => handleEdit(row.id, 'endTime', e.target.value)}
                    placeholder="10:00"
                    className={!row.endTime ? 'error' : ''}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.location}
                    onChange={(e) => handleEdit(row.id, 'location', e.target.value)}
                    placeholder="Room 101"
                  />
                </td>
                <td className="actions-cell">
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(row.id)}
                    title="Delete row"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button className="add-row-button" onClick={handleAddRow}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Add Entry
      </button>
      
      {invalidCount > 0 && (
        <div className="review-errors">
          <h3>Errors to Fix</h3>
          <ul>
            {rows.filter(r => !r.isValid).map(row => (
              <li key={row.id}>
                <strong>{row.courseCode || 'Unknown'} {row.section}:</strong> {row.errors.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewScreen;
