/**
 * Timetable Grid Component
 * Displays a weekly schedule grid with meeting blocks
 */

import React from 'react';
import { Schedule, ScheduleSelection, Meeting, DAYS } from '../types';
import { formatTime, getDayName } from '../utils';
import './TimetableGrid.css';

interface TimetableGridProps {
  schedule: Schedule;
  compact?: boolean;
  showLocation?: boolean;
  onMeetingClick?: (selection: ScheduleSelection, meeting: Meeting) => void;
}

const COURSE_COLORS = [
  '#007AFF', '#34C759', '#FF3B30', '#FFCC00', 
  '#AF52DE', '#FF9500', '#5AC8FA', '#FF2D55',
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  schedule,
  compact = false,
  showLocation = true,
  onMeetingClick,
}) => {
  const startHour = 8;
  const endHour = 22;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  
  // Build color map for courses
  const courseColorMap = new Map<string, string>();
  schedule.selections.forEach((selection, index) => {
    if (!courseColorMap.has(selection.courseCode)) {
      courseColorMap.set(selection.courseCode, COURSE_COLORS[courseColorMap.size % COURSE_COLORS.length]);
    }
  });
  
  // Group meetings by day
  const meetingsByDay = new Map<number, { selection: ScheduleSelection; meeting: Meeting }[]>();
  for (let i = 0; i < 7; i++) {
    meetingsByDay.set(i, []);
  }
  
  for (const selection of schedule.selections) {
    for (const meeting of selection.meetings) {
      meetingsByDay.get(meeting.day)?.push({ selection, meeting });
    }
  }
  
  const hourHeight = compact ? 40 : 60;
  
  return (
    <div className={`timetable-grid ${compact ? 'compact' : ''}`}>
      {/* Header row */}
      <div className="timetable-header">
        <div className="time-column-header"></div>
        {[1, 2, 3, 4, 5, 6].map(day => (
          <div key={day} className="day-header">
            {getDayName(day)}
          </div>
        ))}
      </div>
      
      {/* Grid body */}
      <div className="timetable-body" style={{ height: `${hours.length * hourHeight}px` }}>
        {/* Time column */}
        <div className="time-column">
          {hours.map(hour => (
            <div 
              key={hour} 
              className="time-slot"
              style={{ height: `${hourHeight}px` }}
            >
              {formatTime(hour * 60)}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {[1, 2, 3, 4, 5, 6].map(day => (
          <div key={day} className="day-column">
            {/* Hour grid lines */}
            {hours.map(hour => (
              <div 
                key={hour} 
                className="hour-line"
                style={{ 
                  top: `${(hour - startHour) * hourHeight}px`,
                  height: `${hourHeight}px`,
                }}
              />
            ))}
            
            {/* Meeting blocks */}
            {meetingsByDay.get(day)?.map(({ selection, meeting }, idx) => {
              const top = ((meeting.startMin / 60) - startHour) * hourHeight;
              const height = ((meeting.endMin - meeting.startMin) / 60) * hourHeight;
              const color = courseColorMap.get(selection.courseCode) || COURSE_COLORS[0];
              
              return (
                <div
                  key={`${selection.courseId}-${meeting.startMin}-${idx}`}
                  className="meeting-block"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: color,
                  }}
                  onClick={() => onMeetingClick?.(selection, meeting)}
                >
                  <div className="meeting-code">{selection.courseCode}</div>
                  <div className="meeting-section">{selection.sectionLabel}</div>
                  {showLocation && meeting.location && height > 50 && (
                    <div className="meeting-location">{meeting.location}</div>
                  )}
                  {height > 60 && (
                    <div className="meeting-time">
                      {formatTime(meeting.startMin)} - {formatTime(meeting.endMin)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
