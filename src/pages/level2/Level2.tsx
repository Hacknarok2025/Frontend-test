import { useCallback, useRef, useEffect, useState } from 'react';
import type p5Types from 'p5';
import Sketch from 'react-p5';
import { motion, AnimatePresence } from 'framer-motion';
import Modal3 from '@/commons/Modal3.tsx';

const CELL_SIZE = 40;
const COLS = 20;
const ROWS = 20;
const LIGHT_RADIUS = 150;
const SCORE_MULTIPLIER = 1.5;
const INITIAL_SCORE = 100;
const GRACE_PERIOD = 10; // 10 sekund łaski

interface Player {
  x: number;
  y: number;
}

const Level2 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const playerImage = useRef<p5Types.Image | null>(null);
  const hammerImage = useRef<p5Types.Image | null>(null);
  const p5Instance = useRef<p5Types | null>(null);
  const canvasParentRef = useRef<Element | null>(null);
  const lastMoveTime = useRef(0);
  const MOVE_COOLDOWN = 3;
  const [isModalOpen3, setModalOpen3] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [showScore, setShowScore] = useState(false);
  const [keys, setKeys] = useState({
    w: false,
    s: false,
    a: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVisible && startTime && !endTime) {
      interval = setInterval(() => {
        const time = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime(time);

        // Po 10 sekundach zaczynamy pokazywać i odejmować punkty
        if (time >= GRACE_PERIOD) {
          setShowScore(true);
          const timeAfterGrace = time - GRACE_PERIOD;
          const newScore = Math.max(
            0,
            INITIAL_SCORE - Math.floor(timeAfterGrace * SCORE_MULTIPLIER)
          );
          setScore(newScore);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, startTime, endTime]);

  useEffect(() => {
    setIsVisible(true);
    setStartTime(Date.now());
    setScore(INITIAL_SCORE);
    setShowScore(false);
    return () => {
      setIsVisible(false);
      setStartTime(null);
      setEndTime(null);
    };
  }, []);

  const generateMaze = () => {
    const maze = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(true));

    const inBounds = (x, y) => x > 0 && y > 0 && x < COLS - 1 && y < ROWS - 1;

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const carve = (x, y) => {
      maze[y][x] = false;

      const dirs = shuffle([
        [0, -2], // up
        [0, 2], // down
        [-2, 0], // left
        [2, 0], // right
      ]);

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (inBounds(nx, ny) && maze[ny][nx]) {
          maze[ny - dy / 2][nx - dx / 2] = false;
          carve(nx, ny);
        }
      }
    };

    carve(1, 1);
    maze[1][1] = false;
    maze[ROWS - 3][COLS - 3] = false;

    return maze;
  };

  const resetGame = useCallback(() => {
    const maze = generateMaze();
    return {
      maze,
      player: {
        x: CELL_SIZE + CELL_SIZE / 2,
        y: CELL_SIZE + CELL_SIZE / 2,
      },
    };
  }, []);

  const gameState = useRef(resetGame());

  useEffect(() => {
    return () => {
      if (p5Instance.current) {
        if (canvasParentRef.current) {
          const existingCanvases =
            canvasParentRef.current.getElementsByTagName('canvas');
          for (let i = existingCanvases.length - 1; i >= 0; i--) {
            existingCanvases[i].remove();
          }
        }
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  const setup = (p5: p5Types, parentRef: Element) => {
    canvasParentRef.current = parentRef;
    const existingCanvases = parentRef.getElementsByTagName('canvas');
    for (let i = existingCanvases.length - 1; i >= 0; i--) {
      existingCanvases[i].remove();
    }

    p5Instance.current = p5;
    p5.createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE).parent(parentRef);
    playerImage.current = p5.loadImage('/imgs/viking-pixel.png');
    hammerImage.current = p5.loadImage('/imgs/hammer.png');
  };

  const draw = (p5: p5Types) => {
    p5.background(0);

    // Draw border
    p5.push();
    p5.stroke(100, 100, 100);
    p5.strokeWeight(4);
    p5.noFill();
    p5.rect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);
    p5.pop();

    // Draw maze
    p5.push();
    p5.noStroke();

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;

        const d = p5.dist(
          gameState.current.player.x,
          gameState.current.player.y,
          cellX + CELL_SIZE / 2,
          cellY + CELL_SIZE / 2
        );

        const brightness = p5.map(d, 0, 255, 255, 0);

        if (d < LIGHT_RADIUS) {
          if (x === COLS - 3 && y === ROWS - 3) {
            p5.fill(p5.color(200, 200, 200, brightness));
            p5.rect(cellX, cellY, CELL_SIZE, CELL_SIZE);
            if (hammerImage.current) {
              const imageSize = CELL_SIZE * 0.8;
              p5.image(
                hammerImage.current,
                cellX + CELL_SIZE / 2 - imageSize / 2,
                cellY + CELL_SIZE / 2 - imageSize / 2,
                imageSize,
                imageSize
              );
            }
            continue;
          } else {
            p5.fill(
              gameState.current.maze[y][x]
                ? p5.color(0, 0, 200, brightness)
                : p5.color(200, 200, 200, brightness)
            );
          }
        } else {
          p5.fill('#050505');
        }

        p5.rect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      }
    }
    p5.pop();

    // Draw player
    if (playerImage.current) {
      const imageSize = CELL_SIZE * 0.8;
      p5.image(
        playerImage.current,
        gameState.current.player.x - imageSize / 2,
        gameState.current.player.y - imageSize / 2,
        imageSize,
        imageSize
      );
    }
  };

  const checkWinCondition = () => {
    const playerGridX = Math.floor(gameState.current.player.x / CELL_SIZE);
    const playerGridY = Math.floor(gameState.current.player.y / CELL_SIZE);

    if (playerGridX === COLS - 3 && playerGridY === ROWS - 3) {
      const finalTime = Math.floor(
        (Date.now() - (startTime || Date.now())) / 1000
      );
      setEndTime(Date.now());
      setCurrentTime(finalTime);

      // Calculate final score
      if (finalTime > GRACE_PERIOD) {
        const timeAfterGrace = finalTime - GRACE_PERIOD;
        const finalScore = Math.max(
          0,
          INITIAL_SCORE - Math.floor(timeAfterGrace * SCORE_MULTIPLIER)
        );
        setScore(finalScore);
      } else {
        setScore(INITIAL_SCORE);
      }

      setModalOpen3(true);
    }
  };

  const movePlayer = useCallback(
    (p5: p5Types) => {
      const currentTime = Date.now();
      if (currentTime - lastMoveTime.current < MOVE_COOLDOWN) {
        return;
      }

      const speed = CELL_SIZE / 8;
      let newX = gameState.current.player.x;
      let newY = gameState.current.player.y;

      if (keys.w || keys.arrowup) newY -= speed;
      if (keys.s || keys.arrowdown) newY += speed;
      if (keys.a || keys.arrowleft) newX -= speed;
      if (keys.d || keys.arrowright) newX += speed;

      const checkCollision = (x: number, y: number) => {
        const cellX = Math.floor(x / CELL_SIZE);
        const cellY = Math.floor(y / CELL_SIZE);
        return (
          cellX >= 0 &&
          cellX < COLS &&
          cellY >= 0 &&
          cellY < ROWS &&
          !gameState.current.maze[cellY][cellX]
        );
      };

      const radius = CELL_SIZE / 4;
      const canMove =
        checkCollision(newX - radius, newY - radius) &&
        checkCollision(newX + radius, newY - radius) &&
        checkCollision(newX - radius, newY + radius) &&
        checkCollision(newX + radius, newY + radius);

      if (canMove) {
        gameState.current.player.x = newX;
        gameState.current.player.y = newY;
        lastMoveTime.current = currentTime;
        checkWinCondition();
      }
    },
    [keys]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          'w',
          's',
          'a',
          'd',
          'arrowup',
          'arrowdown',
          'arrowleft',
          'arrowright',
        ].includes(key)
      ) {
        setKeys((prev) => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        [
          'w',
          's',
          'a',
          'd',
          'arrowup',
          'arrowdown',
          'arrowleft',
          'arrowright',
        ].includes(key)
      ) {
        setKeys((prev) => ({ ...prev, [key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (
        p5Instance.current &&
        (keys.w ||
          keys.s ||
          keys.a ||
          keys.d ||
          keys.arrowup ||
          keys.arrowdown ||
          keys.arrowleft ||
          keys.arrowright)
      ) {
        movePlayer(p5Instance.current);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [keys, movePlayer]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="level2-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 overflow-hidden bg-black"
        >
          <div className="absolute inset-0">
            <img
              src="/imgs/level2.webp"
              className="object-cover w-full h-full"
            />
          </div>
          <motion.div
            key="level2-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center flex-col"
          >
            <div className="text-4xl m-5 bg-[#ffffff] px-6 py-3 transition-all duration-500 transform hover:scale-110 skew-x-12">
              Time: {currentTime}s Score: {score}
            </div>

            {currentTime < GRACE_PERIOD && (
              <div className="text-2xl text-white mt-2">
                Grace period: {GRACE_PERIOD - currentTime}s remaining
              </div>
            )}

            <Sketch setup={setup as any} draw={draw as any} />
          </motion.div>
        </motion.div>
      )}

      <Modal3 open={isModalOpen3} onClose={() => setModalOpen3(false)}>
        <motion.div
          key="level2-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl mb-6 font-bold">
            Good Job Warrior You Win!!!!
          </h1>
          <h2 className="text-3xl mb-3 font-bold">
            Time: {currentTime} seconds
          </h2>
          <h2 className="text-3xl mb-6 font-bold">Your Score: {score}</h2>

          {currentTime <= GRACE_PERIOD ? (
            <p className="text-xl text-green-500">Perfect time! Full points!</p>
          ) : (
            <p className="text-xl">
              (Score calculation: {INITIAL_SCORE} - (
              {currentTime - GRACE_PERIOD}s × {SCORE_MULTIPLIER}))
            </p>
          )}
        </motion.div>
      </Modal3>
    </AnimatePresence>
  );
};

export default Level2;
