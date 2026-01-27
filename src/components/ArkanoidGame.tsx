import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArkanoidGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = GAME_WIDTH / BRICK_COLS - 4;
const BRICK_HEIGHT = 20;
const WIN_SCORE = 1000;

interface Brick {
  x: number;
  y: number;
  active: boolean;
}

const ArkanoidGame = ({ isOpen, onClose }: ArkanoidGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const gameStateRef = useRef({
    paddleX: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: GAME_WIDTH / 2,
    ballY: GAME_HEIGHT - 50,
    ballSpeedX: 4,
    ballSpeedY: -4,
    bricks: [] as Brick[],
    score: 0,
    gameRunning: true,
  });

  // Initialize bricks
  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + 4) + 2,
          y: row * (BRICK_HEIGHT + 4) + 40,
          active: true,
        });
      }
    }
    return bricks;
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    gameStateRef.current = {
      paddleX: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
      ballX: GAME_WIDTH / 2,
      ballY: GAME_HEIGHT - 50,
      ballSpeedX: 4 * (Math.random() > 0.5 ? 1 : -1),
      ballSpeedY: -4,
      bricks: initBricks(),
      score: 0,
      gameRunning: true,
    };
    setScore(0);
    setGameOver(false);
    setWon(false);
    setShowSecret(false);
  }, [initBricks]);

  // Handle mouse/touch movement
  const handleMove = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    gameStateRef.current.paddleX = Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    resetGame();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;
      if (!state.gameRunning) return;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Update ball position
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Ball collision with walls
      if (state.ballX <= 0 || state.ballX >= GAME_WIDTH - BALL_SIZE) {
        state.ballSpeedX = -state.ballSpeedX;
      }
      if (state.ballY <= 0) {
        state.ballSpeedY = -state.ballSpeedY;
      }

      // Ball collision with paddle
      if (
        state.ballY + BALL_SIZE >= GAME_HEIGHT - PADDLE_HEIGHT - 10 &&
        state.ballY + BALL_SIZE <= GAME_HEIGHT - 10 &&
        state.ballX + BALL_SIZE >= state.paddleX &&
        state.ballX <= state.paddleX + PADDLE_WIDTH
      ) {
        state.ballSpeedY = -Math.abs(state.ballSpeedY);
        // Add angle based on where ball hits paddle
        const hitPos = (state.ballX - state.paddleX) / PADDLE_WIDTH;
        state.ballSpeedX = (hitPos - 0.5) * 8;
      }

      // Ball out of bounds
      if (state.ballY > GAME_HEIGHT) {
        state.gameRunning = false;
        setGameOver(true);
        return;
      }

      // Ball collision with bricks
      state.bricks.forEach((brick) => {
        if (!brick.active) return;
        if (
          state.ballX + BALL_SIZE >= brick.x &&
          state.ballX <= brick.x + BRICK_WIDTH &&
          state.ballY + BALL_SIZE >= brick.y &&
          state.ballY <= brick.y + BRICK_HEIGHT
        ) {
          brick.active = false;
          state.ballSpeedY = -state.ballSpeedY;
          state.score += 25;
          setScore(state.score);

          // Check win condition
          if (state.score >= WIN_SCORE) {
            state.gameRunning = false;
            setWon(true);
            setTimeout(() => setShowSecret(true), 500);
          }
        }
      });

      // Draw bricks (pixel style)
      state.bricks.forEach((brick) => {
        if (!brick.active) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        // Inner shadow for pixel effect
        ctx.fillStyle = '#888888';
        ctx.fillRect(brick.x + 2, brick.y + 2, BRICK_WIDTH - 4, BRICK_HEIGHT - 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(brick.x + 4, brick.y + 4, BRICK_WIDTH - 8, BRICK_HEIGHT - 8);
      });

      // Draw paddle (pixel style)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(state.paddleX, GAME_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball (pixel style)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(state.ballX, state.ballY, BALL_SIZE, BALL_SIZE);

      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(`SCORE: ${state.score}`, 10, 25);
      ctx.fillText(`TARGET: ${WIN_SCORE}`, GAME_WIDTH - 120, 25);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, handleMove, resetGame]);

  // Handle secret display and close
  useEffect(() => {
    if (showSecret) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSecret, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
        >
          {!showSecret ? (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-white font-mono text-2xl mb-4">ARKANOID</h2>
              <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="border-2 border-white cursor-none"
                style={{ imageRendering: 'pixelated' }}
              />
              
              {gameOver && !won && (
                <div className="text-center mt-4">
                  <p className="text-white font-mono text-xl mb-4">GAME OVER</p>
                  <p className="text-white font-mono mb-4">Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-white text-black font-mono hover:bg-gray-200 transition-colors"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              <p className="text-white/50 font-mono text-sm mt-2">
                Move paddle with mouse or touch
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-center"
            >
              <h1 
                className="font-mono text-[12rem] text-white leading-none"
                style={{ textShadow: '0 0 50px white, 0 0 100px white' }}
              >
                667
              </h1>
              <p className="text-white/70 font-mono mt-4">Returning...</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArkanoidGame;
