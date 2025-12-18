/**
 * Timetable Generator - Time Utilities
 */

import { Meeting, BlackoutBlock } from '../types';

/**
 * Check if two time ranges overlap
 */
export function timesOverlap(
  start1: number, end1: number,
  start2: number, end2: number
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Check if two meetings clash (same day + overlapping time)
 */
export function meetingsClash(m1: Meeting, m2: Meeting): boolean {
  if (m1.day !== m2.day) return false;
  return timesOverlap(m1.startMin, m1.endMin, m2.startMin, m2.endMin);
}

/**
 * Check if a meeting clashes with a blackout block
 */
export function meetingClashesWithBlackout(
  meeting: Meeting, 
  blackout: BlackoutBlock
): boolean {
  if (!blackout.enabled) return false;
  if (meeting.day !== blackout.day) return false;
  return timesOverlap(
    meeting.startMin, meeting.endMin,
    blackout.startMin, blackout.endMin
  );
}

/**
 * Check if an array of meetings has any internal clashes
 */
export function hasInternalClash(meetings: Meeting[]): boolean {
  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      if (meetingsClash(meetings[i], meetings[j])) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if meetings clash with any blackout blocks
 */
export function hasBlackoutClash(
  meetings: Meeting[],
  blackouts: BlackoutBlock[]
): boolean {
  for (const meeting of meetings) {
    for (const blackout of blackouts) {
      if (meetingClashesWithBlackout(meeting, blackout)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get all clashing pairs from an array of meetings
 */
export function getClashingPairs(meetings: Meeting[]): [number, number][] {
  const clashes: [number, number][] = [];
  for (let i = 0; i < meetings.length; i++) {
    for (let j = i + 1; j < meetings.length; j++) {
      if (meetingsClash(meetings[i], meetings[j])) {
        clashes.push([i, j]);
      }
    }
  }
  return clashes;
}

/**
 * Format time in minutes to display string (e.g., "09:30")
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Format time in 12-hour format with AM/PM
 */
export function formatTime12h(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hour12}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get day name from day number
 */
export function getDayName(day: number, short = true): string {
  const longNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return short ? shortNames[day] : longNames[day];
}

/**
 * Calculate gap between two meetings on the same day
 */
export function gapBetween(m1: Meeting, m2: Meeting): number {
  if (m1.day !== m2.day) return 0;
  if (m1.endMin <= m2.startMin) {
    return m2.startMin - m1.endMin;
  }
  if (m2.endMin <= m1.startMin) {
    return m1.startMin - m2.endMin;
  }
  return 0; // They overlap
}

/**
 * Sort meetings chronologically (by day first, then by start time)
 */
export function sortMeetings(meetings: Meeting[]): Meeting[] {
  return [...meetings].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startMin - b.startMin;
  });
}
