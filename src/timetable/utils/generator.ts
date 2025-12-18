/**
 * Timetable Generator - Schedule Generation Algorithm
 * 
 * Uses backtracking to enumerate all valid combinations of sections,
 * with early pruning for clashes and blackout blocks.
 */

import {
  Course,
  Section,
  Meeting,
  BlackoutBlock,
  Schedule,
  ScheduleSelection,
  ScheduleMetrics,
  GenerationConstraints,
  WEEKDAYS,
  generateId,
} from '../types';
import { hasInternalClash, hasBlackoutClash, gapBetween, sortMeetings } from './time';

/**
 * Generate all valid schedules for a set of courses
 */
export function generateSchedules(
  courses: Course[],
  blackouts: BlackoutBlock[],
  constraints: GenerationConstraints
): Schedule[] {
  const enabledBlackouts = blackouts.filter(b => b.enabled);
  const results: Schedule[] = [];
  
  // If no courses, return empty
  if (courses.length === 0) {
    return [];
  }
  
  // Backtracking search
  function backtrack(
    courseIndex: number,
    currentSelections: ScheduleSelection[],
    currentMeetings: Meeting[]
  ) {
    // Base case: all courses assigned
    if (courseIndex === courses.length) {
      const metrics = calculateMetrics(currentMeetings);
      results.push({
        id: generateId(),
        selections: [...currentSelections],
        metrics,
      });
      return;
    }
    
    // Limit results to prevent memory issues
    if (results.length >= constraints.maxResults * 10) {
      return;
    }
    
    const course = courses[courseIndex];
    
    // Try each section for this course
    for (const section of course.sections) {
      // Early pruning: check if adding this section causes clashes
      const newMeetings = [...currentMeetings, ...section.meetings];
      
      // Check time constraints
      if (constraints.noClassesBefore !== undefined) {
        if (section.meetings.some(m => m.startMin < constraints.noClassesBefore!)) {
          continue;
        }
      }
      
      if (constraints.noClassesAfter !== undefined) {
        if (section.meetings.some(m => m.endMin > constraints.noClassesAfter!)) {
          continue;
        }
      }
      
      // Check for internal clashes with existing selections
      if (hasInternalClash(newMeetings)) {
        continue;
      }
      
      // Check for blackout clashes
      if (hasBlackoutClash(section.meetings, enabledBlackouts)) {
        continue;
      }
      
      // Valid section, recurse
      const selection: ScheduleSelection = {
        courseId: course.id,
        courseCode: course.code,
        sectionId: section.id,
        sectionLabel: section.label,
        meetings: section.meetings,
      };
      
      currentSelections.push(selection);
      backtrack(courseIndex + 1, currentSelections, newMeetings);
      currentSelections.pop();
    }
  }
  
  backtrack(0, [], []);
  
  // Sort and rank results
  const ranked = rankSchedules(results, constraints);
  
  // Return top N results
  return ranked.slice(0, constraints.maxResults);
}

/**
 * Calculate metrics for a schedule
 */
function calculateMetrics(meetings: Meeting[]): ScheduleMetrics {
  if (meetings.length === 0) {
    return {
      dayOffCount: 5, // All weekdays free
      totalGapMinutes: 0,
      earliestStart: 0,
      latestEnd: 0,
      daysWithClasses: [],
    };
  }
  
  // Group meetings by day
  const byDay = new Map<number, Meeting[]>();
  for (const m of meetings) {
    if (!byDay.has(m.day)) {
      byDay.set(m.day, []);
    }
    byDay.get(m.day)!.push(m);
  }
  
  // Calculate day-off count (Mon-Fri only)
  const daysWithClasses = Array.from(byDay.keys()).filter(d => WEEKDAYS.includes(d as typeof WEEKDAYS[number]));
  const dayOffCount = WEEKDAYS.length - new Set(daysWithClasses).size;
  
  // Calculate total gap minutes
  let totalGapMinutes = 0;
  for (const [, dayMeetings] of byDay) {
    const sorted = sortMeetings(dayMeetings);
    for (let i = 0; i < sorted.length - 1; i++) {
      totalGapMinutes += gapBetween(sorted[i], sorted[i + 1]);
    }
  }
  
  // Calculate earliest start and latest end
  const earliestStart = Math.min(...meetings.map(m => m.startMin));
  const latestEnd = Math.max(...meetings.map(m => m.endMin));
  
  return {
    dayOffCount,
    totalGapMinutes,
    earliestStart,
    latestEnd,
    daysWithClasses: Array.from(byDay.keys()).sort(),
  };
}

/**
 * Rank schedules by preference (most day-off first)
 */
function rankSchedules(
  schedules: Schedule[],
  constraints: GenerationConstraints
): Schedule[] {
  return [...schedules].sort((a, b) => {
    // Primary: Most day-off days first
    if (constraints.preferDayOff) {
      const dayOffDiff = b.metrics.dayOffCount - a.metrics.dayOffCount;
      if (dayOffDiff !== 0) return dayOffDiff;
    }
    
    // Secondary: Fewer gaps first
    if (constraints.preferFewerGaps) {
      const gapDiff = a.metrics.totalGapMinutes - b.metrics.totalGapMinutes;
      if (gapDiff !== 0) return gapDiff;
    }
    
    // Tertiary: Later start time (sleep in!)
    const startDiff = b.metrics.earliestStart - a.metrics.earliestStart;
    if (startDiff !== 0) return startDiff;
    
    // Quaternary: Earlier end time
    return a.metrics.latestEnd - b.metrics.latestEnd;
  });
}

/**
 * Quick check if any valid schedule exists
 */
export function hasValidSchedule(
  courses: Course[],
  blackouts: BlackoutBlock[],
  constraints: GenerationConstraints
): boolean {
  const limitedConstraints = { ...constraints, maxResults: 1 };
  const results = generateSchedules(courses, blackouts, limitedConstraints);
  return results.length > 0;
}

/**
 * Get section combinations count (for progress estimation)
 */
export function getSectionCombinationsCount(courses: Course[]): number {
  return courses.reduce((acc, course) => acc * course.sections.length, 1);
}
