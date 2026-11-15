/**
 * ============================================================================
 * GRAMMAR QUEST — INDEXEDDB STORAGE WRAPPER
 * ============================================================================
 * Browser-only persistence layer using IndexedDB. Never transmits student
 * preferences or progress to any external server.
 *
 * Gracefully degrades when IndexedDB is unavailable (e.g. restricted browser
 * modes or SSR environments) and reports availability cleanly to callers.
 * ============================================================================
 */

const DB_NAME = 'grammar-quest-db';
const DB_VERSION = 2;
export const PROGRESS_STORE = 'studentProgress';
export const ASSESSMENT_STORE = 'assessmentAttempts';

export function isIndexedDbSupported(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined' && window.indexedDB !== null;
  } catch {
    return false;
  }
}

export function openGrammarQuestDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDbSupported()) {
      reject(new Error('IndexedDB is unavailable in this browser environment.'));
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
          db.createObjectStore(PROGRESS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(ASSESSMENT_STORE)) {
          const assessmentStore = db.createObjectStore(ASSESSMENT_STORE, { keyPath: 'id' });
          assessmentStore.createIndex('missionId', 'missionId', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error ?? new Error('Unable to open local IndexedDB storage.'));
      };

      request.onblocked = () => {
        reject(new Error('Local storage upgrade was blocked by another open tab.'));
      };
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Unexpected IndexedDB error.'));
    }
  });
}

export async function idbGet<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
  const db = await openGrammarQuestDb();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);

      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error ?? new Error('Failed to read from local storage.'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    } catch (error) {
      db.close();
      reject(error);
    }
  });
}

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  const db = await openGrammarQuestDb();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve((req.result as T[]) ?? []);
      req.onerror = () => reject(req.error ?? new Error('Failed to read collection from local storage.'));
      tx.oncomplete = () => db.close();
      tx.onerror = () => db.close();
    } catch (error) {
      db.close();
      reject(error);
    }
  });
}

export async function idbPut<T>(storeName: string, value: T): Promise<void> {
  const db = await openGrammarQuestDb();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);

      req.onerror = () => reject(req.error ?? new Error('Failed to save to local storage.'));
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error('Transaction failed while saving progress.'));
      };
    } catch (error) {
      db.close();
      reject(error);
    }
  });
}
