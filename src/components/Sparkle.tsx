import { motion } from 'framer-motion';

interface SparkleProps {
  className?: string;
  size?: number;
  delay?: number;
}

const Sparkle = ({ className = '', size = 24, delay = 0 }: SparkleProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`sparkle ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <motion.path
        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
        fill="currentColor"
        animate={{ 
          scale: [1, 0.8, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: delay 
        }}
      />
    </motion.svg>
  );
};

export default Sparkle;
