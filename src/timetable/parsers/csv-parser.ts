/**
 * CSV Parser for Timetable Data
 * Uses PapaParse for robust CSV/TSV parsing
 */

import Papa from 'papaparse';
import { ParseResult, RawMeetingRow, ColumnMapping, generateId } from '../types';
import { validateRow } from '../utils/normalizer';

/**
 * Default column header patterns for auto-detection
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
 * Parse CSV/TSV content
 */
export async function parseCSV(content: string): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const warnings: string[] = [];
        const errors: string[] = [];
        
        if (!results.data || results.data.length === 0) {
          resolve({
            success: false,
            fileType: 'csv',
            rows: [],
            warnings,
            errors: ['No data found in CSV file'],
          });
          return;
        }
        
        const data = results.data as string[][];
        
        // Auto-detect header row and column mapping
        const { headerIndex, mapping } = detectColumns(data);
        
        if (mapping.courseCode === null || mapping.day === null) {
          warnings.push('Could not auto-detect all columns. Using positional mapping.');
        }
        
        // Parse rows
        const rows: RawMeetingRow[] = [];
        const startIndex = headerIndex !== null ? headerIndex + 1 : 0;
        
        for (let i = startIndex; i < data.length; i++) {
          const row = data[i];
          if (!row || row.every(cell => !cell?.trim())) continue;
          
          const rawRow = extractRowData(row, mapping);
          const validatedRow = validateRow(rawRow);
          rows.push(validatedRow);
        }
        
        resolve({
          success: rows.some(r => r.isValid),
          fileType: 'csv',
          rows,
          warnings,
          errors,
        });
      },
      error: (error: Error) => {
        resolve({
          success: false,
          fileType: 'csv',
          rows: [],
          warnings: [],
          errors: [`CSV parse error: ${error.message}`],
        });
      },
    });
  });
}

/**
 * Detect header row and column mapping
 */
function detectColumns(data: string[][]): { headerIndex: number | null; mapping: ColumnMapping } {
  // Default positional mapping (fallback)
  const defaultMapping: ColumnMapping = {
    courseCode: 0,
    section: 1,
    type: 2,
    day: 3,
    startTime: 4,
    endTime: 5,
    location: 6,
  };
  
  // Try to find header row in first 5 rows
  for (let i = 0; i < Math.min(5, data.length); i++) {
    const row = data[i];
    if (!row) continue;
    
    const mapping = matchHeaderRow(row);
    if (mapping) {
      return { headerIndex: i, mapping };
    }
  }
  
  return { headerIndex: null, mapping: defaultMapping };
}

/**
 * Try to match a row as a header row
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
  
  // Need at least 3 columns matched to consider it a header
  if (matchCount >= 3) {
    return mapping;
  }
  
  return null;
}

/**
 * Extract row data using column mapping
 */
function extractRowData(row: string[], mapping: ColumnMapping): Partial<RawMeetingRow> {
  return {
    id: generateId(),
    courseCode: mapping.courseCode !== null ? row[mapping.courseCode]?.trim() || '' : '',
    section: mapping.section !== null ? row[mapping.section]?.trim() || '' : '',
    type: mapping.type !== null ? row[mapping.type]?.trim() || '' : '',
    day: mapping.day !== null ? row[mapping.day]?.trim() || '' : '',
    startTime: mapping.startTime !== null ? row[mapping.startTime]?.trim() || '' : '',
    endTime: mapping.endTime !== null ? row[mapping.endTime]?.trim() || '' : '',
    location: mapping.location !== null ? row[mapping.location]?.trim() || '' : '',
  };
}

/**
 * Export column mapping for user adjustment
 */
export function getColumnMapping(data: string[][]): { 
  headerIndex: number | null; 
  mapping: ColumnMapping;
  headers: string[];
} {
  const { headerIndex, mapping } = detectColumns(data);
  const headers = headerIndex !== null ? data[headerIndex] : [];
  return { headerIndex, mapping, headers };
}
