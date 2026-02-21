import { useState, useCallback } from 'react';

interface LikesState {
  [trackId: string]: number;
}

export const useLikes = () => {
  const [likes, setLikes] = useState<LikesState>({});
  const [showArkanoid, setShowArkanoid] = useState(false);
  const [hasShownArkanoid, setHasShownArkanoid] = useState(false);

  // Notification states for GGPPGGPPGPGPGGG track (id: 2-1)
  const [showZachem, setShowZachem] = useState(false);
  const [hasShownZachem, setHasShownZachem] = useState(false);
  const [showPsix, setShowPsix] = useState(false);
  const [hasShownPsix, setHasShownPsix] = useState(false);

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

      if (allHaveSeven && !hasShownArkanoid) {
        setHasShownArkanoid(true);
        setTimeout(() => setShowArkanoid(true), 300);
      }

      // Check for 99 likes on GGPPGGPPGPGPGGG track (id: 2-1) → zachem.gif
      if (newLikes['2-1'] === 99 && !hasShownZachem) {
        setHasShownZachem(true);
        setTimeout(() => setShowZachem(true), 300);
      }

      // Check for 666 likes on GGPPGGPPGPGPGGG track (id: 2-1) → psix.gif
      if (newLikes['2-1'] === 666 && !hasShownPsix) {
        setHasShownPsix(true);
        setTimeout(() => setShowPsix(true), 300);
      }

      return newLikes;
    });
  }, [hasShownArkanoid, hasShownZachem, hasShownPsix]);

  const getLikes = useCallback((trackId: string) => {
    return likes[trackId] || 0;
  }, [likes]);

  const closeArkanoid = useCallback(() => {
    setShowArkanoid(false);
  }, []);

  const closeZachem = useCallback(() => {
    setShowZachem(false);
  }, []);

  const closePsix = useCallback(() => {
    setShowPsix(false);
  }, []);

  return {
    addLike,
    getLikes,
    showArkanoid,
    closeArkanoid,
    showZachem,
    closeZachem,
    showPsix,
    closePsix,
  };
};
