import Database from '@tauri-apps/plugin-sql';
import { appDataDir } from '@tauri-apps/api/path';
import { join } from '@tauri-apps/api/path';

export interface StorageService {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

// Web 环境实现
class WebStorage implements StorageService {
  async get(key: string) {
    try {
      const value = localStorage.getItem(key);
      let jsonValue = null;
      try {
        jsonValue = JSON.parse(value);
      } catch (error) {
        localStorage.setItem(key, '{}');
        console.error('WebStorage get error:', error);
      }
      console.log('看看-WebStorage get jsonValue:', jsonValue);
      return jsonValue;
    } catch (error) {
      console.error('WebStorage get error:', error);
      return null;
    }
  }

  async set(key: string, value: string) {
    console.log('WebStorage set', key, value);
    const jsonValue = JSON.stringify(value);
    try {
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('WebStorage set error:', error);
    }
  }

  async remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('WebStorage remove error:', error);
    }
  }
}

// Tauri SQLite 实现
class TauriSQLiteStorage implements StorageService {
  private db: Database | null = null;

  private async initDB() {
    if (!this.db) {
      // const appDataDirPath = await appDataDir();
      // const dbPath = await join(appDataDirPath, 'daytodo.db');
      // console.log('看看-TauriSQLiteStorage dbPath:', dbPath);
      // this.db = await Database.load(`sqlite:${dbPath}`);
      this.db = await Database.load('sqlite:storage.db');
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS storage (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);
    }
    return this.db;
  }

  async get(key: string) {
    try {
      const db = await this.initDB();
      const result = await db.select('SELECT value FROM storage WHERE key = ?', [key]);
      const strValue = result?.length > 0 ? result?.[0]?.value : "{}";
      let jsonValue = null;
      try {
        jsonValue = JSON.parse(strValue);
      } catch (error) {
        console.error('TauriSQLiteStorage get error:', error);
      }
      console.log('看看-TauriSQLiteStorage get result:', result);
      console.log('看看-TauriSQLiteStorage get jsonValue:', jsonValue);
      return jsonValue;
    } catch (error) {
      console.error('TauriSQLiteStorage get error:', error);
      return null;
    }
  }

  async set(key: string, value: string) {
    try {
      const db = await this.initDB();
      console.log('看看-TauriSQLiteStorage set value:', value);
      await db.execute(
        'INSERT OR REPLACE INTO storage (key, value) VALUES (?, ?)',
        [key, value]
      );
    } catch (error) {
      console.error('TauriSQLiteStorage set error:', error);
    }
  }

  async remove(key: string) {
    try {
      const db = await this.initDB();
      await db.execute('DELETE FROM storage WHERE key = ?', [key]);
    } catch (error) {
      console.error('TauriSQLiteStorage remove error:', error);
    }
  }
}

// 根据环境选择存储实现
export const storage: StorageService =
  'window' in globalThis && window.__TAURI_INTERNALS__
    ? new TauriSQLiteStorage()
    : new WebStorage();
