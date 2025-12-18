/**
 * PDF Parser for Timetable Data
 * Uses PDF.js for text extraction and Tesseract.js for OCR fallback
 */

import { ParseResult } from '../types';
import { parseText } from './text-parser';
import { parseImage } from './image-parser';

/**
 * Parse PDF file
 */
export async function parsePDF(
  buffer: ArrayBuffer,
  onProgress?: (progress: number, stage: string) => void
): Promise<ParseResult> {
  try {
    onProgress?.(10, 'Loading PDF...');
    
    // Dynamic import to avoid load-time issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source for PDF.js
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      // Use local bundled worker
      // Vite serves public files at the base URL root
      const baseUrl = (import.meta as any).env?.BASE_URL || '/';
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.min.js', window.location.origin + baseUrl).href;
    }
    
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const numPages = pdf.numPages;
    
    let allText = '';
    let totalItems = 0;
    
    // Extract text from all pages
    for (let i = 1; i <= numPages; i++) {
      onProgress?.(10 + (40 * i / numPages), `Extracting page ${i}/${numPages}...`);
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      totalItems += textContent.items.length;
      
      // Reconstruct lines by grouping text items by Y coordinate
      const pageText = reconstructLinesFromPDFItems(textContent.items);
      
      allText += pageText + '\n\n'; // Double newline between pages
    }
    
    console.log(`PDF.js extracted ${totalItems} text items from ${numPages} pages`);
    
    // Check if we got meaningful text
    const cleanText = allText.replace(/\s+/g, ' ').trim();
    const lines = allText.split('\n').filter(l => l.trim());
    
    console.log(`PDF Text Extraction:`);
    console.log(`  - ${totalItems} text items`);
    console.log(`  - ${cleanText.length} chars`);
    console.log(`  - ${lines.length} lines`);
    console.log(`  - First 5 lines:`, lines.slice(0, 5));
    
    if (cleanText.length > 200) {
      // Text extraction successful
      onProgress?.(60, 'Parsing extracted text...');
      
      const textResult = await parseText(allText);
      
      console.log(`Parsed ${textResult.rows.length} rows from text extraction`);
      
      if (textResult.rows.length > 0) {
        onProgress?.(100, 'Complete');
        return {
          ...textResult,
          fileType: 'pdf-text',
        };
      } else {
        console.warn('Text parsed but no valid rows found. Trying OCR...');
      }
    } else {
      console.warn('Insufficient text extracted. Trying OCR...');
    }
    
    // Text extraction failed or insufficient, try OCR
    onProgress?.(65, 'Text extraction limited, trying OCR...');
    
    // Render first page to image for OCR
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 3.0 }); // Higher scale for better OCR
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      return {
        success: false,
        fileType: 'pdf-ocr',
        rows: [],
        warnings: [],
        errors: ['Could not create canvas for OCR'],
      };
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    onProgress?.(70, 'Rendering PDF for OCR...');
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    onProgress?.(80, 'Running OCR...');
    
    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    if (!blob) {
      return {
        success: false,
        fileType: 'pdf-ocr',
        rows: [],
        warnings: [],
        errors: ['Could not convert PDF page to image'],
      };
    }
    
    const ocrResult = await parseImage(blob, (p) => {
      onProgress?.(80 + (p * 0.2), 'OCR processing...');
    });
    
    onProgress?.(100, 'Complete');
    
    return {
      ...ocrResult,
      fileType: 'pdf-ocr',
      warnings: [
        'PDF text extraction failed, used OCR instead',
        ...ocrResult.warnings,
      ],
    };
  } catch (error) {
    return {
      success: false,
      fileType: 'pdf-text',
      rows: [],
      warnings: [],
      errors: [`PDF parse error: ${error instanceof Error ? error.message : String(error)}`],
    };
  }
}

/**
 * Reconstruct lines from PDF.js text items by grouping by Y coordinate
 * This is critical - PDF.js returns many small positioned text items,
 * not pre-formatted lines.
 */
function reconstructLinesFromPDFItems(items: any[]): string {
  interface TextItem {
    str: string;
    transform: number[];
    width: number;
    height: number;
  }

  // Group items by Y coordinate (with tolerance for slight variations)
  const lineGroups = new Map<number, Array<{ x: number; str: string }>>();
  const Y_TOLERANCE = 2; // Pixels tolerance for same line
  
  for (const item of items) {
    if (!('str' in item) || !item.str.trim()) continue;
    
    const textItem = item as TextItem;
    const y = textItem.transform[5]; // Y coordinate
    const x = textItem.transform[4]; // X coordinate
    const str = textItem.str;
    
    // Find existing line within tolerance
    let lineY: number | null = null;
    for (const existingY of lineGroups.keys()) {
      if (Math.abs(existingY - y) <= Y_TOLERANCE) {
        lineY = existingY;
        break;
      }
    }
    
    if (lineY === null) {
      lineY = y;
      lineGroups.set(lineY, []);
    }
    
    lineGroups.get(lineY)!.push({ x, str });
  }
  
  // Sort lines by Y (top to bottom), then sort items within line by X (left to right)
  const sortedLines = Array.from(lineGroups.entries())
    .sort((a, b) => b[0] - a[0]); // Descending Y (top to bottom)
  
  const reconstructedLines: string[] = [];
  
  for (const [y, textItems] of sortedLines) {
    // Sort items in line by X coordinate
    const sortedItems = textItems.sort((a, b) => a.x - b.x);
    
    // Join with space, handling gaps
    let lineText = '';
    let lastX = -1;
    
    for (const item of sortedItems) {
      if (lastX >= 0 && item.x - lastX > 20) {
        // Large gap - add extra space
        lineText += ' ';
      } else if (lineText && !lineText.endsWith(' ') && !item.str.startsWith(' ')) {
        // Add space between items if needed
        lineText += ' ';
      }
      lineText += item.str;
      lastX = item.x + (item.str.length * 5); // Approximate end X
    }
    
    if (lineText.trim()) {
      reconstructedLines.push(lineText.trim());
    }
  }
  
  return reconstructedLines.join('\n');
}
