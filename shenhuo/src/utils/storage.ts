const STORAGE_KEYS = {
  favorites: "myth-favorites",
  readProgress: "myth-read-progress",
  settings: "myth-settings",
} as const;

interface ReadProgress {
  [storyId: string]: number;
}

interface AppSettings {
  fontSize: number;
  eyeCare: boolean;
  speechRate: number;
  voiceName: string;
}

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFavorites(): Record<string, boolean> {
  return getItem<Record<string, boolean>>(STORAGE_KEYS.favorites) || {};
}

export function toggleFavorite(storyId: string): boolean {
  const favs = getFavorites();
  favs[storyId] = !favs[storyId];
  setItem(STORAGE_KEYS.favorites, favs);
  return favs[storyId];
}

export function getReadProgress(): ReadProgress {
  return getItem<ReadProgress>(STORAGE_KEYS.readProgress) || {};
}

export function setReadProgress(storyId: string, percent: number): void {
  const progress = getReadProgress();
  progress[storyId] = percent;
  setItem(STORAGE_KEYS.readProgress, progress);
}

export function getReadPercent(storyId: string): number {
  return getReadProgress()[storyId] || 0;
}

export function getSettings(): AppSettings {
  return (
    getItem<AppSettings>(STORAGE_KEYS.settings) || {
      fontSize: 17,
      eyeCare: false,
      speechRate: 1,
      voiceName: "",
    }
  );
}

export function setSettings(settings: AppSettings): void {
  setItem(STORAGE_KEYS.settings, settings);
}
