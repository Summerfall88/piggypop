import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import photo1 from '@/assets/artist/photo-1.jpg';
import photo2 from '@/assets/artist/photo-2.jpg';
import photo3 from '@/assets/artist/photo-3.jpg';
import photo4 from '@/assets/artist/photo-4.jpg';
import photo5 from '@/assets/artist/photo-5.jpg';

const artistPhotos = [photo1, photo2, photo3, photo4, photo5];

const ArtistCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled past the first set of images
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

  // Double the photos for seamless loop
  const doubledPhotos = [...artistPhotos, ...artistPhotos];

  return (
    <section className="py-16 bg-secondary/30 overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-4xl md:text-5xl text-center mb-10 px-6"
      >
        PIGGY <span className="text-primary">В ДЕЙСТВИИ</span>
      </motion.h2>
      
      {/* Full-width seamless carousel - no gaps, no rounded corners */}
      <div 
        ref={scrollRef}
        className="flex overflow-hidden"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {doubledPhotos.map((photo, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-[300px] md:h-[400px] lg:h-[500px]"
            style={{ width: 'auto' }}
          >
            <img
              src={photo}
              alt={`Piggy Pop photo ${(index % artistPhotos.length) + 1}`}
              className="h-full w-auto object-cover"
              style={{ 
                display: 'block',
                maxWidth: 'none',
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistCarousel;
