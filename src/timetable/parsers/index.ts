/**
 * Unified File Parser
 * Auto-detects file type and routes to appropriate parser
 */

import { ParseResult, ImportFileType } from '../types';
import { parseCSV } from './csv-parser';
import { parseXLSX } from './xlsx-parser';
import { parseICS } from './ics-parser';
import { parseText } from './text-parser';
import { parseJSON } from './json-parser';
import { parseImage } from './image-parser';
import { parsePDF } from './pdf-parser';
import { parseHTML } from './html-parser';
import { parseDOCX } from './docx-parser';

export type ProgressCallback = (progress: number, stage: string) => void;

/**
 * Parse a file automatically based on type
 */
export async function parseFile(
  file: File,
  onProgress?: ProgressCallback
): Promise<ParseResult> {
  const fileType = detectFileType(file);
  onProgress?.(5, `Detected file type: ${fileType}`);
  
  switch (fileType) {
    case 'csv':
      return parseCSVFile(file, onProgress);
    case 'xlsx':
      return parseXLSXFile(file, onProgress);
    case 'ics':
      return parseICSFile(file, onProgress);
    case 'pdf-text':
    case 'pdf-ocr':
      return parsePDFFile(file, onProgress);
    case 'image':
      return parseImageFile(file, onProgress);
    case 'html':
      return parseHTMLFile(file, onProgress);
    case 'json':
      return parseJSONFile(file, onProgress);
    case 'docx':
      return parseDOCXFile(file, onProgress);
    case 'text':
    default:
      return parseTextFile(file, onProgress);
  }
}

/**
 * Detect file type from file extension and MIME type
 */
function detectFileType(file: File): ImportFileType {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();
  
  // By extension
  switch (extension) {
    case 'csv':
    case 'tsv':
      return 'csv';
    case 'xlsx':
    case 'xls':
      return 'xlsx';
    case 'ics':
    case 'ical':
      return 'ics';
    case 'pdf':
      return 'pdf-text';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'bmp':
      return 'image';
    case 'html':
    case 'htm':
      return 'html';
    case 'json':
      return 'json';
    case 'txt':
      return 'text';
    case 'docx':
    case 'doc':
      return 'docx';
  }
  
  // By MIME type
  if (mimeType.includes('csv') || mimeType.includes('comma-separated')) {
    return 'csv';
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return 'xlsx';
  }
  if (mimeType.includes('calendar')) {
    return 'ics';
  }
  if (mimeType.includes('pdf')) {
    return 'pdf-text';
  }
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  if (mimeType.includes('html')) {
    return 'html';
  }
  if (mimeType.includes('json')) {
    return 'json';
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'docx';
  }
  
  return 'text';
}

/**
 * Individual file type parsers
 */
async function parseCSVFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(20, 'Reading CSV file...');
  const content = await file.text();
  onProgress?.(50, 'Parsing CSV...');
  const result = await parseCSV(content);
  onProgress?.(100, 'Complete');
  return result;
}

async function parseXLSXFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(20, 'Reading Excel file...');
  const buffer = await file.arrayBuffer();
  onProgress?.(50, 'Parsing Excel...');
  const result = await parseXLSX(buffer);
  onProgress?.(100, 'Complete');
  return result;
}

async function parseICSFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(20, 'Reading ICS file...');
  const content = await file.text();
  onProgress?.(50, 'Parsing calendar...');
  const result = await parseICS(content);
  onProgress?.(100, 'Complete');
  return result;
}

async function parsePDFFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  return parsePDF(buffer, onProgress);
}

async function parseImageFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(10, 'Preparing image for OCR...');
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  return parseImage(blob, (p) => onProgress?.(10 + p * 0.9, 'Running OCR...'));
}

async function parseHTMLFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(20, 'Reading HTML file...');
  const content = await file.text();
  onProgress?.(50, 'Parsing HTML...');
  const result = await parseHTML(content);
  onProgress?.(100, 'Complete');
  return result;
}

async function parseDOCXFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  return parseDOCX(buffer, onProgress);
}

async function parseJSONFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(20, 'Reading JSON file...');
  const content = await file.text();
  onProgress?.(50, 'Parsing JSON...');
  const result = await parseJSON(content);
  onProgress?.(100, 'Complete');
  return result;
}

async function parseTextFile(file: File, onProgress?: ProgressCallback): Promise<ParseResult> {
  onProgress?.(20, 'Reading text file...');
  onProgress?.(50, 'Parsing text...');
  const result = await parseText(file);
  onProgress?.(100, 'Complete');
  return result;
}

/**
 * Parse from clipboard (paste)
 */
export async function parseFromClipboard(text: string): Promise<ParseResult> {
  // Try to detect format
  const trimmed = text.trim();
  
  // Check if JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const result = await parseJSON(trimmed);
      if (result.success) return result;
    } catch {
      // Not valid JSON, continue
    }
  }
  
  // Check if CSV-like (has consistent delimiters)
  const lines = trimmed.split('\n');
  const tabCount = (lines[0]?.match(/\t/g) || []).length;
  const commaCount = (lines[0]?.match(/,/g) || []).length;
  
  if (tabCount >= 3 || commaCount >= 3) {
    const result = await parseCSV(trimmed);
    if (result.success) return result;
  }
  
  // Default to text parsing
  return parseText(trimmed);
}

// Re-export individual parsers
export { parseCSV } from './csv-parser';
export { parseXLSX } from './xlsx-parser';
export { parseICS } from './ics-parser';
export { parseText } from './text-parser';
export { parseJSON } from './json-parser';
export { parseImage } from './image-parser';
export { parsePDF } from './pdf-parser';
export { parseHTML } from './html-parser';
export { parseDOCX } from './docx-parser';
