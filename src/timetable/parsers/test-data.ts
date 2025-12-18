/**
 * Test data for row-list parser validation
 * These are real-world examples from HKU SPACE master timetables
 */

export const VALID_ROWS = [
  'CCAH3003 CL01 The Process of Design 1 2 08:30 - 09:50 FTC1902',
  'CCAH3003 CL02 The Process of Design 1 4 10:00 - 11:20 FTC1902',
  'CHIN9001 CL01 Modern Chinese: Reading & Writing 2 1 18:30 - 21:20 KEE104',
  'CHIN9001 CL02 Modern Chinese: Reading & Writing 2 3 14:00 - 16:50 KEE104',
  'ECON1001 L01 Principles of Economics 1 4 09:00 - 10:20 CIT-1006',
  'COMP3045 T02 Web Development Tutorial 2 5 15:30 - 17:00 KEE105+106',
  'ARTS1234 CL03 Introduction to Art History and Visual Culture 1 2 10:00 - 12:00 ART201',
];

export const INVALID_ROWS = [
  // Branding/headers
  'HKU SPACE',
  'HKU',
  'SPACE',
  'School of Professional and Continuing Education',
  
  // Headers
  'Course Code Class No Course Name Semester Weekday Time Room',
  'Code | Class | Name | Sem | Day | Time | Location',
  
  // Page info
  'Last updated: 15 December 2024',
  'Page 1 of 5',
  'Master Timetable - Semester 1',
  
  // Address/contact
  'Admiralty Centre Tower 2, 18 Harcourt Road',
  'Pokfulam, Hong Kong',
  'Tel: (852) 2910 7555',
  'www.hkuspace.hku.hk',
  
  // Incomplete rows
  'COMP1001 CL01 Programming Basics',
  'Introduction to Design 1 2 08:30 - 09:50 FTC1902',
  
  // Empty/whitespace
  '',
  '     ',
  '\t\t',
];

export const EDGE_CASES = [
  // Time with dots instead of colons
  'COMP3001 CL01 Programming 1 1 8.30-10.20 LG101',
  
  // Rooms with special characters
  'MATH2003 T01 Calculus 2 3 14:00-15:30 CIT-1006',
  'PHYS1002 L02 Physics 1 4 09:00-10:30 KEE105+106',
  'CHEM2001 L01 Chemistry 2 2 11:00-12:30 SCI-LAB3',
  
  // Long course names
  'HIST3456 CL01 Contemporary Hong Kong Society: Politics Economics and Social Issues 1 3 18:00-21:00 HSS301',
  
  // Course names with punctuation
  'ENGL2001 CL02 English: Grammar, Style & Composition 2 1 09:30-11:00 ENG202',
  'FINA3003 CL01 Corporate Finance: Theory & Practice 1 5 14:00-17:00 BUS401',
  
  // Edge time formats
  'STAT2001 T01 Statistics 1 2 08:00-09:30 MATH104',
  'BUSI1001 L01 Business 2 4 19:00-22:00 BUS101',
  
  // Saturday/Sunday classes
  'ARTS2001 W01 Art Workshop 1 6 10:00-16:00 ART-STUDIO',
  'LANG3001 I01 Language Immersion 2 7 09:00-17:00 LANG201',
];

export const EXPECTED_RESULTS = {
  'CCAH3003 CL01 The Process of Design 1 2 08:30 - 09:50 FTC1902': {
    courseCode: 'CCAH3003',
    section: 'CL01',
    courseName: 'The Process of Design',
    day: 'Tue', // weekday 2
    startTime: '08:30',
    endTime: '09:50',
    location: 'FTC1902',
  },
  'CHIN9001 CL02 Modern Chinese: Reading & Writing 2 3 14:00 - 16:50 KEE104': {
    courseCode: 'CHIN9001',
    section: 'CL02',
    courseName: 'Modern Chinese: Reading & Writing',
    day: 'Wed', // weekday 3
    startTime: '14:00',
    endTime: '16:50',
    location: 'KEE104',
  },
  'COMP3001 CL01 Programming 1 1 8.30-10.20 LG101': {
    courseCode: 'COMP3001',
    section: 'CL01',
    courseName: 'Programming',
    day: 'Mon', // weekday 1
    startTime: '08:30', // normalized
    endTime: '10:20',
    location: 'LG101',
  },
};

export const SAMPLE_PDF_TEXT = `
HKU SPACE
School of Professional and Continuing Education
Master Timetable - Semester 1, 2024-25

Course Code Class No Course Name Semester Weekday Time Room

CCAH3003 CL01 The Process of Design 1 2 08:30 - 09:50 FTC1902
CCAH3003 CL02 The Process of Design 1 4 10:00 - 11:20 FTC1902
CHIN9001 CL01 Modern Chinese: Reading & Writing 2 1 18:30 - 21:20 KEE104
CHIN9001 CL02 Modern Chinese: Reading & Writing 2 3 14:00 - 16:50 KEE104
ECON1001 L01 Principles of Economics 1 4 09:00 - 10:20 CIT-1006
COMP3045 T02 Web Development Tutorial 2 5 15:30 - 17:00 KEE105+106

Last updated: 15 December 2024
Page 1 of 1

HKU SPACE
Admiralty Centre Tower 2, 18 Harcourt Road, Admiralty, Hong Kong
Tel: (852) 2910 7555
www.hkuspace.hku.hk
`;

export const EXPECTED_PARSE_RESULT = {
  totalLines: 17, // including empty lines
  candidateLines: 6,
  parsedRows: 6,
  uniqueCourses: 4, // CCAH3003, CHIN9001, ECON1001, COMP3045
  uniqueOptions: 6, // Each class is unique
  courses: ['CCAH3003', 'CHIN9001', 'ECON1001', 'COMP3045'],
};
