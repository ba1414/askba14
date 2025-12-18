/**
 * Course Search Picker
 * Search-first UI - no mass list rendering
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { searchCatalog } from '../storage/indexeddb';
import './CourseSearchPicker.css';

export interface SelectedCourse {
  courseCode: string;
  courseName: string;
  optionCount: number;
}

interface CourseSearchPickerProps {
  selectedCourses: SelectedCourse[];
  onCoursesChange: (courses: SelectedCourse[]) => void;
  maxCourses?: number;
}

export const CourseSearchPicker: React.FC<CourseSearchPickerProps> = ({
  selectedCourses,
  onCoursesChange,
  maxCourses = 10
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const matches = await searchCatalog(query, 15);
        // Filter out already selected
        const filtered = matches.filter(
          m => !selectedCourses.some(s => s.courseCode === m.courseCode)
        );
        setResults(filtered);
        setShowDropdown(filtered.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, selectedCourses]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCourse = useCallback((course: any) => {
    if (selectedCourses.length >= maxCourses) {
      alert(`Maximum ${maxCourses} courses allowed`);
      return;
    }

    onCoursesChange([
      ...selectedCourses,
      {
        courseCode: course.courseCode,
        courseName: course.courseName,
        optionCount: course.optionCount
      }
    ]);

    setQuery('');
    setResults([]);
    setShowDropdown(false);
  }, [selectedCourses, onCoursesChange, maxCourses]);

  const handleRemoveCourse = useCallback((courseCode: string) => {
    onCoursesChange(selectedCourses.filter(c => c.courseCode !== courseCode));
  }, [selectedCourses, onCoursesChange]);

  return (
    <div className="course-search-picker">
      <div className="search-header">
        <div className="search-input-container" ref={dropdownRef}>
          <input
            type="text"
            className="search-input"
            placeholder="Search courses... (e.g., COMP1010 or Programming)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowDropdown(true);
            }}
          />
          {isSearching && (
            <span className="search-spinner">⏳</span>
          )}

          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map(course => (
                <div
                  key={course.courseCode}
                  className="search-result-item"
                  onClick={() => handleSelectCourse(course)}
                >
                  <div className="result-code">{course.courseCode}</div>
                  <div className="result-name">{course.courseName}</div>
                  <div className="result-options">{course.optionCount} options</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="selection-count">
          Selected: <strong>{selectedCourses.length}/{maxCourses}</strong> courses
        </div>
      </div>

      {selectedCourses.length > 0 && (
        <div className="selected-courses-chips">
          {selectedCourses.map(course => (
            <div key={course.courseCode} className="course-chip">
              <span className="chip-code">{course.courseCode}</span>
              <span className="chip-name">{course.courseName}</span>
              <span className="chip-options">({course.optionCount})</span>
              <button
                className="chip-remove"
                onClick={() => handleRemoveCourse(course.courseCode)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCourses.length === 0 && (
        <div className="empty-state">
          <p>🔍 Search and select courses to generate schedules</p>
          <p className="empty-hint">Start typing a course code or name above</p>
        </div>
      )}

      {selectedCourses.length >= maxCourses && (
        <div className="max-warning">
          ⚠️ Maximum {maxCourses} courses selected. Remove some to add more.
        </div>
      )}
    </div>
  );
};
