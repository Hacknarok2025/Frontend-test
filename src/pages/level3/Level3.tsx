import { useCallback, useRef, useState, useEffect } from 'react';
import type p5Types from 'p5';
import Sketch from 'react-p5';
import { useUser } from '@/context/useUser';

const CELL_SIZE = 50;
const COLS = 10;
const ROWS = 10;
const MOVE_SPEED = 8; // Zwiększona prędkość ruchu
// Adjusted collision padding for better detection
const COLLISION_PADDING = 3; // Increased to better detect obstacles
const POINTS_PER_HAMMER = 25; // Punkty za każdy młot
const MAX_POINTS = 100; // Maksymalna liczba punktów

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
  const { user, updateScore, updateLevel } = useUser();
  const [player, setPlayer] = useState<Player>({
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 1.5,
    isMoving: false,
    direction: { x: 0, y: 0 },
  });

  const [grid, setGrid] = useState<boolean[][]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [score, setScore] = useState(0);
  const playerImage = useRef<p5Types.Image | null>(null);
  const collectibleImage = useRef<p5Types.Image | null>(null);
  const p5Instance = useRef<p5Types | null>(null);

  // Setup grid with obstacles and collectibles
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5Instance.current = p5;
    p5.createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE).parent(canvasParentRef);

    // Load images
    playerImage.current = p5.loadImage('/imgs/viking-pixel.png');
    collectibleImage.current = p5.loadImage('/imgs/hammer.png');

    // Initialize grid with obstacles
    const newGrid: boolean[][] = Array(ROWS)
      .fill(false)
      .map(() => Array(COLS).fill(false));

    // Add some obstacles (true means there's an obstacle)
    const obstacles = [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 7, y: 5 },
      { x: 2, y: 7 },
      { x: 5, y: 4 },
      { x: 8, y: 8 },
      { x: 4, y: 6 },
      { x: 6, y: 1 },
      { x: 1, y: 8 },
    ];

    obstacles.forEach(({ x, y }) => {
      newGrid[y][x] = true;
    });

    setGrid(newGrid);

    // Add collectibles
    const newCollectibles: Collectible[] = [
      {
        x: 5 * CELL_SIZE + CELL_SIZE / 2,
        y: 2 * CELL_SIZE + CELL_SIZE / 2,
        collected: false,
      },
      {
        x: 8 * CELL_SIZE + CELL_SIZE / 2,
        y: 3 * CELL_SIZE + CELL_SIZE / 2,
        collected: false,
      },
      {
        x: 2 * CELL_SIZE + CELL_SIZE / 2,
        y: 5 * CELL_SIZE + CELL_SIZE / 2,
        collected: false,
      },
      {
        x: 7 * CELL_SIZE + CELL_SIZE / 2 - 5,
        y: 7 * CELL_SIZE + CELL_SIZE / 2 - 5,
        collected: false,
      }, // Adjusted position slightly
    ];

    setCollectibles(newCollectibles);
  };

  const draw = (p5: p5Types) => {
    p5.background(220, 240, 255); // Ice blue background

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
        player.x - CELL_SIZE / 2,
        player.y - CELL_SIZE / 2,
        CELL_SIZE,
        CELL_SIZE
      );
    } else {
      p5.fill(0, 100, 200);
      p5.circle(player.x, player.y, CELL_SIZE * 0.8);
    }

    // Handle movement logic
    if (player.isMoving) {
      // Calculate next position
      const nextX = player.x + player.direction.x * MOVE_SPEED;
      const nextY = player.y + player.direction.y * MOVE_SPEED;

      // Check if out of bounds
      const isOutOfBounds =
        nextX - CELL_SIZE / 2 < 0 ||
        nextX + CELL_SIZE / 2 > COLS * CELL_SIZE ||
        nextY - CELL_SIZE / 2 < 0 ||
        nextY + CELL_SIZE / 2 > ROWS * CELL_SIZE;

      // Check for collision with obstacles
      const playerSize = CELL_SIZE / COLLISION_PADDING;
      const checkPoints = [
        { x: nextX - playerSize / 2, y: nextY - playerSize / 2 }, // Top left
        { x: nextX + playerSize / 2, y: nextY - playerSize / 2 }, // Top right
        { x: nextX - playerSize / 2, y: nextY + playerSize / 2 }, // Bottom left
        { x: nextX + playerSize / 2, y: nextY + playerSize / 2 }, // Bottom right
      ];

      // Check if any corner of the player is inside an obstacle
      let collidesWithObstacle = isOutOfBounds;

      if (!isOutOfBounds) {
        collidesWithObstacle = checkPoints.some((point) => {
          const gridX = Math.floor(point.x / CELL_SIZE);
          const gridY = Math.floor(point.y / CELL_SIZE);
          return (
            gridX >= 0 &&
            gridX < COLS &&
            gridY >= 0 &&
            gridY < ROWS &&
            grid[gridY] &&
            grid[gridY][gridX]
          );
        });
      }

      if (collidesWithObstacle) {
        // Stop moving if hitting an obstacle
        setPlayer((prev) => ({
          ...prev,
          isMoving: false,
          direction: { x: 0, y: 0 },
        }));
      } else {
        // Continue sliding
        setPlayer((prev) => ({
          ...prev,
          x: nextX,
          y: nextY,
        }));

        // Check for collectible
        checkCollectibles(nextX, nextY);
      }
    }
  };

  const checkCollectibles = (x: number, y: number) => {
    setCollectibles((prevCollectibles) =>
      prevCollectibles.map((collectible) => {
        if (
          !collectible.collected &&
          Math.abs(collectible.x - x) < 35 && // Increased detection radius from 25 to 35
          Math.abs(collectible.y - y) < 35 // Increased detection radius from 25 to 35
        ) {
          setScore((prev) => prev + POINTS_PER_HAMMER);
          return { ...collectible, collected: true };
        }
        return collectible;
      })
    );
  };

  const checkWinCondition = () => {
    if (score >= MAX_POINTS) {
      // Update global score and move to next level
      updateScore(user?.score ? user.score + score : score);
      updateLevel(4);
    }
  };

  useEffect(() => {
    checkWinCondition();
  }, [score]);

  // Obsługa klawiszy strzałek i WASD z poprawną zależnością
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // Only accept input when player is not moving
      if (player.isMoving) return;

      let newDirection = { x: 0, y: 0 };

      // Handle arrow key or WASD inputs
      const key = e.key.toLowerCase();

      if (key === 'arrowup' || key === 'w') {
        newDirection = { x: 0, y: -1 };
      } else if (key === 'arrowdown' || key === 's') {
        newDirection = { x: 0, y: 1 };
      } else if (key === 'arrowleft' || key === 'a') {
        newDirection = { x: -1, y: 0 };
      } else if (key === 'arrowright' || key === 'd') {
        newDirection = { x: 1, y: 0 };
      }

      // Only start moving if a direction key was pressed
      if (newDirection.x !== 0 || newDirection.y !== 0) {
        setPlayer((prev) => ({
          ...prev,
          isMoving: true,
          direction: newDirection,
        }));
      }
    },
    [player.isMoving]
  );

  // Rejestrujemy obsługę klawiszy w window jako Event Listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Oryginalna funkcja keyPressed dla zgodności z p5
  const keyPressed = () => {
    // Ta funkcja będzie pusta, ponieważ obsługujemy klawisze przez event listener
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900">
      <h1 className="text-4xl font-bold text-white mb-4">
        Jotunheim - Ice Slide
      </h1>
      <div className="mb-4 text-white text-xl">
        Punkty: {score}/{MAX_POINTS}
      </div>
      <Sketch
        setup={setup as any}
        draw={draw as any}
        keyPressed={keyPressed as any}
      />
      <div className="mt-4 text-white text-lg">
        Use arrow keys or WASD to slide across the ice. Collect all the Mjolnir
        pieces!
      </div>
    </div>
  );
};

export default Level3;
