/**
 * Image/OCR Parser for Timetable Data
 * Uses Tesseract.js for optical character recognition
 */

import Tesseract from 'tesseract.js';
import { ParseResult } from '../types';
import { parseText } from './text-parser';

/**
 * Parse image file using OCR
 */
export async function parseImage(
  imageData: Blob | string,
  onProgress?: (progress: number) => void
): Promise<ParseResult> {
  try {
    // Perform OCR
    // Note: Tesseract will auto-download worker and lang data from CDN
    // If this fails, we might need to bundle them
    const result = await Tesseract.recognize(
      imageData as Tesseract.ImageLike,
      'eng', // Start with English only for speed/reliability
      {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(m.progress * 100);
          }
        },
        errorHandler: (err) => {
          console.error('Tesseract Error:', err);
        }
      }
    );
    
    const text = result.data.text;
    
    if (!text || text.trim().length < 10) {
      return {
        success: false,
        fileType: 'image',
        rows: [],
        warnings: [],
        errors: ['Could not extract readable text from image'],
      };
    }
    
    // Use text parser on OCR result
    const textResult = await parseText(text);
    
    return {
      ...textResult,
      fileType: 'image',
      warnings: [
        'Text extracted via OCR - please verify accuracy',
        ...textResult.warnings,
      ],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'image',
      rows: [],
      warnings: [],
      errors: [`OCR error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Check if Tesseract is available
 */
export async function checkOCRAvailability(): Promise<boolean> {
  try {
    // Just check if Tesseract module is loaded
    return typeof Tesseract !== 'undefined';
  } catch {
    return false;
  }
}
