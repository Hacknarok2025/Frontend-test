import { useCallback, useRef, useEffect } from 'react';
import type p5Types from 'p5';
import Sketch from 'react-p5';

const CELL_SIZE = 40;
const COLS = 20;
const ROWS = 20;
const LIGHT_RADIUS = 150;

interface Player {
  x: number;
  y: number;
}

const Level2 = () => {
  const playerImage = useRef<p5Types.Image | null>(null);
  const hammerImage = useRef<p5Types.Image | null>(null);
  const p5Instance = useRef<p5Types | null>(null);
  const canvasParentRef = useRef<Element | null>(null);

  const generateMaze = () => {
    const maze = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(true)); // Start as all walls

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
          // Carve passage between
          maze[ny - dy / 2][nx - dx / 2] = false;
          carve(nx, ny);
        }
      }
    };

    // Start carving from (1, 1)
    carve(1, 1);

    // Ensure start and end points are open
    maze[1][1] = false;
    maze[ROWS - 3][COLS - 3] = false;

    return maze;
  };

  // Reset function to reinitialize the game state
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

  // Clean up function
  useEffect(() => {
    return () => {
      if (p5Instance.current) {
        // Remove any existing canvases from the parent
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
    // Store the parent ref for cleanup
    canvasParentRef.current = parentRef;

    // Remove any existing canvases before creating a new one
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

    // Draw the border around the game board
    p5.push();
    p5.stroke(100, 100, 100); // Gray color for the border
    p5.strokeWeight(4); // Border thickness
    p5.noFill();
    p5.rect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);
    p5.pop();

    p5.push();
    p5.noStroke();

    // Draw the light around player
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;

        // Calculate distance from player to cell center
        const d = p5.dist(
          gameState.current.player.x,
          gameState.current.player.y,
          cellX + CELL_SIZE / 2,
          cellY + CELL_SIZE / 2
        );

        // Set color based on distance (creating light effect)
        // const brightness = p5.map(d, 0, LIGHT_RADIUS, 255, 0);
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

        // Draw cell
        p5.rect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      }
    }
    p5.pop();

    // Draw player
    if (playerImage.current) {
      const imageSize = CELL_SIZE * 0.8; // Nieco mniejszy niż komórka
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
      console.log('Congratulations! You reached the goal!');
    }
  };

  const keyPressed = useCallback((p5: p5Types) => {
    const speed = CELL_SIZE / 2;
    let newX = gameState.current.player.x;
    let newY = gameState.current.player.y;

    switch (p5.key.toLowerCase()) {
      case 'w':
        newY -= speed;
        break;
      case 's':
        newY += speed;
        break;
      case 'a':
        newX -= speed;
        break;
      case 'd':
        newX += speed;
        break;
    }

    // Check collision with walls and boundaries
    const gridX = Math.floor(newX / CELL_SIZE);
    const gridY = Math.floor(newY / CELL_SIZE);

    // Additional collision checks for the corners of the player
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

    // Check player's corners (using a smaller hitbox)
    const radius = CELL_SIZE / 4;
    const canMove =
      checkCollision(newX - radius, newY - radius) && // Top-left
      checkCollision(newX + radius, newY - radius) && // Top-right
      checkCollision(newX - radius, newY + radius) && // Bottom-left
      checkCollision(newX + radius, newY + radius); // Bottom-right

    if (canMove) {
      gameState.current.player.x = newX;
      gameState.current.player.y = newY;
      checkWinCondition();
    }
  }, []); // No dependencies needed as we're using refs

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img src="/imgs/level2.webp" className="object-cover w-full h-full" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center ">
        <Sketch
          setup={setup as any}
          draw={draw as any}
          keyPressed={keyPressed as any}
        />
      </div>
    </div>
  );
};

export default Level2;
