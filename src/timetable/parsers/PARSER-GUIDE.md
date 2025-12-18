# Timetable Parser Guide

## Overview

The timetable parser supports multiple formats with a layered approach:
1. **Row-list format** (primary) - HKU SPACE style
2. **Table format** (fallback) - Delimited tables (tabs/pipes/spaces)
3. **Line-by-line** (fallback) - Free-form text parsing

## Row-List Format (Primary Parser)

### Format Specification

**Column Structure:**
```
Course Code | Class No | Course Name | Semester | Weekday | Time | Room
```

**Example Row:**
```
CCAH3003 CL01 The Process of Design 1 2 08:30 - 09:50 FTC1902
```

### Parsing Algorithm

The parser uses **right-anchored parsing** to handle multi-word course names:

1. **Find time range** (anchor point)
   - Regex: `/(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/`
   - Matches: "08:30 - 09:50", "8.30–9.50", etc.

2. **Extract from right side** (after time)
   - Room = first token after time
   - Supports: "FTC1902", "CIT-1006", "KEE105+106"

3. **Extract from right side** (before time)
   - Last token = weekday (numeric 1-7)
   - Second-to-last = semester (1 or 2)

4. **Extract from left side**
   - First token = course code
   - Second token = class/section number

5. **Middle tokens = course name**
   - Everything between class number and semester
   - Preserves spaces and punctuation

### Filtering Rules

**Lines are DISCARDED if they contain:**
- "HKU", "SPACE", or "HKU SPACE"
- "Last updated", "Page X of Y"
- Column headers (Course, Class, Name, etc.)
- Address/contact info (Admiralty, Tel:, www.)
- No time range
- No valid course code at start

**Course Code Pattern:**
```regex
^[A-Z]{3,6}\d{4}\b
```
Examples: CCAH3003, CHIN9001, COMP1010

### Candidate Detection

A line is considered a **candidate** if:
1. Contains valid time range, AND
2. Starts with valid course code

```typescript
function isCandidateLine(line: string): boolean {
  if (!TIME_RANGE_REGEX.test(line)) return false;
  const firstToken = line.split(/\s+/)[0];
  if (!COURSE_CODE_REGEX.test(firstToken)) return false;
  return true;
}
```

### Weekday Mapping

```typescript
const NUMERIC_WEEKDAY_MAP = {
  '1': 0, // Monday
  '2': 1, // Tuesday
  '3': 2, // Wednesday
  '4': 3, // Thursday
  '5': 4, // Friday
  '6': 5, // Saturday
  '7': 6, // Sunday
};
```

## Test Suite

### Running Tests

```typescript
import { testRowListParser } from './parsers/text-parser';

// In browser console or test file
testRowListParser();
```

### Test Cases Included

**Valid rows:**
- Standard format
- Course names with punctuation
- Rooms with hyphens (CIT-1006)
- Rooms with plus signs (KEE105+106)
- Times with dots (8.30–9.50)
- Multi-word course names

**Invalid rows (should be filtered):**
- "HKU SPACE" branding
- Page numbers
- Column headers
- Address lines
- Lines without time ranges
- Lines without course codes

## Debug Information

The parser provides debug info in console and UI:

```typescript
interface ParseDebugInfo {
  extractedChars: number;    // Total characters extracted
  totalLines: number;         // Lines in input
  candidateLines: number;     // Lines matching criteria
  parsedRows: number;         // Successfully parsed
  needsFixingRows: number;    // Parsed but has issues
  filteredLines: number;      // Discarded as non-rows
  preview: string[];          // First 50 lines
}
```

**View in UI:**
- Open Review screen
- Click "🔍 Debug Info" section
- Shows: total rows, valid/invalid counts, unique courses

## Course Counting

**Courses detected** = Count of unique course codes
```typescript
const uniqueCourses = new Set(
  rows.filter(r => r.isValid).map(r => r.courseCode)
).size;
```

**Class options** = Count of unique (course + section)
```typescript
const uniqueOptions = new Set(
  rows.filter(r => r.isValid).map(r => `${r.courseCode}:${r.section}`)
).size;
```

## Safety Net

Lines with time ranges that fail parsing are NOT silently dropped:

```typescript
if (parseError) {
  return {
    id: generateId(),
    courseCode: tokens[0] || 'UNKNOWN',
    section: tokens[1] || '',
    // ... other fields
    raw: line,
    status: 'needs-fixing',
    isValid: false,
    errors: [errorMessage],
  };
}
```

These appear as "Need fixing" rows in the Review screen.

## Format Adapters (Future)

To add support for other formats without breaking existing parser:

```typescript
interface FormatAdapter {
  name: string;
  detect: (lines: string[]) => boolean;
  parse: (lines: string[]) => RawMeetingRow[];
}

const adapters: FormatAdapter[] = [
  { name: 'hku-space-rowlist', detect: detectHKUSpace, parse: parseRowList },
  { name: 'standard-table', detect: detectTable, parse: parseTable },
  { name: 'custom-format', detect: detectCustom, parse: parseCustom },
];
```

## Integration Points

### PDF.js Text Extraction
```typescript
// In pdf-parser.ts
const textResult = await parseText(allText);
// Uses row-list parser automatically
```

### OCR Output
```typescript
// In image-parser.ts
const ocrResult = await worker.recognize(image);
const textResult = await parseText(ocrResult.data.text);
// Same parser handles OCR text
```

## Regular Expressions Used

```typescript
// Time range (flexible formats)
const TIME_RANGE_REGEX = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;

// Course code (HKU SPACE format)
const COURSE_CODE_REGEX = /^[A-Z]{3,6}\d{4}\b/;

// Non-row patterns (headers/footers)
const NON_ROW_PATTERNS = [
  /^(HKU|SPACE)$/i,
  /HKU\s+SPACE/i,
  /Last\s+updated/i,
  /Page\s+\d+/i,
  /^(Course|Class|Name|Semester|Week|Time|Room|Day|Code|No\.?)/i,
  /Admiral.+Road/i,
  /Pokfulam/i,
  /Tel:/i,
  /Fax:/i,
  /www\./i,
  /https?:/i,
];
```

## Troubleshooting

### Problem: Parser returns 0 rows

**Check:**
1. Open browser DevTools console
2. Look for "Parse Debug:" log
3. Check `candidateLines` count
   - If 0: Lines don't have time ranges or course codes
   - If >0 but parsedRows=0: Parsing logic issue

### Problem: Wrong course codes detected

**Check:**
1. View Debug Info in UI
2. Check "Sample courses" list
3. If seeing "HKU" or "SPACE": Filter patterns not working
4. Add more patterns to `NON_ROW_PATTERNS`

### Problem: Course names truncated

**Likely cause:** Not using right-anchored parsing
- Ensure using `parseRowListLine` not `extractFromLine`
- Check tokens.slice(2, tokens.length - 2) logic

## Performance

Typical performance on 100-row timetable:
- Text extraction: 200-500ms
- Candidate filtering: 5-10ms
- Parsing: 10-20ms
- Total: ~500ms

OCR adds significant time:
- OCR processing: 5-10 seconds per page
- Use text extraction when possible
