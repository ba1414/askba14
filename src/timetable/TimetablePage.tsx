import React from 'react';
import './TimetableApp.css';

/**
 * Standalone page component for the Timetable Generator.
 */
const TimetablePage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#1d1d1f', marginBottom: '16px' }}>
          Timetable Generator
        </h1>
        <p style={{ fontSize: '21px', color: '#86868b', marginBottom: '48px' }}>
          Create perfect university schedules with AI-powered optimization
        </p>
        
        <div style={{ 
          background: '#f5f5f7', 
          borderRadius: '16px', 
          padding: '48px', 
          marginBottom: '32px',
          border: '2px dashed #d1d1d6'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1d1d1f', marginBottom: '12px' }}>
            Import Your Timetable
          </h2>
          <p style={{ fontSize: '17px', color: '#86868b', marginBottom: '24px' }}>
            Drag and drop your file here or click to browse
          </p>
          <button style={{
            background: '#007aff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '17px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Choose File
          </button>
        </div>

        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '21px', fontWeight: '600', color: '#1d1d1f', marginBottom: '16px' }}>
            Supported Formats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {['PDF', 'Excel', 'CSV', 'ICS', 'Images', 'HTML', 'JSON', 'Text'].map(format => (
              <div key={format} style={{
                padding: '12px',
                background: '#f5f5f7',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '15px',
                color: '#1d1d1f'
              }}>
                {format}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
