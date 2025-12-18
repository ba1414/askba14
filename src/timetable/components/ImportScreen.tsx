/**
 * Screen 1: Import Screen
 * File upload and initial parsing
 */

import React, { useState, useCallback } from 'react';
import { FileDropZone } from './FileDropZone';
import { parseFile, parseFromClipboard, ProgressCallback } from '../parsers';
import { ParseResult, RawMeetingRow } from '../types';
import { DEMO_ROWS } from '../demo-data';
import { buildCatalogFromRows, saveCatalog, saveMeetings, rowsToMeetings } from '../storage/indexeddb';
import './ImportScreen.css';

interface ImportScreenProps {
  onImportComplete: (rows: RawMeetingRow[], result: ParseResult, debugInfo?: any) => void;
}

export const ImportScreen: React.FC<ImportScreenProps> = ({ onImportComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [stage, setStage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleProgress: ProgressCallback = useCallback((p, s) => {
    setProgress(p);
    setStage(s);
  }, []);
  
  const handleFileDrop = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setStage('Starting...');
    
    try {
      const result = await parseFile(file, handleProgress);
      
      if (result.errors.length > 0 && !result.success) {
        setError(result.errors.join('\n'));
        setIsProcessing(false);
        return;
      }
      
      // Populate IndexedDB for search functionality
      setStage('Building course catalog...');
      const catalog = buildCatalogFromRows(result.rows);
      await saveCatalog(catalog);
      
      setStage('Saving meeting data...');
      const meetings = rowsToMeetings(result.rows);
      await saveMeetings(meetings);
      
      setProgress(100);
      onImportComplete(result.rows, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsProcessing(false);
    }
  }, [handleProgress, onImportComplete]);
  
  const handleTextPaste = useCallback(async (text: string) => {
    setIsProcessing(true);
    setError(null);
    setProgress(50);
    setStage('Parsing pasted content...');
    // Populate IndexedDB for search functionality
      setStage('Building course catalog...');
      const catalog = buildCatalogFromRows(result.rows);
      await saveCatalog(catalog);
      
      setStage('Saving meeting data...');
      const meetings = rowsToMeetings(result.rows);
      await saveMeetings(meetings);
      
      
    try {
      const result = await parseFromClipboard(text);
      
      if (result.errors.length > 0 && !result.success) {
        setError(result.errors.join('\n'));
        setIsProcessing(false);
        return;
      }
      
      setProgress(100);async () => {
    setIsProcessing(true);
    setStage('Loading demo data...');
    setProgress(50);
    
    try {
      // Populate IndexedDB for search functionality
      setStage('Building course catalog...');
      const catalog = buildCatalogFromRows(DEMO_ROWS);
      await saveCatalog(catalog);
      
      setStage('Saving meeting data...');
      const meetings = rowsToMeetings(DEMO_ROWS);
      await saveMeetings(meetings);
      
      const result: ParseResult = {
        success: true,
        fileType: 'json',
        rows: DEMO_ROWS,
        warnings: [],
        errors: []
      };
      setProgress(100);
      onImportComplete(DEMO_ROWS, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo data');
    } finally {
      setIsProcessing(false);
    }result: ParseResult = {
        success: true,
        fileType: 'json',
        rows: DEMO_ROWS,
        warnings: [],
        errors: []
      };
      onImportComplete(DEMO_ROWS, result);
      setIsProcessing(false);
    }, 800);
  }, [onImportComplete]);
  
  return (
    <div className="import-screen">
      <div className="import-header">
        <h1>Import Timetable</h1>
        <p>Upload your course schedule to get started</p>
        <button onClick={handleLoadDemo} className="demo-button">
          Try with Demo Data
        </button>
      </div>
      
      {isProcessing ? (
        <div className="import-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-stage">{stage}</span>
        </div>
      ) : (
        <>
          <FileDropZone 
            onFileDrop={handleFileDrop}
            onTextPaste={handleTextPaste}
            disabled={isProcessing}
          />
          
          {error && (
            <div className="import-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
        </>
      )}
      
      <div className="import-formats">
        <h3>Supported Formats</h3>
        <div className="format-grid">
          <div className="format-item">
            <span className="format-icon">📄</span>
            <span className="format-name">PDF</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📊</span>
            <span className="format-name">Excel</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📝</span>
            <span className="format-name">CSV</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📅</span>
            <span className="format-name">ICS</span>
          </div>
          <div className="format-item">
            <span className="format-icon">🖼️</span>
            <span className="format-name">Images</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📄</span>
            <span className="format-name">DOCX</span>
          </div>
          <div className="format-item">
            <span className="format-icon">🌐</span>
            <span className="format-name">HTML</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📋</span>
            <span className="format-name">JSON</span>
          </div>
          <div className="format-item">
            <span className="format-icon">📃</span>
            <span className="format-name">Text</span>
          </div>
        </div>
      </div>
      
      <div className="import-tips">
        <h3>Tips for Best Results</h3>
        <ul>
          <li>Export your timetable from your university portal as CSV or Excel</li>
          <li>Make sure the file includes: course code, section, day, start time, end time</li>
          <li>For images, ensure text is clear and readable</li>
          <li>You can also paste timetable data directly from clipboard</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportScreen;
