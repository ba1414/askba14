/**
 * DOCX Parser for Timetable Data
 * Uses Mammoth to extract text from Word documents
 */

import mammoth from 'mammoth';
import { ParseResult } from '../types';
import { parseText } from './text-parser';

/**
 * Parse DOCX file
 */
export async function parseDOCX(
  buffer: ArrayBuffer,
  onProgress?: (progress: number, stage: string) => void
): Promise<ParseResult> {
  try {
    onProgress?.(10, 'Reading DOCX file...');
    
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    const text = result.value;
    
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        fileType: 'docx',
        rows: [],
        warnings: [],
        errors: ['No text found in DOCX file'],
      };
    }
    
    if (result.messages.length > 0) {
      console.warn('Mammoth messages:', result.messages);
    }
    
    onProgress?.(40, 'Parsing extracted text...');
    
    // Reuse the text parser logic
    const parseResult = await parseText(new File([text], 'extracted.txt', { type: 'text/plain' }), (p, s) => {
      // Map text parser progress (0-100) to remaining progress (40-100)
      onProgress?.(40 + (p * 0.6), s);
    });
    
    return {
      ...parseResult,
      fileType: 'docx',
      warnings: [
        ...result.messages.map(m => `DOCX Warning: ${m.message}`),
        ...parseResult.warnings
      ]
    };
    
  } catch (error) {
    return {
      success: false,
      fileType: 'docx',
      rows: [],
      warnings: [],
      errors: [`DOCX parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}
