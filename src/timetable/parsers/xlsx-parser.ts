/**
 * Excel (XLSX) Parser for Timetable Data
 * Uses SheetJS (xlsx) for Excel file parsing
 */

import * as XLSX from 'xlsx';
import { ParseResult, RawMeetingRow, ColumnMapping, generateId } from '../types';
import { validateRow } from '../utils/normalizer';

/**
 * Column header patterns for auto-detection
 */
const COLUMN_PATTERNS = {
  courseCode: /course|code|subject|科目|課程/i,
  section: /section|sec|class|班別|組別/i,
  type: /type|activity|種類|類型/i,
  day: /day|weekday|星期|日期/i,
  startTime: /start|begin|開始|from/i,
  endTime: /end|finish|結束|to/i,
  location: /room|venue|location|place|地點|課室/i,
};

/**
 * Parse XLSX file from ArrayBuffer
 */
export async function parseXLSX(buffer: ArrayBuffer): Promise<ParseResult> {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const warnings: string[] = [];
    const allRows: RawMeetingRow[] = [];
    
    // Process first sheet (or all sheets if user specifies)
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        success: false,
        fileType: 'xlsx',
        rows: [],
        warnings: [],
        errors: ['No sheets found in Excel file'],
      };
    }
    
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
    
    if (data.length === 0) {
      return {
        success: false,
        fileType: 'xlsx',
        rows: [],
        warnings: [],
        errors: ['Sheet is empty'],
      };
    }
    
    // Detect header and column mapping
    const { headerIndex, mapping } = detectColumns(data);
    
    // Check if it might be a grid layout (Time x Day)
    if (mapping.courseCode === null && mapping.day === null) {
      const gridRows = parseGrid(data);
      if (gridRows.length > 0) {
        return {
          success: gridRows.some(r => r.isValid),
          fileType: 'xlsx',
          rows: gridRows,
          warnings: ['Detected grid layout'],
          errors: [],
        };
      }
    }

    if (mapping.courseCode === null || mapping.day === null) {
      warnings.push('Could not auto-detect all columns. Using positional mapping.');
    }
    
    // Parse rows
    const startIndex = headerIndex !== null ? headerIndex + 1 : 0;
    
    for (let i = startIndex; i < data.length; i++) {
      const row = data[i];
      if (!row || row.every(cell => !cell?.toString().trim())) continue;
      
      const rawRow = extractRowData(row, mapping);
      const validatedRow = validateRow(rawRow);
      allRows.push(validatedRow);
    }
    
    return {
      success: allRows.some(r => r.isValid),
      fileType: 'xlsx',
      rows: allRows,
      warnings,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'xlsx',
      rows: [],
      warnings: [],
      errors: [`Excel parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Detect header row and column mapping
 */
function detectColumns(data: unknown[][]): { headerIndex: number | null; mapping: ColumnMapping } {
  // Default positional mapping
  const defaultMapping: ColumnMapping = {
    courseCode: 0,
    section: 1,
    type: 2,
    day: 3,
    startTime: 4,
    endTime: 5,
    location: 6,
  };
  
  // Try to find header row
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i]?.map(cell => String(cell || ''));
    if (!row) continue;
    
    const mapping = matchHeaderRow(row);
    if (mapping) {
      return { headerIndex: i, mapping };
    }
  }
  
  return { headerIndex: null, mapping: defaultMapping };
}

/**
 * Parse grid layout (Time x Day)
 */
function parseGrid(data: unknown[][]): RawMeetingRow[] {
  const rows: RawMeetingRow[] = [];
  
  // Find header row with days
  let headerRowIndex = -1;
  let dayColumns: { [key: number]: string } = {}; // colIndex -> day name
  
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i]?.map(c => String(c || '').toLowerCase());
    if (!row) continue;
    
    const foundDays: { [key: number]: string } = {};
    let dayCount = 0;
    
    row.forEach((cell, colIndex) => {
      if (cell.includes('mon') || cell.includes('tue') || cell.includes('wed') || 
          cell.includes('thu') || cell.includes('fri') || cell.includes('sat') || 
          cell.includes('sun') || cell.includes('一') || cell.includes('二') || 
          cell.includes('三') || cell.includes('四') || cell.includes('五')) {
        foundDays[colIndex] = cell;
        dayCount++;
      }
    });
    
    if (dayCount >= 3) {
      headerRowIndex = i;
      dayColumns = foundDays;
      break;
    }
  }
  
  if (headerRowIndex === -1) return [];
  
  // Iterate rows below header
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (!row) continue;
    
    // Try to find time in first few columns
    let startTime = '';
    let endTime = '';
    
    const timeCell = String(row[0] || '') + ' ' + String(row[1] || '');
    const timeMatch = timeCell.match(/(\d{1,2}[:.]\d{2})\s*[-–to]\s*(\d{1,2}[:.]\d{2})/);
    
    if (timeMatch) {
      startTime = timeMatch[1];
      endTime = timeMatch[2];
    } else {
      continue; // Skip rows without time
    }
    
    // Check each day column
    for (const [colIndex, dayName] of Object.entries(dayColumns)) {
      const cellContent = String(row[Number(colIndex)] || '').trim();
      if (!cellContent) continue;
      
      // Cell content usually: "COMP1010 L1 Room 101"
      // Simple heuristic: split by space
      const parts = cellContent.split(/\s+/);
      const courseCode = parts[0] || 'Unknown';
      const section = parts.length > 1 ? parts[1] : 'L1';
      const location = parts.length > 2 ? parts.slice(2).join(' ') : '';
      
      rows.push(validateRow({
        id: generateId(),
        courseCode,
        section,
        type: 'LEC', // Default
        day: dayName,
        startTime,
        endTime,
        location,
      }));
    }
  }
  
  return rows;
}

/**
 * Match row as header row
 */
function matchHeaderRow(row: string[]): ColumnMapping | null {
  const mapping: ColumnMapping = {
    courseCode: null,
    section: null,
    type: null,
    day: null,
    startTime: null,
    endTime: null,
    location: null,
  };
  
  let matchCount = 0;
  
  for (let i = 0; i < row.length; i++) {
    const cell = row[i]?.toLowerCase() || '';
    
    for (const [key, pattern] of Object.entries(COLUMN_PATTERNS)) {
      if (pattern.test(cell) && mapping[key as keyof ColumnMapping] === null) {
        mapping[key as keyof ColumnMapping] = i;
        matchCount++;
        break;
      }
    }
  }
  
  if (matchCount >= 3) {
    return mapping;
  }
  
  return null;
}

/**
 * Extract row data using column mapping
 */
function extractRowData(row: unknown[], mapping: ColumnMapping): Partial<RawMeetingRow> {
  const getValue = (index: number | null): string => {
    if (index === null || index >= row.length) return '';
    const value = row[index];
    return value !== null && value !== undefined ? String(value).trim() : '';
  };
  
  return {
    id: generateId(),
    courseCode: getValue(mapping.courseCode),
    section: getValue(mapping.section),
    type: getValue(mapping.type),
    day: getValue(mapping.day),
    startTime: getValue(mapping.startTime),
    endTime: getValue(mapping.endTime),
    location: getValue(mapping.location),
  };
}

/**
 * Get sheet names from workbook
 */
export function getSheetNames(buffer: ArrayBuffer): string[] {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    return workbook.SheetNames;
  } catch {
    return [];
  }
}
