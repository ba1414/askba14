import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface BA14DB extends DBSchema {
  gpa: {
    key: string;
    value: any;
  };
  flashcards: {
    key: string;
    value: any;
  };
  projects: {
    key: string;
    value: any;
  };
}

let dbPromise: Promise<IDBPDatabase<BA14DB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<BA14DB>('BA14Database', 1, {
      upgrade(db) {
        // Create object stores for each feature
        if (!db.objectStoreNames.contains('gpa')) {
          db.createObjectStore('gpa');
        }
        if (!db.objectStoreNames.contains('flashcards')) {
          db.createObjectStore('flashcards');
        }
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveData(store: keyof BA14DB, key: string, value: any) {
  try {
    const db = await getDB();
    await db.put(store, value, key);
    console.log(`✅ Saved to IndexedDB [${store}/${key}]:`, value);
  } catch (error) {
    console.error(`❌ Failed to save to IndexedDB [${store}/${key}]:`, error);
  }
}

export async function loadData<T>(store: keyof BA14DB, key: string, defaultValue: T): Promise<T> {
  try {
    const db = await getDB();
    const value = await db.get(store, key);
    if (value !== undefined) {
      console.log(`✅ Loaded from IndexedDB [${store}/${key}]:`, value);
      return value as T;
    }
  } catch (error) {
    console.error(`❌ Failed to load from IndexedDB [${store}/${key}]:`, error);
  }
  return defaultValue;
}

export async function deleteData(store: keyof BA14DB, key: string) {
  try {
    const db = await getDB();
    await db.delete(store, key);
    console.log(`🗑️ Deleted from IndexedDB [${store}/${key}]`);
  } catch (error) {
    console.error(`❌ Failed to delete from IndexedDB [${store}/${key}]:`, error);
  }
}

export async function clearStore(store: keyof BA14DB) {
  try {
    const db = await getDB();
    await db.clear(store);
    console.log(`🗑️ Cleared IndexedDB store [${store}]`);
  } catch (error) {
    console.error(`❌ Failed to clear IndexedDB store [${store}]:`, error);
  }
}
