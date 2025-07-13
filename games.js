const STORAGE_KEY = 'faGeGames';

export function getGames() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function saveGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}
