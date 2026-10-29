/**
 * Client-Side JavaScript Database Engine (IndexedDB with LocalStorage fallback).
 * Provides persistence for credit evaluations, risk scores, and audit records.
 */

export interface SavedEvaluation {
  id: string;
  applicantName: string;
  creditScore: number;
  income: number;
  loanAmount: number;
  dtiRatio: number;
  pdPercent: number;
  ratingGrade: string;
  expectedLoss: number;
  decision: string;
  recommendedApr: number;
  timestamp: string;
  state: any;
}

const DB_NAME = 'FinRiskAIDB';
const STORE_NAME = 'evaluations';
const DB_VERSION = 1;

class JSDatabase {
  private db: IDBDatabase | null = null;
  private isAvailable: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  constructor() {
    this.init();
  }

  private async init(): Promise<IDBDatabase | null> {
    if (!this.isAvailable) return null;
    if (this.db) return this.db;

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('decision', 'decision', { unique: false });
          }
        };

        request.onsuccess = (event: any) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = () => {
          console.warn('[JSDatabase] IndexedDB failed to open, falling back to LocalStorage.');
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  }

  async saveEvaluation(record: SavedEvaluation): Promise<void> {
    const db = await this.init();
    if (db) {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } else {
      // LocalStorage fallback
      const existing = this.getFromLocalStorage();
      const filtered = existing.filter(r => r.id !== record.id);
      filtered.unshift(record);
      localStorage.setItem(DB_NAME, JSON.stringify(filtered.slice(0, 50)));
    }
  }

  async getAllEvaluations(): Promise<SavedEvaluation[]> {
    const db = await this.init();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const res = (req.result || []) as SavedEvaluation[];
          res.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          resolve(res);
        };
        req.onerror = () => resolve(this.getFromLocalStorage());
      });
    } else {
      return this.getFromLocalStorage();
    }
  }

  async deleteEvaluation(id: string): Promise<void> {
    const db = await this.init();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve();
      });
    } else {
      const existing = this.getFromLocalStorage().filter(r => r.id !== id);
      localStorage.setItem(DB_NAME, JSON.stringify(existing));
    }
  }

  private getFromLocalStorage(): SavedEvaluation[] {
    try {
      const data = localStorage.getItem(DB_NAME);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

export const jsDatabase = new JSDatabase();
