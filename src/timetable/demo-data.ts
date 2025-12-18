import { RawMeetingRow, generateId } from './types';

export const DEMO_ROWS: RawMeetingRow[] = [
  {
    id: generateId(),
    courseCode: 'COMP1001',
    section: '101',
    type: 'LEC',
    day: 'MON',
    startTime: '09:00',
    endTime: '10:30',
    location: 'Rm 101',
    isValid: true,
    errors: [],
    raw: 'COMP1001 101 LEC MON 09:00-10:30 Rm 101'
  },
  {
    id: generateId(),
    courseCode: 'COMP1001',
    section: '101',
    type: 'TUT',
    day: 'WED',
    startTime: '09:00',
    endTime: '10:00',
    location: 'Rm 102',
    isValid: true,
    errors: [],
    raw: 'COMP1001 101 TUT WED 09:00-10:00 Rm 102'
  },
  {
    id: generateId(),
    courseCode: 'COMP1001',
    section: '102',
    type: 'LEC',
    day: 'TUE',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Rm 101',
    isValid: true,
    errors: [],
    raw: 'COMP1001 102 LEC TUE 14:00-15:30 Rm 101'
  },
  {
    id: generateId(),
    courseCode: 'COMP1001',
    section: '102',
    type: 'TUT',
    day: 'THU',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Rm 102',
    isValid: true,
    errors: [],
    raw: 'COMP1001 102 TUT THU 14:00-15:00 Rm 102'
  },
  {
    id: generateId(),
    courseCode: 'ENG1001',
    section: 'A',
    type: 'LEC',
    day: 'MON',
    startTime: '11:00',
    endTime: '13:00',
    location: 'Hall A',
    isValid: true,
    errors: [],
    raw: 'ENG1001 A LEC MON 11:00-13:00 Hall A'
  },
  {
    id: generateId(),
    courseCode: 'ENG1001',
    section: 'B',
    type: 'LEC',
    day: 'WED',
    startTime: '11:00',
    endTime: '13:00',
    location: 'Hall A',
    isValid: true,
    errors: [],
    raw: 'ENG1001 B LEC WED 11:00-13:00 Hall A'
  },
  {
    id: generateId(),
    courseCode: 'MATH1001',
    section: 'L1',
    type: 'LEC',
    day: 'TUE',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Rm 201',
    isValid: true,
    errors: [],
    raw: 'MATH1001 L1 LEC TUE 09:00-11:00 Rm 201'
  },
  {
    id: generateId(),
    courseCode: 'MATH1001',
    section: 'L2',
    type: 'LEC',
    day: 'THU',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Rm 201',
    isValid: true,
    errors: [],
    raw: 'MATH1001 L2 LEC THU 09:00-11:00 Rm 201'
  }
];
