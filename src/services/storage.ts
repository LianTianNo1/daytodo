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

// Tauri 环境实现
class TauriStorage implements StorageService {
  private getFilePath(key: string) {
    return `data/${key}.json`;
  }

  async get(key: string) {
    if (window.__TAURI__) {
      try {
        const { invoke } = window.__TAURI__;
        const content = await invoke('plugin:fs:read_file', {
          path: this.getFilePath(key)
        });
        return content as string;
      } catch (error) {
        console.error('TauriStorage get error:', error);
        return null;
      }
    }
    return null;
  }

  async set(key: string, value: string) {
    if (window.__TAURI__) {
      try {
        const { invoke } = window.__TAURI__;
        // 确保目录存在
        await invoke('plugin:fs:create_dir', {
          path: 'data',
          recursive: true
        });
        await invoke('plugin:fs:write_file', {
          path: this.getFilePath(key),
          contents: value
        });
      } catch (error) {
        console.error('TauriStorage set error:', error);
      }
    }
  }

  async remove(key: string) {
    if (window.__TAURI__) {
      try {
        const { invoke } = window.__TAURI__;
        await invoke('plugin:fs:remove_file', {
          path: this.getFilePath(key)
        });
      } catch (error) {
        console.error('TauriStorage remove error:', error);
      }
    }
  }
}

// 根据环境选择存储实现
export const storage: StorageService =
  'window' in globalThis && window.__TAURI__
    ? new TauriStorage()
    : new WebStorage();
