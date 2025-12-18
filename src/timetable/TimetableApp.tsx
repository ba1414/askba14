/**
 * Timetable Generator - Main App Component
 * Premium university timetable scheduling tool
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  AppScreen,
  RawMeetingRow,
  Course,
  Schedule,
  ParseResult,
} from './types';
import { normalizeToCourses } from './utils';
import { loadRawRows, saveRawRows, loadCourses, saveCourses } from './storage';
import {
  ImportScreen,
  ReviewScreen,
  GenerateScreen,
  ExportScreen,
} from './components';
import './TimetableApp.css';

export const TimetableApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('import');
  const [rawRows, setRawRows] = useState<RawMeetingRow[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Load persisted data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedRows, savedCourses] = await Promise.all([
          loadRawRows(),
          loadCourses(),
        ]);
        
        if (savedRows.length > 0) {
          setRawRows(savedRows);
          if (savedCourses.length > 0) {
            setCourses(savedCourses);
            setCurrentScreen('generate');
          } else {
            setCurrentScreen('review');
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    
    loadData();
  }, []);
  
  // Import complete handler
  const handleImportComplete = useCallback((rows: RawMeetingRow[], result: ParseResult, debug?: any) => {
    setRawRows(rows);
    setDebugInfo(debug || null);
    saveRawRows(rows);
    setCurrentScreen('review');
  }, []);
  
  // Review continue handler
  const handleReviewContinue = useCallback((rows: RawMeetingRow[], normalizedCourses: Course[]) => {
    setRawRows(rows);
    setCourses(normalizedCourses);
    saveRawRows(rows);
    saveCourses(normalizedCourses);
    setCurrentScreen('generate');
  }, []);
  
  // Schedule select handler
  const handleScheduleSelect = useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setCurrentScreen('export');
  }, []);
  
  // Navigation handlers
  const goToImport = useCallback(() => {
    setCurrentScreen('import');
  }, []);
  
  const goToReview = useCallback(() => {
    setCurrentScreen('review');
  }, []);
  
  const goToGenerate = useCallback(() => {
    setCurrentScreen('generate');
  }, []);
  
  const startOver = useCallback(() => {
    setRawRows([]);
    setCourses([]);
    setSelectedSchedule(null);
    setCurrentScreen('import');
  }, []);
  
  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'import':
        return (
          <ImportScreen onImportComplete={handleImportComplete} />
        );
        
      case 'review':
        return (
          <ReviewScreen
            initialRows={rawRows}
            debugInfo={debugInfo}
            onContinue={handleReviewContinue}
            onBack={goToImport}
          />
        );
        
      case 'generate':
        return (
          <GenerateScreen
            courses={courses}
            onScheduleSelect={handleScheduleSelect}
            onBack={goToReview}
          />
        );
        
      case 'export':
        return selectedSchedule ? (
          <ExportScreen
            schedule={selectedSchedule}
            onBack={goToGenerate}
            onStartOver={startOver}
          />
        ) : null;
        
      default:
        return null;
    }
  };
  
  return (
    <div className="timetable-app">
      {/* Progress indicator */}
      <div className="progress-steps">
        <div className={`step ${currentScreen === 'import' ? 'active' : rawRows.length > 0 ? 'complete' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Import</span>
        </div>
        <div className="step-connector" />
        <div className={`step ${currentScreen === 'review' ? 'active' : courses.length > 0 ? 'complete' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Review</span>
        </div>
        <div className="step-connector" />
        <div className={`step ${currentScreen === 'generate' ? 'active' : selectedSchedule ? 'complete' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Generate</span>
        </div>
        <div className="step-connector" />
        <div className={`step ${currentScreen === 'export' ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Export</span>
        </div>
      </div>
      
      {/* Screen content */}
      <div className="app-content">
        {renderScreen()}
      </div>
    </div>
  );
};

export default TimetableApp;
