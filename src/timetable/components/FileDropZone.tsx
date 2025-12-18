/**
 * File Drop Zone Component
 * Drag-and-drop file upload with paste support
 */

import React, { useState, useCallback, useRef } from 'react';
import './FileDropZone.css';

interface FileDropZoneProps {
  onFileDrop: (file: File) => void;
  onTextPaste?: (text: string) => void;
  accept?: string;
  disabled?: boolean;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileDrop,
  onTextPaste,
  accept,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files[0]);
    }
  }, [disabled, onFileDrop]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileDrop(files[0]);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFileDrop]);
  
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (disabled || !onTextPaste) return;
    
    // Check for files
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          onFileDrop(file);
          return;
        }
      }
    }
    
    // Check for text
    const text = e.clipboardData.getData('text');
    if (text) {
      onTextPaste(text);
    }
  }, [disabled, onFileDrop, onTextPaste]);
  
  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);
  
  return (
    <div
      className={`file-drop-zone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
      onClick={handleClick}
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <div className="drop-zone-content">
        <div className="drop-zone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="drop-zone-text">
          <span className="drop-zone-title">
            {isDragging ? 'Drop file here' : 'Drop file or click to upload'}
          </span>
          <span className="drop-zone-subtitle">
            Supports PDF, Excel, CSV, ICS, images, JSON, and more
          </span>
        </div>
        
        <div className="drop-zone-hint">
          or press <kbd>⌘V</kbd> to paste from clipboard
        </div>
      </div>
    </div>
  );
};

export default FileDropZone;
