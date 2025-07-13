const STORAGE_KEY = 'games';

export function getGames() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveGames(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export const games = getGames();
