import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const REQUIRED_CLICKS = 13;
const RESET_TIMEOUT = 3000; // Reset after 3 seconds of inactivity

export const useSecretClick = () => {
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretClick = useCallback(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= REQUIRED_CLICKS) {
      // Navigate to secret page
      navigate('/secret');
      setClickCount(0);
    } else {
      // Reset counter after timeout
      timeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, RESET_TIMEOUT);
    }
  }, [clickCount, navigate]);

  return { handleSecretClick, clickCount };
};

export default useSecretClick;
