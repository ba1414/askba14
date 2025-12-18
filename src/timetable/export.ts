/**
 * Export Functions for Timetable Generator
 * Supports ICS (iCalendar), PNG, and JSON export
 */

import { Schedule, PinnedSchedule, DAYS, minutesToTime } from './types';
import { sortMeetings, formatTime, getDayName } from './utils';

// ============================================
// ICS EXPORT
// ============================================

/**
 * Generate ICS content for a schedule
 */
export function generateICS(
  schedule: Schedule,
  options: {
    semesterStart: Date;
    semesterWeeks: number;
    excludeWeeks?: number[];
  }
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timetable Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Timetable',
  ];
  
  const { semesterStart, semesterWeeks, excludeWeeks = [] } = options;
  
  // Generate events for each meeting across all weeks
  for (const selection of schedule.selections) {
    for (const meeting of selection.meetings) {
      // Find first occurrence of this day of week
      const firstDate = getFirstDayOfWeek(semesterStart, meeting.day);
      
      // Generate RRULE for recurring event
      const rruleCount = semesterWeeks - excludeWeeks.length;
      const excludeDates = excludeWeeks.map(week => {
        const date = new Date(firstDate);
        date.setDate(date.getDate() + (week - 1) * 7);
        return formatICSDate(date);
      });
      
      const eventId = `${selection.courseCode}-${selection.sectionLabel}-${meeting.day}-${meeting.startMin}`;
      const summary = `${selection.courseCode} ${selection.sectionLabel}`;
      const description = meeting.type ? `Type: ${meeting.type}` : '';
      
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${eventId}@timetable-generator`);
      lines.push(`DTSTAMP:${formatICSDateTime(new Date())}`);
      lines.push(`DTSTART:${formatICSDateTime(setTime(firstDate, meeting.startMin))}`);
      lines.push(`DTEND:${formatICSDateTime(setTime(firstDate, meeting.endMin))}`);
      lines.push(`RRULE:FREQ=WEEKLY;COUNT=${rruleCount}`);
      
      if (excludeDates.length > 0) {
        lines.push(`EXDATE:${excludeDates.join(',')}`);
      }
      
      lines.push(`SUMMARY:${escapeICS(summary)}`);
      
      if (description) {
        lines.push(`DESCRIPTION:${escapeICS(description)}`);
      }
      
      if (meeting.location) {
        lines.push(`LOCATION:${escapeICS(meeting.location)}`);
      }
      
      lines.push('END:VEVENT');
    }
  }
  
  lines.push('END:VCALENDAR');
  
  return lines.join('\r\n');
}

/**
 * Download ICS file
 */
export function downloadICS(schedule: Schedule, filename = 'timetable.ics'): void {
  // Default: next Monday, 14 weeks
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7 || 7));
  
  const icsContent = generateICS(schedule, {
    semesterStart: nextMonday,
    semesterWeeks: 14,
  });
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  downloadBlob(blob, filename);
}

// ============================================
// PNG EXPORT
// ============================================

/**
 * Generate timetable as PNG image
 */
export async function generatePNG(
  schedule: Schedule,
  options: {
    theme?: 'light' | 'dark';
    showLocation?: boolean;
  } = {}
): Promise<Blob> {
  const { theme = 'light', showLocation = true } = options;
  
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  
  // Dimensions
  const dayWidth = 160;
  const hourHeight = 60;
  const headerHeight = 50;
  const timeColumnWidth = 60;
  const startHour = 8;
  const endHour = 22;
  const hours = endHour - startHour;
  
  canvas.width = timeColumnWidth + dayWidth * 6; // Mon-Sat
  canvas.height = headerHeight + hourHeight * hours;
  
  // Colors
  const colors = theme === 'dark' 
    ? {
        bg: '#1a1a1a',
        headerBg: '#2a2a2a',
        text: '#ffffff',
        textMuted: '#888888',
        grid: '#333333',
        courseColors: ['#4A90D9', '#50C878', '#FF6B6B', '#FFD93D', '#9B59B6', '#F39C12', '#1ABC9C', '#E74C3C'],
      }
    : {
        bg: '#ffffff',
        headerBg: '#f5f5f7',
        text: '#1d1d1f',
        textMuted: '#86868b',
        grid: '#e5e5e5',
        courseColors: ['#007AFF', '#34C759', '#FF3B30', '#FFCC00', '#AF52DE', '#FF9500', '#5AC8FA', '#FF2D55'],
      };
  
  // Background
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Header background
  ctx.fillStyle = colors.headerBg;
  ctx.fillRect(0, 0, canvas.width, headerHeight);
  
  // Draw day headers
  ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = colors.text;
  
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 6; i++) {
    const x = timeColumnWidth + dayWidth * i + dayWidth / 2;
    ctx.fillText(dayLabels[i], x, headerHeight / 2 + 5);
  }
  
  // Draw time labels
  ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = colors.textMuted;
  
  for (let h = startHour; h <= endHour; h++) {
    const y = headerHeight + (h - startHour) * hourHeight;
    ctx.fillText(`${h}:00`, timeColumnWidth - 8, y + 4);
  }
  
  // Draw grid lines
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  
  // Horizontal lines
  for (let h = startHour; h <= endHour; h++) {
    const y = headerHeight + (h - startHour) * hourHeight;
    ctx.beginPath();
    ctx.moveTo(timeColumnWidth, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Vertical lines
  for (let i = 0; i <= 6; i++) {
    const x = timeColumnWidth + dayWidth * i;
    ctx.beginPath();
    ctx.moveTo(x, headerHeight);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Draw meetings
  const courseColorMap = new Map<string, string>();
  let colorIndex = 0;
  
  for (const selection of schedule.selections) {
    if (!courseColorMap.has(selection.courseCode)) {
      courseColorMap.set(selection.courseCode, colors.courseColors[colorIndex % colors.courseColors.length]);
      colorIndex++;
    }
    
    const color = courseColorMap.get(selection.courseCode)!;
    
    for (const meeting of selection.meetings) {
      // Skip Sunday (0)
      if (meeting.day === 0) continue;
      
      const dayIndex = meeting.day - 1; // Mon=0, Tue=1, etc.
      if (dayIndex >= 6) continue; // Skip if beyond Saturday
      
      const x = timeColumnWidth + dayWidth * dayIndex + 2;
      const startY = headerHeight + ((meeting.startMin / 60) - startHour) * hourHeight;
      const endY = headerHeight + ((meeting.endMin / 60) - startHour) * hourHeight;
      const height = endY - startY;
      
      // Meeting block
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, startY, dayWidth - 4, height, 6);
      ctx.fill();
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(selection.courseCode, x + 6, startY + 16);
      
      ctx.font = '400 11px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      ctx.fillText(selection.sectionLabel, x + 6, startY + 30);
      
      if (showLocation && meeting.location && height > 50) {
        ctx.fillText(meeting.location, x + 6, startY + 44);
      }
    }
  }
  
  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Could not generate PNG'));
      }
    }, 'image/png');
  });
}

/**
 * Download PNG file
 */
export async function downloadPNG(schedule: Schedule, filename = 'timetable.png'): Promise<void> {
  const blob = await generatePNG(schedule);
  downloadBlob(blob, filename);
}

// ============================================
// JSON EXPORT
// ============================================

/**
 * Export schedule as JSON
 */
export function exportScheduleJSON(schedule: Schedule): string {
  return JSON.stringify(schedule, null, 2);
}

/**
 * Export pinned schedules as JSON
 */
export function exportPinnedJSON(pinned: PinnedSchedule[]): string {
  return JSON.stringify(pinned, null, 2);
}

/**
 * Download JSON file
 */
export function downloadJSON(data: unknown, filename = 'timetable.json'): void {
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  downloadBlob(blob, filename);
}

// ============================================
// HELPERS
// ============================================

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get first occurrence of a day of week on or after a date
 */
function getFirstDayOfWeek(startDate: Date, dayOfWeek: number): Date {
  const date = new Date(startDate);
  const diff = (dayOfWeek - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date;
}

/**
 * Set time on a date from minutes since midnight
 */
function setTime(date: Date, minutes: number): Date {
  const result = new Date(date);
  result.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return result;
}

/**
 * Format date for ICS (YYYYMMDD)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}

/**
 * Format datetime for ICS (YYYYMMDDTHHMMSS)
 */
function formatICSDateTime(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0];
}

/**
 * Escape text for ICS format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
