/**
 * ICS (iCalendar) Parser for Timetable Data
 * Extracts events from .ics files
 */

import { ParseResult, RawMeetingRow, generateId, DAYS } from '../types';
import { validateRow } from '../utils/normalizer';

/**
 * Parse ICS content
 */
export async function parseICS(content: string): Promise<ParseResult> {
  try {
    const warnings: string[] = [];
    const rows: RawMeetingRow[] = [];
    
    // Split into events
    const events = extractEvents(content);
    
    if (events.length === 0) {
      return {
        success: false,
        fileType: 'ics',
        rows: [],
        warnings: [],
        errors: ['No events found in ICS file'],
      };
    }
    
    for (const event of events) {
      const parsedEvent = parseEvent(event);
      if (parsedEvent) {
        const validatedRow = validateRow(parsedEvent);
        rows.push(validatedRow);
      }
    }
    
    if (rows.length === 0) {
      warnings.push('Events found but none could be parsed as timetable entries');
    }
    
    return {
      success: rows.some(r => r.isValid),
      fileType: 'ics',
      rows,
      warnings,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'ics',
      rows: [],
      warnings: [],
      errors: [`ICS parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Extract VEVENT blocks from ICS content
 */
function extractEvents(content: string): string[] {
  const events: string[] = [];
  const regex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    events.push(match[0]);
  }
  
  return events;
}

/**
 * Parse a single VEVENT into a raw meeting row
 */
function parseEvent(eventContent: string): Partial<RawMeetingRow> | null {
  const lines = unfoldLines(eventContent);
  
  const getValue = (key: string): string => {
    const line = lines.find(l => l.startsWith(key + ':') || l.startsWith(key + ';'));
    if (!line) return '';
    
    // Handle parameters (e.g., DTSTART;TZID=Asia/Hong_Kong:20240101T090000)
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return '';
    return line.substring(colonIndex + 1).trim();
  };
  
  const summary = getValue('SUMMARY');
  const dtstart = getValue('DTSTART');
  const dtend = getValue('DTEND');
  const location = getValue('LOCATION');
  const rrule = getValue('RRULE');
  
  if (!summary || !dtstart) return null;
  
  // Parse date/time
  const startDate = parseICSDateTime(dtstart);
  const endDate = dtend ? parseICSDateTime(dtend) : null;
  
  if (!startDate) return null;
  
  // Extract course code and section from summary
  // Common formats: "COMP1010 L1", "COMP1010-L1", "COMP1010 (Lecture)"
  const { courseCode, section, type } = parseSummary(summary);
  
  // Get day of week
  const day = DAYS[startDate.getDay()];
  
  // Format times
  const startTime = formatTime(startDate);
  const endTime = endDate ? formatTime(endDate) : '';
  
  return {
    id: generateId(),
    courseCode,
    section,
    type,
    day,
    startTime,
    endTime,
    location,
  };
}

/**
 * Unfold ICS lines (lines can be continued with leading whitespace)
 */
function unfoldLines(content: string): string[] {
  // Replace line continuations
  const unfolded = content.replace(/\r\n[ \t]/g, '');
  return unfolded.split(/\r?\n/).filter(l => l.trim());
}

/**
 * Parse ICS date/time format
 */
function parseICSDateTime(value: string): Date | null {
  // Format: 20240101T090000 or 20240101T090000Z
  const match = value.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!match) return null;
  
  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
}

/**
 * Format Date to HH:MM string
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse course info from event summary
 */
function parseSummary(summary: string): { courseCode: string; section: string; type: string } {
  // Try common patterns
  
  // Pattern: "COMP1010 L1" or "COMP1010-L1"
  let match = summary.match(/^([A-Z]{2,4}\s*\d{3,4}[A-Z]?)\s*[-_\s]*([A-Z]\d+)?/i);
  if (match) {
    return {
      courseCode: match[1].replace(/\s+/g, ''),
      section: match[2] || 'L1',
      type: guessType(match[2] || summary),
    };
  }
  
  // Pattern: "Course Name (COMP1010)"
  match = summary.match(/\(([A-Z]{2,4}\s*\d{3,4}[A-Z]?)\)/i);
  if (match) {
    return {
      courseCode: match[1].replace(/\s+/g, ''),
      section: 'L1',
      type: guessType(summary),
    };
  }
  
  // Fallback: use whole summary as course code
  return {
    courseCode: summary.substring(0, 20).trim(),
    section: 'L1',
    type: guessType(summary),
  };
}

/**
 * Guess meeting type from text
 */
function guessType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('lec') || lower.includes('lecture') || lower.match(/\bL\d/i)) {
    return 'LEC';
  }
  if (lower.includes('tut') || lower.includes('tutorial') || lower.match(/\bT\d/i)) {
    return 'TUT';
  }
  if (lower.includes('lab') || lower.includes('laboratory')) {
    return 'LAB';
  }
  if (lower.includes('sem') || lower.includes('seminar')) {
    return 'SEM';
  }
  return 'OTHER';
}
