const STORAGE_KEY = 'pkmp_favorites';
const CHANGE_EVENT = 'pkmp-favorites-changed';

export function getFavorites(): number[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}

export function toggleFavorite(dexNumber: number): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(dexNumber);
  if (idx === -1) favs.push(dexNumber); else favs.splice(idx, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return idx === -1; // true = now favorited
}

export function isFavorited(dexNumber: number): boolean {
  return getFavorites().includes(dexNumber);
}

export { CHANGE_EVENT };
