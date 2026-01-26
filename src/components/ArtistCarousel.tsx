import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Individual photo cell with random timing
const PhotoCell = ({ initialIndex }: { initialIndex: number }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const changePhoto = () => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * artistPhotos.length);
          } while (newIndex === prev);
          return newIndex;
        });
        setIsAnimating(false);
      }, 500);
    };

    // Initial random delay (3-8 seconds) + random interval
    const initialDelay = Math.random() * 5000 + 3000;
    let intervalId: ReturnType<typeof setInterval>;
    
    const timeoutId = setTimeout(() => {
      changePhoto();
      intervalId = setInterval(changePhoto, getRandomDuration());
    }, initialDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex-shrink-0 h-full" style={{ width: 'auto' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={artistPhotos[currentIndex]}
          alt="Piggy Pop"
          initial={{ opacity: 0 }}
          animate={{ opacity: isAnimating ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-auto object-cover"
          style={{ display: 'block', maxWidth: 'none' }}
        />
      </AnimatePresence>
    </div>
  );
};

const ArtistCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Create cells with different initial photos, doubled for seamless loop
  const cells = Array.from({ length: 10 }, (_, i) => i % artistPhotos.length);
  const doubledCells = [...cells, ...cells];

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
          <PhotoCell key={i} initialIndex={initialIndex} />
        ))}
      </div>
    </section>
  );
};

export default ArtistCarousel;
