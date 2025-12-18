/**
 * Parser Web Worker
 * Handles all heavy parsing operations off the main thread
 */

import { ParseResult, RawMeetingRow } from '../types';
import { parseText } from '../parsers/text-parser';

export interface ParserMessage {
  type: 'parse-text' | 'parse-pdf' | 'cancel';
  payload?: any;
  id: string;
}

export interface ParserResponse {
  type: 'progress' | 'result' | 'error' | 'debug';
  id: string;
  data?: any;
}

interface DebugInfo {
  extractedChars: number;
  totalLines: number;
  candidateLines: number;
  parsedRows: number;
  needsFixingRows: number;
  filteredLines: number;
  rejectedLines: Array<{ line: string; reason: string }>;
  firstLines: string[];
  parseMethod: 'row-list' | 'table' | 'line-by-line';
}

let aborted = false;

self.onmessage = async (e: MessageEvent<ParserMessage>) => {
  const { type, payload, id } = e.data;

  if (type === 'cancel') {
    aborted = true;
    return;
  }

  aborted = false;

  try {
    if (type === 'parse-text') {
      await handleParseText(payload.content, id);
    }
  } catch (error) {
    const response: ParserResponse = {
      type: 'error',
      id,
      data: { error: error instanceof Error ? error.message : String(error) }
    };
    self.postMessage(response);
  }
};

async function handleParseText(content: string, jobId: string) {
  const debugInfo: DebugInfo = {
    extractedChars: content.length,
    totalLines: 0,
    candidateLines: 0,
    parsedRows: 0,
    needsFixingRows: 0,
    filteredLines: 0,
    rejectedLines: [],
    firstLines: [],
    parseMethod: 'row-list'
  };

  // Progress: Starting
  postProgress(jobId, 0, 'Analyzing content...');

  // Split into lines
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  debugInfo.totalLines = lines.length;
  debugInfo.firstLines = lines.slice(0, 20);

  postProgress(jobId, 10, `Processing ${lines.length} lines...`);

  // Send debug info early
  postDebug(jobId, debugInfo);

  if (lines.length === 0) {
    postResult(jobId, {
      success: false,
      fileType: 'text',
      rows: [],
      warnings: [],
      errors: ['No text content found']
    });
    return;
  }

  // Time range regex
  const TIME_RANGE_REGEX = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;
  const COURSE_CODE_REGEX = /^[A-Z]{3,6}\d{4}\b/;

  // Process in chunks to avoid blocking
  const CHUNK_SIZE = 500;
  const candidateLines: string[] = [];

  for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
    if (aborted) {
      postResult(jobId, {
        success: false,
        fileType: 'text',
        rows: [],
        warnings: ['Parsing cancelled'],
        errors: []
      });
      return;
    }

    const chunk = lines.slice(i, Math.min(i + CHUNK_SIZE, lines.length));
    const progress = 10 + (i / lines.length) * 40;
    postProgress(jobId, progress, `Filtering lines ${i}/${lines.length}...`);

    for (const line of chunk) {
      const isNonRow = isNonRowLine(line);
      const hasTime = TIME_RANGE_REGEX.test(line);
      const firstToken = line.split(/\s+/)[0];
      const hasCourseCode = COURSE_CODE_REGEX.test(firstToken);

      if (isNonRow) {
        debugInfo.filteredLines++;
        if (debugInfo.rejectedLines.length < 50) {
          debugInfo.rejectedLines.push({ line: line.substring(0, 80), reason: 'Header/footer pattern' });
        }
        continue;
      }

      if (!hasTime) {
        if (debugInfo.rejectedLines.length < 50 && line.length > 20) {
          debugInfo.rejectedLines.push({ line: line.substring(0, 80), reason: 'No time range' });
        }
        continue;
      }

      if (!hasCourseCode) {
        if (debugInfo.rejectedLines.length < 50) {
          debugInfo.rejectedLines.push({ 
            line: line.substring(0, 80), 
            reason: `Invalid course code: "${firstToken}"` 
          });
        }
        continue;
      }

      candidateLines.push(line);
      debugInfo.candidateLines++;
    }
  }

  postProgress(jobId, 50, `Found ${candidateLines.length} candidates, parsing...`);
  postDebug(jobId, debugInfo);

  // Parse using the imported parser
  const result = await parseText(content, (prog, stage) => {
    postProgress(jobId, 50 + prog * 0.5, stage);
  });

  debugInfo.parsedRows = result.rows.filter(r => r.isValid).length;
  debugInfo.needsFixingRows = result.rows.filter(r => r.status === 'needs-fixing').length;

  postDebug(jobId, debugInfo);
  postResult(jobId, result);
}

function isNonRowLine(line: string): boolean {
  if (!line || line.length < 10) return true;

  const patterns = [
    /^(HKU|SPACE)$/i,
    /^HKU\s+SPACE$/i,
    /School of Professional/i,
    /Last\s+updated/i,
    /Page\s+\d+\s+of/i,
    /^(Course Code|Class No|Course Name|Semester|Weekday|Time|Room)/i,
    /Admiral.+Road/i,
    /Pokfulam/i,
    /Tel:\s*\(/i,
    /Fax:\s*\(/i,
    /^www\./i,
    /^https?:/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(line)) return true;
  }

  return false;
}

function postProgress(id: string, progress: number, stage: string) {
  const response: ParserResponse = {
    type: 'progress',
    id,
    data: { progress, stage }
  };
  self.postMessage(response);
}

function postDebug(id: string, debugInfo: DebugInfo) {
  const response: ParserResponse = {
    type: 'debug',
    id,
    data: debugInfo
  };
  self.postMessage(response);
}

function postResult(id: string, result: ParseResult) {
  const response: ParserResponse = {
    type: 'result',
    id,
    data: result
  };
  self.postMessage(response);
}

export {};
