/**
 * JSON Parser for Timetable Data
 * Handles structured JSON input
 */

import { ParseResult, RawMeetingRow, generateId } from '../types';
import { validateRow } from '../utils/normalizer';

/**
 * Expected JSON structure
 */
interface JsonTimetableEntry {
  courseCode?: string;
  course_code?: string;
  code?: string;
  course?: string;
  
  section?: string;
  sec?: string;
  class?: string;
  
  type?: string;
  activity?: string;
  
  day?: string;
  weekday?: string;
  
  startTime?: string;
  start_time?: string;
  start?: string;
  from?: string;
  
  endTime?: string;
  end_time?: string;
  end?: string;
  to?: string;
  
  location?: string;
  room?: string;
  venue?: string;
}

/**
 * Parse JSON content
 */
export async function parseJSON(content: string): Promise<ParseResult> {
  try {
    let data: unknown;
    
    try {
      data = JSON.parse(content);
    } catch {
      return {
        success: false,
        fileType: 'json',
        rows: [],
        warnings: [],
        errors: ['Invalid JSON format'],
      };
    }
    
    const warnings: string[] = [];
    const rows: RawMeetingRow[] = [];
    
    // Handle array or object with array property
    let entries: JsonTimetableEntry[] = [];
    
    if (Array.isArray(data)) {
      entries = data;
    } else if (typeof data === 'object' && data !== null) {
      // Look for array property
      const obj = data as Record<string, unknown>;
      for (const key of ['entries', 'courses', 'classes', 'timetable', 'data', 'meetings']) {
        if (Array.isArray(obj[key])) {
          entries = obj[key] as JsonTimetableEntry[];
          break;
        }
      }
      
      // If no array found, treat object as single entry
      if (entries.length === 0) {
        entries = [obj as JsonTimetableEntry];
      }
    }
    
    if (entries.length === 0) {
      return {
        success: false,
        fileType: 'json',
        rows: [],
        warnings: [],
        errors: ['No timetable entries found in JSON'],
      };
    }
    
    for (const entry of entries) {
      const rawRow = extractFromJsonEntry(entry);
      const validatedRow = validateRow(rawRow);
      rows.push(validatedRow);
    }
    
    return {
      success: rows.some(r => r.isValid),
      fileType: 'json',
      rows,
      warnings,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'json',
      rows: [],
      warnings: [],
      errors: [`JSON parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Extract timetable data from a JSON entry
 */
function extractFromJsonEntry(entry: JsonTimetableEntry): Partial<RawMeetingRow> {
  return {
    id: generateId(),
    courseCode: entry.courseCode || entry.course_code || entry.code || entry.course || '',
    section: entry.section || entry.sec || entry.class || '',
    type: entry.type || entry.activity || '',
    day: entry.day || entry.weekday || '',
    startTime: entry.startTime || entry.start_time || entry.start || entry.from || '',
    endTime: entry.endTime || entry.end_time || entry.end || entry.to || '',
    location: entry.location || entry.room || entry.venue || '',
  };
}
