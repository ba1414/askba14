/**
 * IndexedDB Persistence Layer for Timetable Generator
 * Stores courses, blackout blocks, and pinned schedules locally
 */

import { Course, BlackoutBlock, PinnedSchedule, RawMeetingRow } from './types';

const DB_NAME = 'timetable-generator';
const DB_VERSION = 1;

const STORES = {
  courses: 'courses',
  rawRows: 'rawRows',
  blackouts: 'blackouts',
  pinned: 'pinned',
  settings: 'settings',
} as const;

/**
 * Open database connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(STORES.courses)) {
        db.createObjectStore(STORES.courses, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.rawRows)) {
        db.createObjectStore(STORES.rawRows, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.blackouts)) {
        db.createObjectStore(STORES.blackouts, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.pinned)) {
        const pinnedStore = db.createObjectStore(STORES.pinned, { keyPath: 'id' });
        pinnedStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Generic get all from store
 */
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Generic save all to store (replaces existing)
 */
async function saveAllToStore<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Clear existing
    store.clear();
    
    // Add new items
    for (const item of items) {
      store.put(item);
    }
    
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

/**
 * Generic add/update single item
 */
async function saveItem<T extends { id: string }>(storeName: string, item: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

/**
 * Generic delete item
 */
async function deleteItem(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

// ============================================
// COURSES
// ============================================

export async function loadCourses(): Promise<Course[]> {
  return getAllFromStore<Course>(STORES.courses);
}

export async function saveCourses(courses: Course[]): Promise<void> {
  return saveAllToStore(STORES.courses, courses);
}

// ============================================
// RAW ROWS (for editing)
// ============================================

export async function loadRawRows(): Promise<RawMeetingRow[]> {
  return getAllFromStore<RawMeetingRow>(STORES.rawRows);
}

export async function saveRawRows(rows: RawMeetingRow[]): Promise<void> {
  return saveAllToStore(STORES.rawRows, rows);
}

// ============================================
// BLACKOUT BLOCKS
// ============================================

export async function loadBlackouts(): Promise<BlackoutBlock[]> {
  return getAllFromStore<BlackoutBlock>(STORES.blackouts);
}

export async function saveBlackouts(blackouts: BlackoutBlock[]): Promise<void> {
  return saveAllToStore(STORES.blackouts, blackouts);
}

export async function saveBlackout(blackout: BlackoutBlock): Promise<void> {
  return saveItem(STORES.blackouts, blackout);
}

export async function deleteBlackout(id: string): Promise<void> {
  return deleteItem(STORES.blackouts, id);
}

// ============================================
// PINNED SCHEDULES
// ============================================

export async function loadPinnedSchedules(): Promise<PinnedSchedule[]> {
  const pinned = await getAllFromStore<PinnedSchedule>(STORES.pinned);
  return pinned.sort((a, b) => b.createdAt - a.createdAt);
}

export async function savePinnedSchedule(pinned: PinnedSchedule): Promise<void> {
  return saveItem(STORES.pinned, pinned);
}

export async function deletePinnedSchedule(id: string): Promise<void> {
  return deleteItem(STORES.pinned, id);
}

export async function updatePinnedScheduleName(id: string, name: string): Promise<void> {
  const all = await loadPinnedSchedules();
  const item = all.find(p => p.id === id);
  if (item) {
    item.name = name;
    await savePinnedSchedule(item);
  }
}

// ============================================
// SETTINGS
// ============================================

interface SettingItem {
  key: string;
  value: unknown;
}

export async function loadSetting<T>(key: string, defaultValue: T): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.settings, 'readonly');
    const store = transaction.objectStore(STORES.settings);
    const request = store.get(key);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result as SettingItem | undefined;
      resolve(result?.value as T ?? defaultValue);
    };
    
    transaction.oncomplete = () => db.close();
  });
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  return saveItem(STORES.settings, { key, value } as SettingItem & { id: string });
}

// ============================================
// CLEAR ALL DATA
// ============================================

export async function clearAllData(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const storeNames = [STORES.courses, STORES.rawRows, STORES.blackouts, STORES.pinned];
    const transaction = db.transaction(storeNames, 'readwrite');
    
    for (const storeName of storeNames) {
      transaction.objectStore(storeName).clear();
    }
    
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

// ============================================
// EXPORT/IMPORT ALL DATA
// ============================================

export interface TimetableExportData {
  version: number;
  exportedAt: number;
  courses: Course[];
  rawRows: RawMeetingRow[];
  blackouts: BlackoutBlock[];
  pinned: PinnedSchedule[];
}

export async function exportAllData(): Promise<TimetableExportData> {
  const [courses, rawRows, blackouts, pinned] = await Promise.all([
    loadCourses(),
    loadRawRows(),
    loadBlackouts(),
    loadPinnedSchedules(),
  ]);
  
  return {
    version: DB_VERSION,
    exportedAt: Date.now(),
    courses,
    rawRows,
    blackouts,
    pinned,
  };
}

export async function importAllData(data: TimetableExportData): Promise<void> {
  await Promise.all([
    saveCourses(data.courses || []),
    saveRawRows(data.rawRows || []),
    saveBlackouts(data.blackouts || []),
    saveAllToStore(STORES.pinned, data.pinned || []),
  ]);
}
