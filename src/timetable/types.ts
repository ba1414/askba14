/**
 * Timetable Generator - Core Data Types
 * Normalized data model for all imports
 */

// ============================================
// CORE DATA MODELS
// ============================================

/**
 * A single class meeting (one time slot)
 */
export interface Meeting {
  day: number;           // 0=Sunday, 1=Monday, ..., 6=Saturday
  startMin: number;      // Minutes since 00:00 (e.g., 9:30am = 570)
  endMin: number;        // Minutes since 00:00 (e.g., 10:20am = 620)
  location?: string;     // Room/building
  type?: MeetingType;    // LEC/TUT/LAB
}

export type MeetingType = 'LEC' | 'TUT' | 'LAB' | 'SEM' | 'OTHER';

/**
 * A section of a course (e.g., L1, T2, L1+T2)
 */
export interface Section {
  id: string;
  label: string;         // e.g., "L1", "T2", "L1+T2"
  meetings: Meeting[];
}

/**
 * A course with multiple section options
 */
export interface Course {
  id: string;
  code: string;          // e.g., "COMP1010"
  title?: string;        // Optional course title
  sections: Section[];
}

/**
 * A blackout/blocked time period
 */
export interface BlackoutBlock {
  id: string;
  label: string;         // e.g., "Part-time Job", "Gym", "Day-off"
  day: number;           // 0-6
  startMin: number;
  endMin: number;
  enabled: boolean;
}

/**
 * A generated schedule (selection of one section per course)
 */
export interface Schedule {
  id: string;
  selections: ScheduleSelection[];
  metrics: ScheduleMetrics;
}

export interface ScheduleSelection {
  courseId: string;
  courseCode: string;
  sectionId: string;
  sectionLabel: string;
  meetings: Meeting[];
}

export interface ScheduleMetrics {
  dayOffCount: number;      // Number of weekdays with no classes (Mon-Fri)
  totalGapMinutes: number;  // Sum of idle time between classes
  earliestStart: number;    // Earliest class start time (minutes)
  latestEnd: number;        // Latest class end time (minutes)
  daysWithClasses: number[];// Which days have classes
}

/**
 * A pinned schedule for quick access
 */
export interface PinnedSchedule {
  id: string;
  name: string;            // User-editable name
  createdAt: number;       // Timestamp
  schedule: Schedule;
}

// ============================================
// IMPORT/PARSING TYPES
// ============================================

/**
 * Raw extracted row from any import source
 * (before normalization)
 */
export interface RawMeetingRow {
  id: string;
  courseCode: string;
  section: string;
  type: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  isValid: boolean;
  errors: string[];
  raw?: string;
  courseName?: string;
  status?: 'needs-fixing' | 'ok';
}

/**
 * Supported file types for import
 */
export type ImportFileType = 
  | 'pdf-text' 
  | 'pdf-ocr' 
  | 'xlsx' 
  | 'csv' 
  | 'ics' 
  | 'image' 
  | 'docx' 
  | 'html' 
  | 'text' 
  | 'json';

/**
 * Import parsing result
 */
export interface ParseResult {
  success: boolean;
  fileType: ImportFileType;
  rows: RawMeetingRow[];
  warnings: string[];
  errors: string[];
}

/**
 * Column mapping for CSV/XLSX imports
 */
export interface ColumnMapping {
  courseCode: number | null;
  section: number | null;
  type: number | null;
  day: number | null;
  startTime: number | null;
  endTime: number | null;
  location: number | null;
}

// ============================================
// GENERATION CONSTRAINTS
// ============================================

export interface GenerationConstraints {
  noClassesBefore?: number;    // Minutes since 00:00
  noClassesAfter?: number;     // Minutes since 00:00
  preferFewerGaps: boolean;
  preferDayOff: boolean;
  maxResults: number;
}

export const DEFAULT_CONSTRAINTS: GenerationConstraints = {
  noClassesBefore: undefined,
  noClassesAfter: undefined,
  preferFewerGaps: true,
  preferDayOff: true,
  maxResults: 20,
};

// ============================================
// UI STATE TYPES
// ============================================

export type AppScreen = 'import' | 'review' | 'generate' | 'export';

export interface AppState {
  currentScreen: AppScreen;
  rawRows: RawMeetingRow[];
  courses: Course[];
  selectedCourseIds: Set<string>;
  blackoutBlocks: BlackoutBlock[];
  constraints: GenerationConstraints;
  generatedSchedules: Schedule[];
  pinnedSchedules: PinnedSchedule[];
  selectedSchedule: Schedule | null;
}

// ============================================
// CONSTANTS
// ============================================

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const WEEKDAYS = [1, 2, 3, 4, 5] as const; // Mon-Fri for day-off calculation

export const MEETING_TYPES: MeetingType[] = ['LEC', 'TUT', 'LAB', 'SEM', 'OTHER'];

/**
 * Convert time string to minutes since midnight
 */
export function timeToMinutes(time: string): number | null {
  // Handle various formats: "09:30", "0930", "9:30", "9.30"
  const cleaned = time.replace(/[.\s]/g, ':').replace(/:+/g, ':');
  
  // Try HH:MM format
  let match = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    if (hours >= 0 && hours < 24 && mins >= 0 && mins < 60) {
      return hours * 60 + mins;
    }
  }
  
  // Try HHMM format
  match = cleaned.match(/^(\d{3,4})$/);
  if (match) {
    const num = match[1].padStart(4, '0');
    const hours = parseInt(num.slice(0, 2), 10);
    const mins = parseInt(num.slice(2), 10);
    if (hours >= 0 && hours < 24 && mins >= 0 && mins < 60) {
      return hours * 60 + mins;
    }
  }
  
  return null;
}

/**
 * Convert minutes since midnight to time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Normalize day string to day number
 */
export function normalizeDay(day: string): number | null {
  const normalized = day.trim().toLowerCase();
  
  const dayMappings: Record<string, number> = {
    'sun': 0, 'sunday': 0, '日': 0, '週日': 0, '星期日': 0,
    'mon': 1, 'monday': 1, '一': 1, '週一': 1, '星期一': 1,
    'tue': 2, 'tuesday': 2, '二': 2, '週二': 2, '星期二': 2,
    'wed': 3, 'wednesday': 3, '三': 3, '週三': 3, '星期三': 3,
    'thu': 4, 'thursday': 4, '四': 4, '週四': 4, '星期四': 4,
    'fri': 5, 'friday': 5, '五': 5, '週五': 5, '星期五': 5,
    'sat': 6, 'saturday': 6, '六': 6, '週六': 6, '星期六': 6,
  };
  
  // Direct match
  if (dayMappings[normalized] !== undefined) {
    return dayMappings[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(dayMappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
