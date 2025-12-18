/**
 * Screen 3: Generate Screen
 * Schedule generation with blackout blocks and constraints
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Course, 
  BlackoutBlock, 
  Schedule, 
  PinnedSchedule,
  GenerationConstraints, 
  DEFAULT_CONSTRAINTS,
  DAYS,
  generateId,
  minutesToTime,
  timeToMinutes,
} from '../types';
import { generateSchedules, getSectionCombinationsCount } from '../utils';
import { loadPinnedSchedules, deletePinnedSchedule } from '../storage';
import { CourseSearchPicker, SelectedCourse } from './CourseSearchPicker';
import { getCatalog, initDB } from '../storage/indexeddb';
import { TimetableGrid } from './TimetableGrid';
import './GenerateScreen.css';

interface GenerateScreenProps {
  courses: Course[];
  onScheduleSelect: (schedule: Schedule) => void;
  onBack: () => void;
}

export const GenerateScreen: React.FC<GenerateScreenProps> = ({
  courses,
  onScheduleSelect,
  onBack,
}) => {
  // CRITICAL: Default to EMPTY selection (not all courses)
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [blackouts, setBlackouts] = useState<BlackoutBlock[]>([]);
  const [constraints, setConstraints] = useState<GenerationConstraints>(DEFAULT_CONSTRAINTS);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pinnedSchedules, setPinnedSchedules] = useState<PinnedSchedule[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'generated' | 'pinned'>('generated');
  
  // Initialize IndexedDB
  useEffect(() => {
    initDB().catch(err => console.error('Failed to init DB:', err));
  }, []);
  
  // Load pinned schedules
  useEffect(() => {
    loadPinnedSchedules().then(setPinnedSchedules);
  }, []);

  // Filter courses by selected course codes
  const coursesToGenerate = useMemo(() => {
    const selectedCodes = new Set(selectedCourses.map(sc => sc.courseCode));
    return courses.filter(c => selectedCodes.has(c.courseCode));
  }, [courses, selectedCourses]);
  
  // Combinations count
  const combinationsCount = useMemo(
    () => getSectionCombinationsCount(coursesToGenerate),
    [coursesToGenerate]
  );
  
  // Warn if too many combinations
  const isTooManyCombinations = combinationsCount > 100000;
  
  // Current selected schedule
  const currentSchedule = schedules[selectedIndex];
  
  // Toggle course selection
  const toggleCourse = useCallback((courseId: string) => {
    setSelectedCourseIds(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  }, []);
  
  // Add blackout block
  const addBlackout = useCallback(() => {
    const newBlackout: BlackoutBlock = {
      id: generateId(),
      label: 'New Block',
      day: 1, // Monday
      startMin: 9 * 60, // 9:00
      endMin: 10 * 60, // 10:00
      enabled: true,
    };
    setBlackouts(prev => [...prev, newBlackout]);
  }, []);
  
  // Update blackout
  const updateBlackout = useCallback((id: string, updates: Partial<BlackoutBlock>) => {
    setBlackouts(prev => prev.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ));
  }, []);
  
  // Delete blackout
  const deleteBlackout = useCallback((id: string) => {
    setBlackouts(prev => prev.filter(b => b.id !== id));
  }, []);
  
  // Generate schedules
  const handleGenerate = useCallback(() => {
    if (selectedCourses.length < 2) {
      alert('Please select at least 2 courses to generate schedules');
      return;
    }
    
    if (isTooManyCombinations) {
      const confirmed = confirm(
        `Warning: ${combinationsCount.toLocaleString()} possible combinations detected.\n\n` +
        `This may take a long time or freeze your browser.\n\n` +
        `Consider:\n` +
        `- Selecting fewer courses\n` +
        `- Locking specific sections\n` +
        `- Adding time constraints\n\n` +
        `Continue anyway?`
      );
      if (!confirmed) return;
    }
    
    setIsGenerating(true);
    setViewMode('generated');
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const results = generateSchedules(coursesToGenerate, blackouts, constraints);
      setSchedules(results);
      setSelectedIndex(0);
      setIsGenerating(false);
    }, 50);
  }, [coursesToGenerate, selectedCourses.length, blackouts, constraints, isTooManyCombinations, combinationsCount]);

  const handleUnpin = useCallback(async (id: string) => {
    await deletePinnedSchedule(id);
    setPinnedSchedules(prev => prev.filter(p => p.id !== id));
  }, []);
  
  // DON'T auto-generate - user must explicitly click Generate
  
  const activeSchedule = viewMode === 'generated' 
    ? schedules[selectedIndex] 
    : pinnedSchedules[selectedIndex]?.schedule;

  return (
    <div className="generate-screen">
      <div className="generate-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        
        <div className="generate-title">
          <h1>Generate Schedules</h1>
          <p>Configure options and find your perfect timetable</p>
        </div>
        
        <button 
          className="generate-button" 
          onClick={handleGenerate}
          disabled={isGenerating || selectedCourses.length < 2}
          title={selectedCourses.length < 2 ? 'Select at least 2 courses' : ''}
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      
      <div className="generate-layout">
        {/* Left sidebar: options */}
        <div className="generate-sidebar">
          {/* Pinned Schedules Section */}
          {pinnedSchedules.length > 0 && (
            <div className="sidebar-section">
              <h3>Pinned ({pinnedSchedules.length})</h3>
              <div className="pinned-list">
                {pinnedSchedules.map((pinned, idx) => (
                  <div 
                    key={pinned.id} 
                    className={`pinned-item ${viewMode === 'pinned' && selectedIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setViewMode('pinned');
                      setSelectedIndex(idx);
                    }}
                  >
                    <span className="pinned-name">{pinned.name}</span>
                    <button 
                      className="pinned-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnpin(pinned.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course selection - Search picker */}
          <div className="sidebar-section">
            <h3>Select Courses</h3>
            <CourseSearchPicker
              selectedCourses={selectedCourses}
              onCoursesChange={setSelectedCourses}
              maxCourses={10}
            />
            
            {isTooManyCombinations && (
              <div className="warning-box">
                ⚠️ {combinationsCount.toLocaleString()} combinations - may be slow!
              </div>
            )}
          </div>
          
          {/* Blackout blocks */}
          <div className="sidebar-section">
            <h3>Blocked Times</h3>
            <div className="blackout-list">
              {blackouts.map(blackout => (
                <div key={blackout.id} className="blackout-item">
                  <div className="blackout-header">
                    <input
                      type="checkbox"
                      checked={blackout.enabled}
                      onChange={(e) => updateBlackout(blackout.id, { enabled: e.target.checked })}
                    />
                    <input
                      type="text"
                      value={blackout.label}
                      onChange={(e) => updateBlackout(blackout.id, { label: e.target.value })}
                      className="blackout-label"
                      placeholder="Label"
                    />
                    <button 
                      className="blackout-delete"
                      onClick={() => deleteBlackout(blackout.id)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="blackout-time">
                    <select
                      value={blackout.day}
                      onChange={(e) => updateBlackout(blackout.id, { day: parseInt(e.target.value) })}
                    >
                      {DAYS.map((day, i) => (
                        <option key={day} value={i}>{day}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={minutesToTime(blackout.startMin)}
                      onChange={(e) => {
                        const mins = timeToMinutes(e.target.value);
                        if (mins !== null) updateBlackout(blackout.id, { startMin: mins });
                      }}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={minutesToTime(blackout.endMin)}
                      onChange={(e) => {
                        const mins = timeToMinutes(e.target.value);
                        if (mins !== null) updateBlackout(blackout.id, { endMin: mins });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="add-blackout-button" onClick={addBlackout}>
              + Add Blocked Time
            </button>
          </div>
          
          {/* Constraints */}
          <div className="sidebar-section">
            <h3>Preferences</h3>
            <label className="constraint-item">
              <input
                type="checkbox"
                checked={constraints.preferDayOff}
                onChange={(e) => setConstraints(prev => ({ ...prev, preferDayOff: e.target.checked }))}
              />
              Prefer more days off
            </label>
            <label className="constraint-item">
              <input
                type="checkbox"
                checked={constraints.preferFewerGaps}
                onChange={(e) => setConstraints(prev => ({ ...prev, preferFewerGaps: e.target.checked }))}
              />
              Minimize gaps between classes
            </label>
          </div>
        </div>
        
        {/* Main content: schedule preview */}
        <div className="generate-main">
          {isGenerating ? (
            <div className="generate-loading">
              <div className="spinner" />
              <p>Generating schedules...</p>
              <p className="loading-detail">Checking {combinationsCount.toLocaleString()} combinations</p>
            </div>
          ) : viewMode === 'generated' && schedules.length === 0 ? (
            <div className="generate-empty">
              <div className="empty-icon">📅</div>
              <h2>No valid schedules found</h2>
              <p>Try adjusting your blackout times or deselecting some courses</p>
            </div>
          ) : viewMode === 'pinned' && pinnedSchedules.length === 0 ? (
            <div className="generate-empty">
              <div className="empty-icon">📌</div>
              <h2>No pinned schedules</h2>
              <p>Generate a schedule and pin it to see it here</p>
            </div>
          ) : (
            <>
              {/* Schedule navigation */}
              <div className="schedule-nav">
                <button 
                  onClick={() => setSelectedIndex(i => Math.max(0, i - 1))}
                  disabled={selectedIndex === 0}
                >
                  ←
                </button>
                <span>
                  {viewMode === 'generated' ? 'Schedule' : 'Pinned'} {selectedIndex + 1} of {viewMode === 'generated' ? schedules.length : pinnedSchedules.length}
                </span>
                <button 
                  onClick={() => setSelectedIndex(i => Math.min((viewMode === 'generated' ? schedules.length : pinnedSchedules.length) - 1, i + 1))}
                  disabled={selectedIndex === (viewMode === 'generated' ? schedules.length : pinnedSchedules.length) - 1}
                >
                  →
                </button>
              </div>
              
              {/* Metrics */}
              {activeSchedule && (
                <div className="schedule-metrics">
                  <div className="metric">
                    <span className="metric-value">{activeSchedule.metrics.dayOffCount}</span>
                    <span className="metric-label">Days off</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{Math.round(activeSchedule.metrics.totalGapMinutes / 60)}h</span>
                    <span className="metric-label">Gap time</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{minutesToTime(activeSchedule.metrics.earliestStart)}</span>
                    <span className="metric-label">Earliest</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{minutesToTime(activeSchedule.metrics.latestEnd)}</span>
                    <span className="metric-label">Latest</span>
                  </div>
                </div>
              )}
              
              {/* Timetable preview */}
              {activeSchedule && (
                <TimetableGrid schedule={activeSchedule} />
              )}
              
              {/* Select button */}
              <button 
                className="select-schedule-button"
                onClick={() => activeSchedule && onScheduleSelect(activeSchedule)}
              >
                {viewMode === 'generated' ? 'Use This Schedule' : 'Use Pinned Schedule'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateScreen;
