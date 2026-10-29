// Modul pembungkus localStorage terpusat agar mudah diganti dengan penyimpanan backend nantinya

const STORAGE_PREFIX = 'teman_kasih_v1_';

export const STORAGE_KEYS = {
  SESSION: `${STORAGE_PREFIX}session`,
  ANXIETY_BY_USER: `${STORAGE_PREFIX}anxiety_by_user`,
  PROGRESS_BY_USER: `${STORAGE_PREFIX}progress_by_user`,
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const storage = {
  getItem<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Abaikan jika penyimpanan penuh atau mode privat membatasi
    }
  },

  removeItem(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Abaikan galat penghapusan
    }
  },
};
