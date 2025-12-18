# Timetable Parser - Quick Reference Card

## 🎯 Purpose
Parse HKU SPACE master timetable PDFs into structured course data

## 📋 Expected Format
```
CCAH3003 CL01 The Process of Design 1 2 08:30 - 09:50 FTC1902
│        │    │                      │ │ │              │
│        │    │                      │ │ └─Time        └─Room
│        │    │                      │ └─Weekday (1-7)
│        │    │                      └─Semester (1-2)
│        │    └─Course Name (multi-word)
│        └─Class/Section Number
└─Course Code (3-6 letters + 4 digits)
```

## ✅ Valid Course Codes
- Pattern: `^[A-Z]{3,6}\d{4}\b`
- Examples: `CCAH3003`, `CHIN9001`, `COMP3045`
- Counter-examples: `HKU`, `SPACE`, `CL01`

## ⏰ Time Range Formats
All supported:
- `08:30 - 09:50` ← Standard
- `8:30-9:50` ← No spaces
- `8.30–9.50` ← Dots, en-dash
- `18:00 - 21:00` ← Evening classes

## 📅 Weekday Mapping
```
1 → Mon    5 → Fri
2 → Tue    6 → Sat
3 → Wed    7 → Sun
4 → Thu
```

## 🏫 Room Formats
All supported:
- `FTC1902` ← Standard
- `CIT-1006` ← With hyphen
- `KEE105+106` ← Multiple rooms
- `SCI-LAB3` ← Lab notation

## 🚫 Filtered Lines
Auto-discarded:
- "HKU", "SPACE", "HKU SPACE"
- "Last updated: ..."
- "Page X of Y"
- Column headers
- Address/contact info
- Lines without time ranges
- Lines without course codes

## 📊 Counting Logic

### Courses Detected
Count of **unique course codes**
```typescript
uniqueCourses = new Set(rows.map(r => r.courseCode)).size
```
Example: `CCAH3003`, `CHIN9001` → **2 courses**

### Class Options
Count of **unique (course + section)** pairs
```typescript
uniqueOptions = new Set(rows.map(r => `${code}:${section}`)).size
```
Example: `CCAH3003:CL01`, `CCAH3003:CL02` → **2 options**

## 🔍 Debug Info

### Console Output
```javascript
Parse Debug: {
  extractedChars: 5432,
  totalLines: 45,
  candidateLines: 12,    // ← Should be > 0
  parsedRows: 10,        // ← Should match valid rows
  filteredLines: 33      // ← Headers/footers removed
}
```

### UI Panel
Click "🔍 Debug Info" to see:
- Total rows extracted
- Valid/Invalid/Needs fixing
- Unique courses & options
- Sample course names

## 🧪 Test Command
```typescript
import { testRowListParser } from './parsers/text-parser';
testRowListParser();
```

## 🎨 Status Indicators

| Status | Meaning | Action |
|--------|---------|--------|
| ✓ Valid | Parsed successfully | No action needed |
| ! Invalid | Missing required fields | Edit in Review screen |
| ⚠️ Needs fixing | Parsed with warnings | Verify & fix |

## 🔧 Troubleshooting

### Problem: 0 courses detected
1. Check console for "Parse Debug"
2. If `candidateLines = 0`: PDF format different
3. If `filteredLines = all`: All lines are headers

### Problem: Wrong course codes
1. Open Debug Info panel
2. Check "Sample courses" list
3. If seeing "HKU"/"SPACE": Update filter patterns

### Problem: Course names truncated
1. Verify using `parseRowListLine` (right-anchored)
2. Check tokens.slice(2, -2) includes all name parts

## 📐 Parsing Algorithm

```
1. Find time range → Anchor point
2. Split at time
3. Extract room (after time, first token)
4. Extract weekday (before time, last token)
5. Extract semester (before time, 2nd-last token)
6. Extract course code (first token)
7. Extract class no (2nd token)
8. Join middle tokens → course name
```

## 🎯 Success Criteria

✅ `candidateLines > 0`
✅ `parsedRows ≈ candidateLines`
✅ `uniqueCourses` shows real codes (not "HKU")
✅ Course names have spaces preserved
✅ Numeric weekdays converted to Mon/Tue/etc.

## 📚 Documentation

- **Full Guide**: `src/timetable/parsers/PARSER-GUIDE.md`
- **Flow Diagram**: `PARSER-FLOW-DIAGRAM.md`
- **Implementation**: `PARSER-FIX-SUMMARY.md`
- **Test Data**: `src/timetable/parsers/test-data.ts`

## 🚀 Performance Targets

| Operation | Time |
|-----------|------|
| Text extraction | 200-500ms |
| Candidate filtering | 5-10ms |
| Parsing (100 rows) | 10-20ms |
| **Total** | **~500ms** |

OCR fallback: +5-10 seconds per page

## 💡 Key Regex Patterns

```javascript
// Time range
/(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/

// Course code
/^[A-Z]{3,6}\d{4}\b/

// Non-row keywords
/HKU\s+SPACE/i
/Last\s+updated/i
/Page\s+\d+/i
```

## 🎓 Example Transformations

```
INPUT:  "CHIN9001 CL02 Modern Chinese: Reading & Writing 2 3 14:00 - 16:50 KEE104"
OUTPUT: {
  courseCode: "CHIN9001",
  section: "CL02",
  courseName: "Modern Chinese: Reading & Writing",
  semester: "2",
  day: "Wed",        // 3 → Wed
  startTime: "14:00",
  endTime: "16:50",
  location: "KEE104"
}
```

## 🔗 Quick Links

- Dev server: http://localhost:8001/askba14/
- Test suite: `testRowListParser()`
- Source: `src/timetable/parsers/text-parser.ts`

---
**Version**: 1.0 | **Updated**: Dec 2024
