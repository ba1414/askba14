/**
 * Timetable Generator - Data Normalizer
 * Converts raw imported rows into structured Course data
 */

import {
  RawMeetingRow,
  Course,
  Section,
  Meeting,
  MeetingType,
  MEETING_TYPES,
  generateId,
  timeToMinutes,
  normalizeDay,
} from '../types';

/**
 * Convert raw meeting rows into structured courses
 */
export function normalizeToCourses(rows: RawMeetingRow[]): Course[] {
  // Filter only valid rows
  const validRows = rows.filter(r => r.isValid);
  
  if (validRows.length === 0) {
    return [];
  }
  
  // Group by course code
  const courseMap = new Map<string, RawMeetingRow[]>();
  for (const row of validRows) {
    const code = normalizeCourseCode(row.courseCode);
    if (!courseMap.has(code)) {
      courseMap.set(code, []);
    }
    courseMap.get(code)!.push(row);
  }
  
  const courses: Course[] = [];
  
  for (const [code, courseRows] of courseMap) {
    // Group by section within this course
    const sectionMap = new Map<string, RawMeetingRow[]>();
    for (const row of courseRows) {
      const sectionKey = normalizeSectionKey(row.section);
      if (!sectionMap.has(sectionKey)) {
        sectionMap.set(sectionKey, []);
      }
      sectionMap.get(sectionKey)!.push(row);
    }
    
    const sections: Section[] = [];
    
    for (const [sectionLabel, sectionRows] of sectionMap) {
      const meetings: Meeting[] = [];
      
      for (const row of sectionRows) {
        const dayNum = normalizeDay(row.day);
        const startMin = timeToMinutes(row.startTime);
        const endMin = timeToMinutes(row.endTime);
        
        if (dayNum !== null && startMin !== null && endMin !== null) {
          meetings.push({
            day: dayNum,
            startMin,
            endMin,
            location: row.location || undefined,
            type: normalizeMeetingType(row.type),
          });
        }
      }
      
      if (meetings.length > 0) {
        sections.push({
          id: generateId(),
          label: sectionLabel,
          meetings,
        });
      }
    }
    
    if (sections.length > 0) {
      courses.push({
        id: generateId(),
        code,
        sections,
      });
    }
  }
  
  return courses;
}

/**
 * Normalize course code to consistent format
 */
function normalizeCourseCode(code: string): string {
  return code.toUpperCase().replace(/\s+/g, '').trim();
}

/**
 * Normalize section key (combine section + type)
 */
function normalizeSectionKey(section: string): string {
  return section.toUpperCase().trim();
}

/**
 * Normalize meeting type string
 */
function normalizeMeetingType(type: string): MeetingType {
  const normalized = type.toUpperCase().trim();
  
  if (normalized.includes('LEC') || normalized.includes('講')) {
    return 'LEC';
  }
  if (normalized.includes('TUT') || normalized.includes('導修')) {
    return 'TUT';
  }
  if (normalized.includes('LAB') || normalized.includes('實驗')) {
    return 'LAB';
  }
  if (normalized.includes('SEM') || normalized.includes('研討')) {
    return 'SEM';
  }
  
  // Check if it's a valid type already
  if (MEETING_TYPES.includes(normalized as MeetingType)) {
    return normalized as MeetingType;
  }
  
  return 'OTHER';
}

/**
 * Validate a raw meeting row and populate error messages
 */
export function validateRow(row: Partial<RawMeetingRow>): RawMeetingRow {
  const errors: string[] = [];
  
  // Check required fields
  if (!row.courseCode?.trim()) {
    errors.push('Missing course code');
  }
  
  if (!row.section?.trim()) {
    errors.push('Missing section');
  }
  
  if (!row.day?.trim()) {
    errors.push('Missing day');
  } else {
    const dayNum = normalizeDay(row.day);
    if (dayNum === null) {
      errors.push(`Invalid day: "${row.day}"`);
    }
  }
  
  if (!row.startTime?.trim()) {
    errors.push('Missing start time');
  } else {
    const startMin = timeToMinutes(row.startTime);
    if (startMin === null) {
      errors.push(`Invalid start time: "${row.startTime}"`);
    }
  }
  
  if (!row.endTime?.trim()) {
    errors.push('Missing end time');
  } else {
    const endMin = timeToMinutes(row.endTime);
    if (endMin === null) {
      errors.push(`Invalid end time: "${row.endTime}"`);
    }
  }
  
  // Check time order
  if (row.startTime && row.endTime) {
    const startMin = timeToMinutes(row.startTime);
    const endMin = timeToMinutes(row.endTime);
    if (startMin !== null && endMin !== null && startMin >= endMin) {
      errors.push('Start time must be before end time');
    }
  }
  
  return {
    id: row.id || generateId(),
    courseCode: row.courseCode || '',
    section: row.section || '',
    type: row.type || '',
    day: row.day || '',
    startTime: row.startTime || '',
    endTime: row.endTime || '',
    location: row.location || '',
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Merge linked sections (e.g., L1 and T1 must be taken together)
 * Handles cases like "L1+T1", "L1/T1", "L1-T1"
 */
export function detectLinkedSections(courses: Course[]): Course[] {
  // For now, return as-is
  // Future enhancement: detect and merge linked sections
  return courses;
}
