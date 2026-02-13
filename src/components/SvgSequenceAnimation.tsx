import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import all 12 SVG frames
const frames = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    return new URL(`../assets/warning-animation/${num}.svg`, import.meta.url).href;
});

interface SvgSequenceAnimationProps {
    interval?: number;
}

const SvgSequenceAnimation = ({ interval = 70 }: SvgSequenceAnimationProps) => {
    const [currentFrame, setCurrentFrame] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentFrame((prev) => (prev + 1) % frames.length);
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {frames.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    alt={`Frame ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-0 ${index === currentFrame ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            ))}
        </div>
    );
};

export default SvgSequenceAnimation;
