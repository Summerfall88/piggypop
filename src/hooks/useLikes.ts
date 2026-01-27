import { useState, useCallback } from 'react';

interface LikesState {
  [trackId: string]: number;
}

export const useLikes = () => {
  const [likes, setLikes] = useState<LikesState>({});
  const [showArkanoid, setShowArkanoid] = useState(false);

  const addLike = useCallback((trackId: string) => {
    setLikes(prev => {
      const newLikes = {
        ...prev,
        [trackId]: (prev[trackId] || 0) + 1,
      };

      // Check if first 3 tracks each have 7 likes
      // Track IDs are like "1-1", "1-2", "1-3" for first album
      const firstThreeTrackIds = ['1-1', '1-2', '1-3'];
      const allHaveSeven = firstThreeTrackIds.every(id => newLikes[id] === 7);
      
      if (allHaveSeven) {
        setTimeout(() => setShowArkanoid(true), 300);
      }

      return newLikes;
    });
  }, []);

  const getLikes = useCallback((trackId: string) => {
    return likes[trackId] || 0;
  }, [likes]);

  const closeArkanoid = useCallback(() => {
    setShowArkanoid(false);
  }, []);

  return {
    addLike,
    getLikes,
    showArkanoid,
    closeArkanoid,
  };
};
