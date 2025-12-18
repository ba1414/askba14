/**
 * HTML Parser for Timetable Data
 * Extracts table data from HTML content
 */

import { ParseResult, RawMeetingRow, generateId } from '../types';
import { validateRow } from '../utils/normalizer';

/**
 * Parse HTML content
 */
export async function parseHTML(content: string): Promise<ParseResult> {
  try {
    const warnings: string[] = [];
    const rows: RawMeetingRow[] = [];
    
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Look for tables
    const tables = doc.querySelectorAll('table');
    
    if (tables.length === 0) {
      // No tables, try to extract from text
      const textContent = doc.body?.textContent || '';
      if (textContent.trim()) {
        // Import text parser dynamically to avoid circular dependency
        const { parseText } = await import('./text-parser');
        return parseText(textContent);
      }
      
      return {
        success: false,
        fileType: 'html',
        rows: [],
        warnings: [],
        errors: ['No tables found in HTML content'],
      };
    }
    
    // Process each table
    for (const table of tables) {
      const tableRows = parseTable(table);
      rows.push(...tableRows);
    }
    
    if (rows.length === 0) {
      warnings.push('Tables found but no timetable data could be extracted');
    }
    
    return {
      success: rows.some(r => r.isValid),
      fileType: 'html',
      rows,
      warnings,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'html',
      rows: [],
      warnings: [],
      errors: [`HTML parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Parse a single HTML table
 */
function parseTable(table: HTMLTableElement): RawMeetingRow[] {
  const rows: RawMeetingRow[] = [];
  const tableRows = table.querySelectorAll('tr');
  
  if (tableRows.length === 0) return rows;
  
  // Try to detect header row
  let headerRowIndex = -1;
  let columnMapping = {
    courseCode: -1,
    section: -1,
    type: -1,
    day: -1,
    startTime: -1,
    endTime: -1,
    location: -1,
  };
  
  // Check first few rows for headers
  for (let i = 0; i < Math.min(3, tableRows.length); i++) {
    const cells = tableRows[i].querySelectorAll('th, td');
    const mapping = detectHeaderMapping(Array.from(cells).map(c => c.textContent || ''));
    
    if (mapping) {
      headerRowIndex = i;
      columnMapping = mapping;
      break;
    }
  }
  
  // Process data rows
  const startIndex = headerRowIndex >= 0 ? headerRowIndex + 1 : 0;
  
  for (let i = startIndex; i < tableRows.length; i++) {
    const cells = tableRows[i].querySelectorAll('td');
    if (cells.length < 3) continue;
    
    const cellTexts = Array.from(cells).map(c => c.textContent?.trim() || '');
    
    // Skip empty rows
    if (cellTexts.every(t => !t)) continue;
    
    const rawRow = extractRowFromCells(cellTexts, columnMapping);
    const validatedRow = validateRow(rawRow);
    rows.push(validatedRow);
  }
  
  return rows;
}

/**
 * Detect column mapping from header row
 */
function detectHeaderMapping(headers: string[]): typeof columnMapping | null {
  const columnMapping = {
    courseCode: -1,
    section: -1,
    type: -1,
    day: -1,
    startTime: -1,
    endTime: -1,
    location: -1,
  };
  
  const patterns = {
    courseCode: /course|code|subject|科目|課程/i,
    section: /section|sec|class|班別|組別/i,
    type: /type|activity|種類|類型/i,
    day: /day|weekday|星期|日期/i,
    startTime: /start|begin|開始|from/i,
    endTime: /end|finish|結束|to/i,
    location: /room|venue|location|place|地點|課室/i,
  };
  
  let matchCount = 0;
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase();
    
    for (const [key, pattern] of Object.entries(patterns)) {
      if (pattern.test(header) && columnMapping[key as keyof typeof columnMapping] === -1) {
        columnMapping[key as keyof typeof columnMapping] = i;
        matchCount++;
        break;
      }
    }
  }
  
  return matchCount >= 3 ? columnMapping : null;
}

/**
 * Extract row data from cells
 */
function extractRowFromCells(
  cells: string[],
  mapping: { courseCode: number; section: number; type: number; day: number; startTime: number; endTime: number; location: number }
): Partial<RawMeetingRow> {
  const getValue = (index: number): string => {
    if (index < 0 || index >= cells.length) return '';
    return cells[index];
  };
  
  // If no header mapping, use positional
  if (mapping.courseCode === -1) {
    return {
      id: generateId(),
      courseCode: cells[0] || '',
      section: cells[1] || '',
      type: cells[2] || '',
      day: cells[3] || '',
      startTime: cells[4] || '',
      endTime: cells[5] || '',
      location: cells[6] || '',
    };
  }
  
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

// For type annotation fix
type columnMapping = {
  courseCode: number;
  section: number;
  type: number;
  day: number;
  startTime: number;
  endTime: number;
  location: number;
};
