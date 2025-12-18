/**
 * IndexedDB Storage for Timetable Data
 * Keeps large datasets out of React state
 */

interface CourseCatalogEntry {
  courseCode: string;
  courseName: string;
  optionCount: number;
  meetingCount: number;
  source: string;
}

interface MeetingEntry {
  courseCode: string;
  classNo: string;
  day: string;
  startMin: number;
  endMin: number;
  room: string;
  courseName?: string;
  rawLine?: string;
}

const DB_NAME = 'TimetableDB';
const DB_VERSION = 1;
const CATALOG_STORE = 'course_catalog';
const MEETINGS_STORE = 'meetings';

let db: IDBDatabase | null = null;

/**
 * Initialize database
 */
export async function initDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Course catalog store
      if (!db.objectStoreNames.contains(CATALOG_STORE)) {
        const catalogStore = db.createObjectStore(CATALOG_STORE, { keyPath: 'courseCode' });
        catalogStore.createIndex('courseName', 'courseName', { unique: false });
      }

      // Meetings store
      if (!db.objectStoreNames.contains(MEETINGS_STORE)) {
        const meetingsStore = db.createObjectStore(MEETINGS_STORE, { autoIncrement: true });
        meetingsStore.createIndex('courseCode', 'courseCode', { unique: false });
        meetingsStore.createIndex('courseClass', ['courseCode', 'classNo'], { unique: false });
      }
    };
  });
}

/**
 * Save course catalog entries
 */
export async function saveCatalog(entries: CourseCatalogEntry[]): Promise<void> {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([CATALOG_STORE], 'readwrite');
    const store = transaction.objectStore(CATALOG_STORE);

    // Clear existing
    store.clear();

    // Add all entries
    for (const entry of entries) {
      store.put(entry);
    }

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get all catalog entries (for search/display)
 */
export async function getCatalog(): Promise<CourseCatalogEntry[]> {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([CATALOG_STORE], 'readonly');
    const store = transaction.objectStore(CATALOG_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Search catalog by course code or name
 */
export async function searchCatalog(query: string, limit = 20): Promise<CourseCatalogEntry[]> {
  const catalog = await getCatalog();
  const lowerQuery = query.toLowerCase();

  return catalog
    .filter(entry => 
      entry.courseCode.toLowerCase().includes(lowerQuery) ||
      entry.courseName?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

/**
 * Save meetings for a course
 */
export async function saveMeetings(meetings: MeetingEntry[]): Promise<void> {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([MEETINGS_STORE], 'readwrite');
    const store = transaction.objectStore(MEETINGS_STORE);

    for (const meeting of meetings) {
      store.put(meeting);
    }

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Get all meetings for a course
 */
export async function getMeetingsForCourse(courseCode: string): Promise<MeetingEntry[]> {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([MEETINGS_STORE], 'readonly');
    const store = transaction.objectStore(MEETINGS_STORE);
    const index = store.index('courseCode');
    const request = index.getAll(courseCode);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get meetings for specific class/section
 */
export async function getMeetingsForClass(courseCode: string, classNo: string): Promise<MeetingEntry[]> {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([MEETINGS_STORE], 'readonly');
    const store = transaction.objectStore(MEETINGS_STORE);
    const index = store.index('courseClass');
    const request = index.getAll([courseCode, classNo]);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all data
 */
export async function clearAllData(): Promise<void> {
  if (!db) await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([CATALOG_STORE, MEETINGS_STORE], 'readwrite');
    
    transaction.objectStore(CATALOG_STORE).clear();
    transaction.objectStore(MEETINGS_STORE).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Build catalog from raw rows (Phase 1 parsing)
 */
export function buildCatalogFromRows(rows: any[]): CourseCatalogEntry[] {
  const catalogMap = new Map<string, CourseCatalogEntry>();

  for (const row of rows) {
    if (!row.isValid || !row.courseCode) continue;

    const code = row.courseCode;
    
    if (!catalogMap.has(code)) {
      catalogMap.set(code, {
        courseCode: code,
        courseName: row.courseName || '',
        optionCount: 0,
        meetingCount: 0,
        source: 'import'
      });
    }

    const entry = catalogMap.get(code)!;
    entry.meetingCount++;
    
    // Count unique sections
    const sections = new Set<string>();
    for (const r of rows) {
      if (r.courseCode === code && r.section) {
        sections.add(r.section);
      }
    }
    entry.optionCount = sections.size;
  }

  return Array.from(catalogMap.values());
}

/**
 * Convert raw rows to meeting entries
 */
export function rowsToMeetings(rows: any[]): MeetingEntry[] {
  return rows
    .filter(r => r.isValid && r.courseCode)
    .map(row => ({
      courseCode: row.courseCode,
      classNo: row.section || '',
      day: row.day || '',
      startMin: timeToMinutes(row.startTime),
      endMin: timeToMinutes(row.endTime),
      room: row.location || '',
      courseName: row.courseName,
      rawLine: row.raw
    }));
}

function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [hours, mins] = time.split(':').map(Number);
  return (hours || 0) * 60 + (mins || 0);
}
