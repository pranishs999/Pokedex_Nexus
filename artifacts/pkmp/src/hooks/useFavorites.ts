import { useState, useEffect } from 'react';
import { getFavorites, toggleFavorite, CHANGE_EVENT } from '@/lib/favorites-store';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(getFavorites());

  useEffect(() => {
    const handler = () => setFavorites(getFavorites());
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  }, []);

  return {
    favorites,
    toggle: toggleFavorite,
    isLiked: (dex: number) => favorites.includes(dex),
  };
}
