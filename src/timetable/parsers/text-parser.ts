/**
 * Plain Text Parser for Timetable Data
 * Attempts to extract timetable info from unstructured text
 */

import { ParseResult, RawMeetingRow, generateId } from '../types';
import { validateRow } from '../utils/normalizer';

// Weekday mapping for numeric formats (1-6 or 1-7)
const NUMERIC_WEEKDAY_MAP: Record<string, number> = {
  '1': 0, // Monday
  '2': 1, // Tuesday
  '3': 2, // Wednesday
  '4': 3, // Thursday
  '5': 4, // Friday
  '6': 5, // Saturday
  '7': 6, // Sunday
};

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Course code pattern for HKU SPACE format
const COURSE_CODE_REGEX = /^[A-Z]{3,6}\d{4}\b/;

// Time range pattern (matches "08:30 - 09:50", "8.30–9.50", etc.)
const TIME_RANGE_REGEX = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;

// Non-row patterns to filter out
const NON_ROW_PATTERNS = [
  /^(HKU|SPACE)$/i,
  /^HKU\s+SPACE$/i,
  /School of Professional/i,
  /Last\s+updated/i,
  /Page\s+\d+\s+of/i,
  /^(Course Code|Class No|Course Name|Semester|Weekday|Time|Room)/i,
  /Admiral.+Road/i, // Address lines
  /Pokfulam/i,
  /Tel:\s*\(/i,
  /Fax:\s*\(/i,
  /^www\./i,
  /^https?:/i,
];

interface ParseDebugInfo {
  extractedChars: number;
  totalLines: number;
  candidateLines: number;
  parsedRows: number;
  needsFixingRows: number;
  filteredLines: number;
  preview: string[];
}

/**
 * Parse plain text content
 */
export async function parseText(
  fileOrContent: File | string,
  onProgress?: (progress: number, stage: string) => void
): Promise<ParseResult> {
  try {
    let content: string;
    
    if (typeof fileOrContent === 'string') {
      content = fileOrContent;
    } else {
      content = await fileOrContent.text();
    }

    const warnings: string[] = [];
    const rows: RawMeetingRow[] = [];
    
    // Split into lines
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    
    if (lines.length === 0) {
      return {
        success: false,
        fileType: 'text',
        rows: [],
        warnings: [],
        errors: ['No text content found'],
      };
    }
    
    // Debug info
    const debugInfo: ParseDebugInfo = {
      extractedChars: content.length,
      totalLines: lines.length,
      candidateLines: 0,
      parsedRows: 0,
      needsFixingRows: 0,
      filteredLines: 0,
      preview: lines.slice(0, 50),
    };
    
    console.log(`Text Parser: Processing ${lines.length} lines`);
    console.log(`First 10 lines:`, lines.slice(0, 10));
    
    // Filter candidate lines (must have time range and start with course code)
    const candidateLines: string[] = [];
    const rejectedSamples: Array<{line: string, reason: string}> = [];
    
    for (const line of lines) {
      const isNonRow = isNonRowLine(line);
      if (isNonRow) {
        debugInfo.filteredLines++;
        if (rejectedSamples.length < 10) {
          rejectedSamples.push({ line: line.substring(0, 80), reason: 'Header/footer pattern' });
        }
        continue;
      }
      
      const normalized = line.trim().replace(/\s+/g, ' ');
      const hasTime = TIME_RANGE_REGEX.test(normalized);
      if (!hasTime) {
        if (rejectedSamples.length < 10 && line.length > 20) {
          rejectedSamples.push({ line: line.substring(0, 80), reason: 'No time range' });
        }
        continue;
      }
      
      const firstToken = normalized.split(/\s+/)[0];
      const hasCourseCode = COURSE_CODE_REGEX.test(firstToken);
      if (!hasCourseCode) {
        if (rejectedSamples.length < 10) {
          rejectedSamples.push({ 
            line: line.substring(0, 80), 
            reason: `Invalid course code: "${firstToken}"` 
          });
        }
        continue;
      }
      
      debugInfo.candidateLines++;
      candidateLines.push(line);
    }
    
    console.log(`Found ${candidateLines.length} candidates from ${lines.length} lines`);
    console.log(`Rejected samples:`, rejectedSamples);
    console.log(`First 5 candidates:`, candidateLines.slice(0, 5));
    
    // Parse each candidate line
    for (const line of candidateLines) {
      const parsed = parseRowListLine(line);
      if (parsed) {
        rows.push(validateRow(parsed));
        if (parsed.status === 'needs-fixing') {
          debugInfo.needsFixingRows++;
        } else {
          debugInfo.parsedRows++;
        }
      }
    }
    
    // If row-list didn't find enough, try fallback parsers
    if (candidateLines.length === 0 || rows.length < candidateLines.length * 0.5) {
      const tableRows = detectAndParseTable(lines);
      
      if (tableRows.length > rows.length) {
        rows.length = 0; // Replace with table results
        for (const row of tableRows) {
          rows.push(validateRow(row));
        }
      } else {
        // Finally, try line-by-line extraction
        const lineRows: RawMeetingRow[] = [];
        for (const line of lines) {
          const extracted = extractFromLine(line);
          if (extracted) {
            lineRows.push(validateRow(extracted));
          }
        }
        
        if (lineRows.length > rows.length) {
          rows.length = 0;
          rows.push(...lineRows);
        }
      }
    }
    
    if (rows.length === 0) {
      warnings.push(`Could not extract any timetable entries. Debug: ${debugInfo.candidateLines} candidates found from ${debugInfo.totalLines} lines`);
    }
    
    return {
      success: rows.some(r => r.isValid),
      fileType: 'text',
      rows,
      warnings,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'text',
      rows: [],
      warnings: [],
      errors: [`Text parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Check if a line is a non-row (header, footer, branding, etc.)
 */
function isNonRowLine(line: string): boolean {
  if (!line || line.length < 10) return true;
  
  for (const pattern of NON_ROW_PATTERNS) {
    if (pattern.test(line)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if a line is a candidate timetable row
 * Must have: valid time range AND start with valid course code
 */
function isCandidateLine(line: string): boolean {
  // Normalize: trim and collapse whitespace
  const normalized = line.trim().replace(/\s+/g, ' ');
  
  // Must contain time range
  const hasTime = TIME_RANGE_REGEX.test(normalized);
  if (!hasTime) {
    return false;
  }
  
  // Must start with valid course code (after trimming!)
  const firstToken = normalized.split(/\s+/)[0];
  const hasCourseCode = COURSE_CODE_REGEX.test(firstToken);
  
  return hasCourseCode;
}

/**
 * Parse row-list format line (right-anchored parsing)
 * Example: "CCAH3003 CL02 The Process of Design 1 4 10:00 - 11:20 FTC1902"
 * Header: Course Code | Class No | Course Name | Semester | Weekday | Time | Room
 * 
 * Algorithm:
 * 1. Extract time range (anchor point)
 * 2. Extract room (everything after time)
 * 3. Split beforeTime into tokens
 * 4. Extract from right: weekday (last), semester (2nd-last)
 * 5. Extract from left: courseCode (1st), classNo (2nd)
 * 6. Middle tokens = courseName
 */
function parseRowListLine(line: string): Partial<RawMeetingRow> | null {
  // Already filtered by isCandidateLine, but double-check
  if (!line || line.length < 15) return null;
  
  // Find time range as anchor
  const timeMatch = TIME_RANGE_REGEX.exec(line);
  if (!timeMatch) {
    // Should not happen as isCandidateLine checks this
    return null;
  }
  
  const startTime = normalizeTime(timeMatch[1].replace('.', ':'));
  const endTime = normalizeTime(timeMatch[2].replace('.', ':'));
  const timeStartIdx = timeMatch.index;
  const timeEndIdx = timeStartIdx + timeMatch[0].length;
  
  // Extract room (everything after time, first token)
  const afterTime = line.substring(timeEndIdx).trim();
  const roomTokens = afterTime.split(/\s+/);
  const room = roomTokens.length > 0 ? roomTokens[0] : '';
  
  // Extract before time
  const beforeTime = line.substring(0, timeStartIdx).trim();
  const tokens = beforeTime.split(/\s+/).filter(t => t);
  
  // Need at least: CourseCode ClassNo Semester Weekday (4 tokens minimum)
  if (tokens.length < 4) {
    // Not enough tokens, mark as needs fixing
    return {
      id: generateId(),
      courseCode: tokens[0] || 'UNKNOWN',
      section: tokens[1] || '',
      courseName: '',
      type: '',
      day: '',
      startTime,
      endTime,
      location: room,
      raw: line,
      status: 'needs-fixing',
      isValid: false,
      errors: ['Insufficient tokens in line'],
    };
  }
  
  // Right side extraction (working backward from time)
  const weekdayToken = tokens[tokens.length - 1];
  const semesterToken = tokens[tokens.length - 2];
  
  // Convert numeric weekday to day name
  let day: string;
  const weekdayNum = NUMERIC_WEEKDAY_MAP[weekdayToken];
  if (weekdayNum !== undefined) {
    day = WEEKDAY_NAMES[weekdayNum];
  } else {
    // Try parsing as text weekday
    const dayMatch = weekdayToken.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i);
    if (dayMatch) {
      day = dayMatch[1];
    } else {
      // Invalid weekday, mark as needs fixing
      return {
        id: generateId(),
        courseCode: tokens[0],
        section: tokens[1],
        courseName: tokens.slice(2, tokens.length - 2).join(' '),
        type: '',
        day: weekdayToken,
        startTime,
        endTime,
        location: room,
        raw: line,
        status: 'needs-fixing',
        isValid: false,
        errors: [`Invalid weekday: ${weekdayToken}`],
      };
    }
  }
  
  // Left side extraction
  const courseCode = tokens[0];
  const classNo = tokens[1];
  
  // Validate course code format
  if (!COURSE_CODE_REGEX.test(courseCode)) {
    return {
      id: generateId(),
      courseCode,
      section: classNo,
      courseName: '',
      type: '',
      day,
      startTime,
      endTime,
      location: room,
      raw: line,
      status: 'needs-fixing',
      isValid: false,
      errors: [`Invalid course code format: ${courseCode}`],
    };
  }
  
  // Middle tokens = course name
  const courseNameTokens = tokens.slice(2, tokens.length - 2);
  const courseName = courseNameTokens.join(' ');
  
  // Validate semester (should be 1 or 2)
  if (!/^[12]$/.test(semesterToken)) {
    // Non-critical, just warn
    console.warn(`Unexpected semester value: ${semesterToken} in line: ${line}`);
  }
  
  return {
    id: generateId(),
    courseCode: courseCode.toUpperCase(),
    section: classNo.toUpperCase(),
    courseName,
    type: '', // Type not in this format
    day,
    startTime,
    endTime,
    location: room,
    raw: line,
    isValid: true,
    errors: [],
  };
}

/**
 * Detect if content looks like a table and parse it
 */
function detectAndParseTable(lines: string[]): Partial<RawMeetingRow>[] {
  const rows: Partial<RawMeetingRow>[] = [];
  
  // Check if lines have consistent delimiters (tab, |, multiple spaces)
  const delimiterCounts = lines.map(line => ({
    tabs: (line.match(/\t/g) || []).length,
    pipes: (line.match(/\|/g) || []).length,
    spaces: (line.match(/\s{2,}/g) || []).length,
  }));
  
  // Find most common delimiter
  const avgTabs = delimiterCounts.reduce((sum, c) => sum + c.tabs, 0) / lines.length;
  const avgPipes = delimiterCounts.reduce((sum, c) => sum + c.pipes, 0) / lines.length;
  const avgSpaces = delimiterCounts.reduce((sum, c) => sum + c.spaces, 0) / lines.length;
  
  let delimiter: RegExp;
  if (avgTabs >= 3) {
    delimiter = /\t+/;
  } else if (avgPipes >= 3) {
    delimiter = /\s*\|\s*/;
  } else if (avgSpaces >= 3) {
    delimiter = /\s{2,}/;
  } else {
    return []; // No clear table structure
  }
  
  // Parse as table
  for (const line of lines) {
    const cells = line.split(delimiter).map(c => c.trim()).filter(c => c);
    
    if (cells.length >= 4) {
      // Try to identify columns by content
      const extracted = extractFromCells(cells);
      if (extracted) {
        rows.push(extracted);
      }
    }
  }
  
  return rows;
}

/**
 * Extract timetable info from table cells
 */
function extractFromCells(cells: string[]): Partial<RawMeetingRow> | null {
  // Find course code (pattern: 2-4 letters + 3-4 digits)
  const courseCodeIndex = cells.findIndex(c => /^[A-Z]{2,4}\s*\d{3,4}[A-Z]?$/i.test(c));
  
  // Find day
  const dayIndex = cells.findIndex(c => /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|週[一二三四五六日]|星期[一二三四五六日])$/i.test(c));
  
  // Find time (HH:MM format)
  const timeIndices = cells.map((c, i) => /\d{1,2}:\d{2}/.test(c) ? i : -1).filter(i => i >= 0);
  
  if (courseCodeIndex < 0 || dayIndex < 0 || timeIndices.length < 1) {
    return null;
  }
  
  return {
    id: generateId(),
    courseCode: cells[courseCodeIndex],
    section: findSection(cells) || 'L1',
    type: findType(cells) || '',
    day: cells[dayIndex],
    startTime: timeIndices[0] >= 0 ? extractTime(cells[timeIndices[0]]) : '',
    endTime: timeIndices[1] >= 0 ? extractTime(cells[timeIndices[1]]) : '',
    location: findLocation(cells) || '',
  };
}

/**
 * Extract timetable info from a single line
 */
function extractFromLine(line: string): Partial<RawMeetingRow> | null {
  // Look for patterns like:
  // "COMP1010 L1 Mon 09:30-10:20 Room 101"
  // "COMP1010, Lecture 1, Monday, 9:30 AM - 10:20 AM"
  
  // Extract course code
  const courseMatch = line.match(/([A-Z]{2,4}\s*\d{3,4}[A-Z]?)/i);
  if (!courseMatch) return null;
  
  // Extract day
  const dayMatch = line.match(/\b(Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?|週[一二三四五六日]|星期[一二三四五六日])\b/i);
  if (!dayMatch) return null;
  
  // Extract times
  const timeMatches = line.match(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM)?)?)/gi) || [];
  
  if (timeMatches.length === 0) return null;
  
  // Extract section
  const sectionMatch = line.match(/\b([LT]\d+|Section\s+\d+|Lecture\s+\d+|Tutorial\s+\d+)\b/i);
  
  return {
    id: generateId(),
    courseCode: courseMatch[1].replace(/\s+/g, ''),
    section: sectionMatch ? sectionMatch[1].replace(/\s+/g, '') : 'L1',
    type: findType([line]) || '',
    day: dayMatch[1],
    startTime: timeMatches[0] ? normalizeTime(timeMatches[0]) : '',
    endTime: timeMatches[1] ? normalizeTime(timeMatches[1]) : '',
    location: findLocationInLine(line) || '',
  };
}

/**
 * Find section in cells
 */
function findSection(cells: string[]): string | null {
  for (const cell of cells) {
    const match = cell.match(/^([LT]\d+|L\d+-T\d+)$/i);
    if (match) return match[1].toUpperCase();
  }
  return null;
}

/**
 * Find meeting type in cells
 */
function findType(cells: string[]): string | null {
  for (const cell of cells) {
    const lower = cell.toLowerCase();
    if (lower.includes('lecture') || lower === 'lec') return 'LEC';
    if (lower.includes('tutorial') || lower === 'tut') return 'TUT';
    if (lower.includes('lab')) return 'LAB';
    if (lower.includes('seminar') || lower === 'sem') return 'SEM';
  }
  return null;
}

/**
 * Find location in cells
 */
function findLocation(cells: string[]): string | null {
  for (const cell of cells) {
    // Room patterns
    if (/^(Room|Rm\.?|室)\s*\d+/i.test(cell)) return cell;
    if (/^[A-Z]{1,3}\d{2,4}[A-Z]?$/i.test(cell) && !/^[A-Z]{2,4}\d{3,4}[A-Z]?$/i.test(cell)) {
      return cell; // Building code like "LG101"
    }
  }
  return null;
}

/**
 * Find location in a line of text
 */
function findLocationInLine(line: string): string | null {
  const match = line.match(/(?:Room|Rm\.?|室|@)\s*([A-Z0-9\-]+)/i);
  if (match) return match[1];
  return null;
}

/**
 * Extract time from a cell that might have other content
 */
function extractTime(cell: string): string {
  const match = cell.match(/(\d{1,2}:\d{2})/);
  return match ? match[1] : '';
}

/**
 * Normalize time format (handle AM/PM)
 */
function normalizeTime(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return time;
  
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3]?.toUpperCase();
  
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

/**
 * TEST SUITE - Row-list format parser
 * Run in console: import { testRowListParser } from './parsers/text-parser'
 */
export function testRowListParser() {
  const tests = [
    // Valid lines that SHOULD parse
    {
      name: 'Standard row',
      line: 'CCAH3003 CL01 The Process of Design 1 2 08:30 - 09:50 FTC1902',
      shouldParse: true,
      expected: { courseCode: 'CCAH3003', section: 'CL01', day: 'Tue', location: 'FTC1902' }
    },
    {
      name: 'Course with punctuation',
      line: 'CHIN9001 CL02 Modern Chinese: Reading & Writing 2 3 14:00 - 16:50 KEE104',
      shouldParse: true,
      expected: { courseCode: 'CHIN9001', section: 'CL02', day: 'Wed' }
    },
    {
      name: 'Room with hyphen',
      line: 'ECON1001 L01 Principles of Economics 1 4 09:00 - 10:20 CIT-1006',
      shouldParse: true,
      expected: { courseCode: 'ECON1001', location: 'CIT-1006' }
    },
    {
      name: 'Room with plus',
      line: 'MATH2003 T02 Calculus Tutorial 2 5 15:30 - 17:00 KEE105+106',
      shouldParse: true,
      expected: { courseCode: 'MATH2003', location: 'KEE105+106' }
    },
    {
      name: 'Time with dots',
      line: 'COMP3001 CL01 Programming 1 1 8.30-10.20 LG101',
      shouldParse: true,
      expected: { courseCode: 'COMP3001', startTime: '08:30', endTime: '10:20' }
    },
    {
      name: 'Multi-word course name',
      line: 'ARTS1234 CL03 Introduction to Art History and Visual Culture 1 2 10:00 - 12:00 ART201',
      shouldParse: true,
      expected: { courseName: 'Introduction to Art History and Visual Culture' }
    },
    
    // Invalid lines that SHOULD be filtered
    {
      name: 'HKU SPACE header',
      line: 'HKU SPACE',
      shouldParse: false,
    },
    {
      name: 'Just HKU',
      line: 'HKU',
      shouldParse: false,
    },
    {
      name: 'Last updated line',
      line: 'Last updated: 15 December 2024',
      shouldParse: false,
    },
    {
      name: 'Page number',
      line: 'Page 1 of 5',
      shouldParse: false,
    },
    {
      name: 'Column header',
      line: 'Course Code Class No Course Name Semester Weekday Time Room',
      shouldParse: false,
    },
    {
      name: 'Address line',
      line: 'Admiralty Centre Tower 2, 18 Harcourt Road',
      shouldParse: false,
    },
    {
      name: 'No time range',
      line: 'COMP1001 CL01 Programming Basics',
      shouldParse: false,
    },
    {
      name: 'No course code',
      line: 'Introduction to Design 1 2 08:30 - 09:50 FTC1902',
      shouldParse: false,
    },
  ];
  
  console.log('=== ROW-LIST PARSER TEST SUITE ===\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const isCandidate = isCandidateLine(test.line);
    const isFiltered = isNonRowLine(test.line);
    const parsed = isCandidate && !isFiltered ? parseRowListLine(test.line) : null;
    
    const shouldParse = test.shouldParse && !isFiltered;
    const didParse = parsed !== null && parsed.isValid !== false;
    
    if (shouldParse === didParse) {
      passed++;
      console.log(`✅ ${test.name}`);
      
      if (didParse && test.expected) {
        // Verify expected fields
        for (const [key, value] of Object.entries(test.expected)) {
          const actual = (parsed as any)[key];
          if (actual !== value) {
            console.log(`   ⚠️  Expected ${key}="${value}", got "${actual}"`);
          }
        }
      }
    } else {
      failed++;
      console.log(`❌ ${test.name}`);
      console.log(`   Expected: ${shouldParse ? 'PARSE' : 'FILTER'}`);
      console.log(`   Got: ${didParse ? 'PARSED' : 'FILTERED'}`);
      console.log(`   Line: "${test.line}"`);
      if (parsed) {
        console.log(`   Result:`, parsed);
      }
    }
  }
  
  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  
  return { passed, failed, total: tests.length };
}
