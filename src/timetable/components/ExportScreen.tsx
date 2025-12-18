/**
 * Screen 4: Export Screen
 * Export and pin final schedule
 */

import React, { useState, useCallback } from 'react';
import { Schedule, PinnedSchedule, generateId } from '../types';
import { TimetableGrid } from './TimetableGrid';
import { downloadICS, downloadPNG, downloadJSON } from '../export';
import { savePinnedSchedule, loadPinnedSchedules, deletePinnedSchedule } from '../storage';
import './ExportScreen.css';

interface ExportScreenProps {
  schedule: Schedule;
  onBack: () => void;
  onStartOver: () => void;
}

export const ExportScreen: React.FC<ExportScreenProps> = ({
  schedule,
  onBack,
  onStartOver,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [pinnedName, setPinnedName] = useState('My Timetable');
  const [isPinned, setIsPinned] = useState(false);
  
  // Export handlers
  const handleExportICS = useCallback(async () => {
    setIsExporting(true);
    setExportStatus('Generating calendar file...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      downloadICS(schedule, 'timetable.ics');
      setExportStatus('✓ Calendar downloaded!');
    } catch (err) {
      setExportStatus('Failed to export calendar');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  }, [schedule]);
  
  const handleExportPNG = useCallback(async () => {
    setIsExporting(true);
    setExportStatus('Generating image...');
    
    try {
      await downloadPNG(schedule, 'timetable.png');
      setExportStatus('✓ Image downloaded!');
    } catch (err) {
      setExportStatus('Failed to export image');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  }, [schedule]);
  
  const handleExportJSON = useCallback(() => {
    setIsExporting(true);
    setExportStatus('Generating JSON...');
    
    try {
      downloadJSON(schedule, 'timetable.json');
      setExportStatus('✓ JSON downloaded!');
    } catch (err) {
      setExportStatus('Failed to export JSON');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  }, [schedule]);
  
  // Pin schedule
  const handlePin = useCallback(async () => {
    const pinned: PinnedSchedule = {
      id: generateId(),
      name: pinnedName,
      createdAt: Date.now(),
      schedule,
    };
    
    await savePinnedSchedule(pinned);
    setIsPinned(true);
  }, [schedule, pinnedName]);
  
  return (
    <div className="export-screen">
      <div className="export-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        
        <div className="export-title">
          <h1>Your Timetable</h1>
          <p>Export or save your schedule</p>
        </div>
        
        <button className="start-over-button" onClick={onStartOver}>
          Start Over
        </button>
      </div>
      
      <div className="export-layout">
        {/* Main content: timetable */}
        <div className="export-main">
          <TimetableGrid schedule={schedule} />
          
          {/* Course list */}
          <div className="schedule-courses">
            <h3>Enrolled Courses</h3>
            <div className="courses-grid">
              {schedule.selections.map((selection, i) => (
                <div key={selection.courseId} className="course-card">
                  <div className="course-color" style={{ backgroundColor: getColor(i) }} />
                  <div className="course-info">
                    <span className="course-code">{selection.courseCode}</span>
                    <span className="course-section">{selection.sectionLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar: export options */}
        <div className="export-sidebar">
          {/* Export status */}
          {exportStatus && (
            <div className={`export-status ${exportStatus.startsWith('✓') ? 'success' : ''}`}>
              {exportStatus}
            </div>
          )}
          
          {/* Export buttons */}
          <div className="export-section">
            <h3>Export</h3>
            
            <button 
              className="export-button ics"
              onClick={handleExportICS}
              disabled={isExporting}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div className="export-button-text">
                <span className="export-button-title">Calendar (ICS)</span>
                <span className="export-button-desc">Add to Apple Calendar, Google Calendar, Outlook</span>
              </div>
            </button>
            
            <button 
              className="export-button png"
              onClick={handleExportPNG}
              disabled={isExporting}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <div className="export-button-text">
                <span className="export-button-title">Image (PNG)</span>
                <span className="export-button-desc">Share on social media or print</span>
              </div>
            </button>
            
            <button 
              className="export-button json"
              onClick={handleExportJSON}
              disabled={isExporting}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16,18 22,12 16,6"/>
                <polyline points="8,6 2,12 8,18"/>
              </svg>
              <div className="export-button-text">
                <span className="export-button-title">Data (JSON)</span>
                <span className="export-button-desc">For developers and backup</span>
              </div>
            </button>
          </div>
          
          {/* Pin section */}
          <div className="export-section">
            <h3>Save to Pinned</h3>
            
            {isPinned ? (
              <div className="pinned-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <span>Saved to pinned schedules!</span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={pinnedName}
                  onChange={(e) => setPinnedName(e.target.value)}
                  placeholder="Schedule name"
                  className="pin-name-input"
                />
                <button className="pin-button" onClick={handlePin}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  Pin This Schedule
                </button>
              </>
            )}
          </div>
          
          {/* Summary */}
          <div className="export-section summary">
            <h3>Summary</h3>
            <div className="summary-stats">
              <div className="summary-row">
                <span>Courses</span>
                <span>{schedule.selections.length}</span>
              </div>
              <div className="summary-row">
                <span>Days off</span>
                <span>{schedule.metrics.dayOffCount}</span>
              </div>
              <div className="summary-row">
                <span>Gap time</span>
                <span>{Math.round(schedule.metrics.totalGapMinutes / 60)}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Color helper
function getColor(index: number): string {
  const colors = ['#007AFF', '#34C759', '#FF3B30', '#FFCC00', '#AF52DE', '#FF9500', '#5AC8FA', '#FF2D55'];
  return colors[index % colors.length];
}

export default ExportScreen;
