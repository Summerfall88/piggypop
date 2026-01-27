import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

import photo1 from '@/assets/artist/photo-1.jpg';
import photo2 from '@/assets/artist/photo-2.jpg';
import photo3 from '@/assets/artist/photo-3.jpg';
import photo4 from '@/assets/artist/photo-4.jpg';
import photo5 from '@/assets/artist/photo-5.jpg';
import photo6 from '@/assets/artist/photo-6.jpg';
import photo7 from '@/assets/artist/photo-7.jpg';
import photo8 from '@/assets/artist/photo-8.jpg';
import photo9 from '@/assets/artist/photo-9.jpg';
import photo10 from '@/assets/artist/photo-10.jpg';

const artistPhotos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10];

// Get random duration between 8-15 seconds (much slower)
const getRandomDuration = () => Math.floor(Math.random() * 7000) + 8000;

// Individual photo cell with random timing - avoids adjacent duplicates
const PhotoCell = ({ 
  initialIndex, 
  getAdjacentIndices 
}: { 
  initialIndex: number;
  getAdjacentIndices: () => number[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getValidNewIndex = useCallback(() => {
    const adjacentIndices = getAdjacentIndices();
    const forbidden = new Set([currentIndex, ...adjacentIndices]);
    
    // Get available indices
    const available = artistPhotos
      .map((_, i) => i)
      .filter(i => !forbidden.has(i));
    
    if (available.length === 0) {
      // Fallback: just avoid current
      const fallback = artistPhotos
        .map((_, i) => i)
        .filter(i => i !== currentIndex);
      return fallback[Math.floor(Math.random() * fallback.length)];
    }
    
    return available[Math.floor(Math.random() * available.length)];
  }, [currentIndex, getAdjacentIndices]);

  useEffect(() => {
    const changePhoto = () => {
      const newIndex = getValidNewIndex();
      setNextIndex(newIndex);
      setIsTransitioning(true);
      
      // After fade out, swap the image
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setNextIndex(null);
        // After swap, fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 400);
    };

    // Initial random delay (5-10 seconds) + random interval
    const initialDelay = Math.random() * 5000 + 5000;
    let intervalId: ReturnType<typeof setInterval>;
    
    const timeoutId = setTimeout(() => {
      changePhoto();
      intervalId = setInterval(changePhoto, getRandomDuration());
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [getValidNewIndex]);

  return (
    <div className="flex-shrink-0 h-full" style={{ width: 'auto' }}>
      <motion.img
        src={artistPhotos[currentIndex]}
        alt="Piggy Pop"
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="h-full w-auto object-cover"
        style={{ display: 'block', maxWidth: 'none' }}
      />
    </div>
  );
};

const ArtistCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cellIndicesRef = useRef<number[]>([]);
  
  // Create cells with different initial photos, doubled for seamless loop
  const cells = Array.from({ length: 10 }, (_, i) => i % artistPhotos.length);
  const doubledCells = [...cells, ...cells];
  
  // Initialize cell indices
  if (cellIndicesRef.current.length === 0) {
    cellIndicesRef.current = doubledCells.slice();
  }

  // Update cell index when it changes
  const updateCellIndex = useCallback((cellIndex: number, newPhotoIndex: number) => {
    cellIndicesRef.current[cellIndex] = newPhotoIndex;
  }, []);

  // Get adjacent cell indices for a given cell
  const getAdjacentIndices = useCallback((cellIndex: number) => {
    const indices: number[] = [];
    const totalCells = cellIndicesRef.current.length;
    
    // Previous cell (wrap around)
    const prevIndex = (cellIndex - 1 + totalCells) % totalCells;
    indices.push(cellIndicesRef.current[prevIndex]);
    
    // Next cell (wrap around)
    const nextIndex = (cellIndex + 1) % totalCells;
    indices.push(cellIndicesRef.current[nextIndex]);
    
    return indices;
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      // Use delta time for smooth scrolling regardless of frame rate
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      scrollPosition += scrollSpeed * (deltaTime / 16.67); // Normalize to 60fps
      
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = scrollPosition - halfWidth;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <div 
        ref={scrollRef}
        className="flex h-full overflow-hidden"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {doubledCells.map((initialIndex, i) => (
          <PhotoCell 
            key={i} 
            initialIndex={initialIndex}
            getAdjacentIndices={() => getAdjacentIndices(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default ArtistCarousel;
