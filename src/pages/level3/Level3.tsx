import { useCallback, useRef, useState, useEffect } from 'react';
import type p5Types from 'p5';
import Sketch from 'react-p5';
import Modal3 from "@/commons/Modal3.tsx";
import { motion } from "framer-motion";
import Button from "@/components/own/button.tsx";

const CELL_SIZE = 50;
const COLS = 10;
const ROWS = 10;
const MOVE_SPEED = 8;
const COLLISION_PADDING = 3;
const POINTS_PER_HAMMER = 12.5;
const MAX_POINTS = 100;

interface Player {
  x: number;
  y: number;
  isMoving: boolean;
  direction: { x: number; y: number };
}

interface Collectible {
  x: number;
  y: number;
  collected: boolean;
}

const Level3 = () => {
  const [player, setPlayer] = useState<Player>({
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 1.5,
    isMoving: false,
    direction: { x: 0, y: 0 }
  });

  const [grid, setGrid] = useState<boolean[][]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const playerImage = useRef<p5Types.Image | null>(null);
  const collectibleImage = useRef<p5Types.Image | null>(null);
  const p5Instance = useRef<p5Types | null>(null);
  const gameStartTime = useRef<number>(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Setup grid with obstacles and collectibles
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5Instance.current = p5;
    p5.createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE).parent(canvasParentRef);

    // Load images
    playerImage.current = p5.loadImage('/imgs/viking-pixel.png');
    collectibleImage.current = p5.loadImage('/imgs/hammer.png');

    // Initialize grid with obstacles
    const newGrid: boolean[][] = Array(ROWS).fill(false).map(() => Array(COLS).fill(false));

    // Add some obstacles
    const obstacles = [
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 7, y: 5 }, {x: 9, y: 0},
      { x: 2, y: 7 }, { x: 5, y: 4 }, { x: 8, y: 8 },
      { x: 4, y: 6 }, { x: 6, y: 1 }, { x: 1, y: 8 }
    ];

    obstacles.forEach(({ x, y }) => {
      newGrid[y][x] = true;
    });

    setGrid(newGrid);

    // Add collectibles
    const newCollectibles: Collectible[] = [
      { x: 5 * CELL_SIZE + CELL_SIZE/2, y: 2 * CELL_SIZE + CELL_SIZE/2, collected: false },
      { x: 8 * CELL_SIZE + CELL_SIZE/2, y: 3 * CELL_SIZE + CELL_SIZE/2, collected: false },
      { x: 2 * CELL_SIZE + CELL_SIZE/2, y: 5 * CELL_SIZE + CELL_SIZE/2, collected: false },
      { x: 7 * CELL_SIZE + CELL_SIZE/2, y: 7 * CELL_SIZE + CELL_SIZE/2, collected: false }
    ];

    setCollectibles(newCollectibles);

    // Start timer
    gameStartTime.current = Date.now();
    timerInterval.current = setInterval(() => {
      setGameTime(Math.floor((Date.now() - gameStartTime.current) / 1000));
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const draw = (p5: p5Types) => {
    p5.background(220, 240, 255);

    // Draw ice floor
    p5.stroke(200, 220, 240);
    p5.strokeWeight(1);
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        p5.fill(240, 248, 255);
        p5.rect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Draw obstacles
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (grid[i] && grid[i][j]) {
          p5.fill(100, 110, 140);
          p5.rect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw collectibles
    collectibles.forEach((collectible) => {
      if (!collectible.collected) {
        if (collectibleImage.current) {
          p5.image(
              collectibleImage.current,
              collectible.x - 15,
              collectible.y - 15,
              30,
              30
          );
        } else {
          p5.fill(255, 215, 0);
          p5.circle(collectible.x, collectible.y, 15);
        }
      }
    });

    // Draw player
    if (playerImage.current) {
      p5.image(
          playerImage.current,
          player.x - CELL_SIZE/2,
          player.y - CELL_SIZE/2,
          CELL_SIZE,
          CELL_SIZE
      );
    } else {
      p5.fill(0, 100, 200);
      p5.circle(player.x, player.y, CELL_SIZE * 0.8);
    }

    // Handle movement logic
    if (player.isMoving) {
      const nextX = player.x + player.direction.x * MOVE_SPEED;
      const nextY = player.y + player.direction.y * MOVE_SPEED;

      const isOutOfBounds =
          nextX - CELL_SIZE/2 < 0 ||
          nextX + CELL_SIZE/2 > COLS * CELL_SIZE ||
          nextY - CELL_SIZE/2 < 0 ||
          nextY + CELL_SIZE/2 > ROWS * CELL_SIZE;

      const playerSize = CELL_SIZE / COLLISION_PADDING;
      const checkPoints = [
        { x: nextX - playerSize/2, y: nextY - playerSize/2 },
        { x: nextX + playerSize/2, y: nextY - playerSize/2 },
        { x: nextX - playerSize/2, y: nextY + playerSize/2 },
        { x: nextX + playerSize/2, y: nextY + playerSize/2 }
      ];

      let collidesWithObstacle = isOutOfBounds;

      if (!isOutOfBounds) {
        collidesWithObstacle = checkPoints.some(point => {
          const gridX = Math.floor(point.x / CELL_SIZE);
          const gridY = Math.floor(point.y / CELL_SIZE);
          return gridX >= 0 && gridX < COLS && gridY >= 0 && gridY < ROWS &&
              grid[gridY] && grid[gridY][gridX];
        });
      }

      if (collidesWithObstacle) {
        setPlayer(prev => ({
          ...prev,
          isMoving: false,
          direction: { x: 0, y: 0 }
        }));
      } else {
        setPlayer(prev => ({
          ...prev,
          x: nextX,
          y: nextY
        }));

        checkCollectibles(nextX, nextY);
      }
    }
  };

  const checkCollectibles = (x: number, y: number) => {
    setCollectibles(prevCollectibles => {
      let anyCollected = false;
      const updatedCollectibles = prevCollectibles.map(collectible => {
        if (
            !collectible.collected &&
            Math.abs(collectible.x - x) < 35 &&
            Math.abs(collectible.y - y) < 35
        ) {
          anyCollected = true;
          return { ...collectible, collected: true };
        }
        return collectible;
      });

      if (anyCollected) {
        setScore(prevScore => {
          const newScore = prevScore + POINTS_PER_HAMMER;
          if (newScore >= MAX_POINTS) {
            setIsGameComplete(true);
            setIsModalOpen(true);
            if (timerInterval.current) {
              clearInterval(timerInterval.current);
            }
          }
          return newScore;
        });
      }

      return updatedCollectibles;
    });
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (player.isMoving || isGameComplete) return;

    let newDirection = { x: 0, y: 0 };
    const key = e.key.toLowerCase();

    if (key === 'arrowup' || key === 'w') newDirection = { x: 0, y: -1 };
    else if (key === 'arrowdown' || key === 's') newDirection = { x: 0, y: 1 };
    else if (key === 'arrowleft' || key === 'a') newDirection = { x: -1, y: 0 };
    else if (key === 'arrowright' || key === 'd') newDirection = { x: 1, y: 0 };

    if (newDirection.x !== 0 || newDirection.y !== 0) {
      setPlayer(prev => ({
        ...prev,
        isMoving: true,
        direction: newDirection
      }));
    }
  }, [player.isMoving, isGameComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const keyPressed = () => {};

  const resetGame = () => {
    setPlayer({
      x: CELL_SIZE * 1.5,
      y: CELL_SIZE * 1.5,
      isMoving: false,
      direction: { x: 0, y: 0 }
    });
    setScore(0);
    setGameTime(0);
    setIsGameComplete(false);
    setIsModalOpen(false);

    // Reset collectibles
    setCollectibles([
      { x: 5 * CELL_SIZE + CELL_SIZE/2, y: 2 * CELL_SIZE + CELL_SIZE/2, collected: false },
      { x: 8 * CELL_SIZE + CELL_SIZE/2, y: 3 * CELL_SIZE + CELL_SIZE/2, collected: false },
      { x: 2 * CELL_SIZE + CELL_SIZE/2, y: 5 * CELL_SIZE + CELL_SIZE/2, collected: false },
      { x: 7 * CELL_SIZE + CELL_SIZE/2 - 5, y: 7 * CELL_SIZE + CELL_SIZE/2, collected: false }
    ]);

    // Restart timer
    gameStartTime.current = Date.now();
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setGameTime(Math.floor((Date.now() - gameStartTime.current) / 1000));
    }, 1000);
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{backgroundImage:"url(/imgs/level3.webp"}}>
        <motion.div
                       initial={{ y: 50, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ delay: 0.5, duration: 0.8 }} className="">
        <h1 className="text-4xl font-bold text-white mb-4">Jotunheim - Ice Slide</h1>
        <div className="mb-4 text-white text-xl">
          Punkty: {score}/{MAX_POINTS} | Czas: {gameTime}s
        </div>
        <Sketch setup={setup as any} draw={draw as any} keyPressed={keyPressed as any} />
        <div className="mt-4 text-white text-lg">
          Use arrow keys or WASD to slide across the ice. Collect all the Mjolnir pieces!
        </div>


        </motion.div>
        <Modal3 open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="flex flex-col items-center"
          >
            <h1 className="text-4xl font-bold mb-6 norse text-center">
              {gameTime <= 30
                  ? "Excellent! You're a true Viking!"
                  : gameTime <= 60
                      ? "Good job, warrior!"
                      : "You completed the challenge!"}
            </h1>
            <h2 className="text-3xl mb-3 font-bold norse">Time: {gameTime} seconds</h2>
            <h2 className="text-3xl mb-6 font-bold norse">Score: {score} points</h2>
            <Button
                onClick={resetGame}
                add="text-white text-3xl"
            >
              Play Again
            </Button>
          </motion.div>
        </Modal3>
      </div>
  );
};

export default Level3;