/**
 * Debug Panel Component
 * Shows detailed parsing diagnostics
 */

import React from 'react';
import './DebugPanel.css';

export interface DebugInfo {
  extractedChars: number;
  totalLines: number;
  candidateLines: number;
  parsedRows: number;
  needsFixingRows: number;
  filteredLines: number;
  rejectedLines: Array<{ line: string; reason: string }>;
  firstLines: string[];
  parseMethod?: 'row-list' | 'table' | 'line-by-line';
}

interface DebugPanelProps {
  debugInfo: DebugInfo | null;
  validCount: number;
  uniqueCourses: number;
  uniqueOptions: number;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  debugInfo,
  validCount,
  uniqueCourses,
  uniqueOptions
}) => {
  if (!debugInfo) return null;

  return (
    <details className="debug-panel">
      <summary>🔍 Debug Info (Parsing Diagnostics)</summary>
      <div className="debug-content">
        <section className="debug-section">
          <h4>📄 Extraction Summary</h4>
          <div className="debug-grid">
            <div className="debug-item">
              <span className="debug-label">Characters extracted:</span>
              <span className="debug-value">{debugInfo.extractedChars.toLocaleString()}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Total lines:</span>
              <span className="debug-value">{debugInfo.totalLines.toLocaleString()}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Parse method:</span>
              <span className="debug-value">{debugInfo.parseMethod || 'auto'}</span>
            </div>
          </div>
        </section>

        <section className="debug-section">
          <h4>🔍 Filtering Results</h4>
          <div className="debug-grid">
            <div className="debug-item">
              <span className="debug-label">Candidate lines (has time + code):</span>
              <span className="debug-value success">{debugInfo.candidateLines}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Filtered lines (headers/footers):</span>
              <span className="debug-value muted">{debugInfo.filteredLines}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Skipped (no time/code):</span>
              <span className="debug-value muted">
                {debugInfo.totalLines - debugInfo.candidateLines - debugInfo.filteredLines}
              </span>
            </div>
          </div>
        </section>

        <section className="debug-section">
          <h4>✅ Parsing Results</h4>
          <div className="debug-grid">
            <div className="debug-item">
              <span className="debug-label">Valid rows:</span>
              <span className="debug-value success">{validCount}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Needs fixing:</span>
              <span className="debug-value warning">{debugInfo.needsFixingRows}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Total parsed:</span>
              <span className="debug-value">{debugInfo.parsedRows + debugInfo.needsFixingRows}</span>
            </div>
          </div>
        </section>

        <section className="debug-section">
          <h4>📊 Course Statistics</h4>
          <div className="debug-grid">
            <div className="debug-item">
              <span className="debug-label">Unique courses:</span>
              <span className="debug-value accent">{uniqueCourses}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Class options:</span>
              <span className="debug-value accent">{uniqueOptions}</span>
            </div>
            <div className="debug-item">
              <span className="debug-label">Success rate:</span>
              <span className="debug-value">
                {debugInfo.candidateLines > 0 
                  ? `${Math.round((validCount / debugInfo.candidateLines) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {debugInfo.firstLines && debugInfo.firstLines.length > 0 && (
          <section className="debug-section">
            <h4>📝 First Lines Extracted</h4>
            <div className="debug-code">
              {debugInfo.firstLines.slice(0, 10).map((line, i) => (
                <div key={i} className="debug-line">
                  <span className="line-number">{i + 1}</span>
                  <span className="line-content">{line || '(empty)'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {debugInfo.rejectedLines && debugInfo.rejectedLines.length > 0 && (
          <section className="debug-section">
            <h4>❌ Rejected Lines (First 20)</h4>
            <div className="debug-rejections">
              {debugInfo.rejectedLines.map((reject, i) => (
                <div key={i} className="rejection-item">
                  <div className="rejection-reason">{reject.reason}</div>
                  <div className="rejection-line">{reject.line}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="debug-section">
          <h4>💡 Troubleshooting</h4>
          <div className="debug-tips">
            {debugInfo.candidateLines === 0 && (
              <div className="tip error">
                <strong>⚠️ No candidates found!</strong>
                <p>Lines need both a time range (e.g., "08:30 - 09:50") and a course code (e.g., "COMP1010").</p>
                <p>Check the "First Lines Extracted" to verify PDF extraction worked.</p>
              </div>
            )}
            {debugInfo.candidateLines > 0 && validCount === 0 && (
              <div className="tip warning">
                <strong>⚠️ Candidates found but none parsed!</strong>
                <p>Lines matched the pattern but parsing failed. Check "Rejected Lines" for details.</p>
              </div>
            )}
            {validCount > 0 && uniqueCourses < 2 && (
              <div className="tip info">
                <strong>ℹ️ Few courses detected</strong>
                <p>Only {uniqueCourses} unique course(s) found. Verify this is correct for your timetable.</p>
              </div>
            )}
            {validCount > 0 && (
              <div className="tip success">
                <strong>✅ Parsing successful!</strong>
                <p>Found {uniqueCourses} courses with {uniqueOptions} class options.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </details>
  );
};
