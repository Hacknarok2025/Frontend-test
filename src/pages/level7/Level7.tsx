import { useEffect, useState, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import './Level7.css';
import { motion } from "framer-motion";
import Modal3 from "@/commons/Modal3.tsx";
import Button from "@/components/own/button.tsx";

interface Fireball {
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
}

const Level7 = () => {
  // Game state
  const [lives, setLives] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Game constants
  const VIKING_WIDTH = 50;
  const VIKING_HEIGHT = 49;
  const FIREBALL_WIDTH = 30;
  const FIREBALL_HEIGHT = 50;

  // Refs
  const canvasSizeRef = useRef({ width: 1600, height: 1200 });
  const vikingImgRef = useRef<p5Types.Image | null>(null);
  const fireballImgRef = useRef<p5Types.Image | null>(null);
  const backgroundImgRef = useRef<p5Types.Image | null>(null);
  const heartImgRef = useRef<p5Types.Image | null>(null);
  const vikingXRef = useRef(0);
  const vikingYRef = useRef(0);
  const fireballsRef = useRef<Fireball[]>([]);
  const lastFireballTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const difficultyRef = useRef(1);
  const p5InstanceRef = useRef<p5Types | null>(null);
  const canvasReadyRef = useRef(false);

  // Reset game
  const resetGame = () => {
    if (canvasSizeRef.current.width > 0) {
      vikingXRef.current = canvasSizeRef.current.width / 2;
      vikingYRef.current = canvasSizeRef.current.height - 80;
      fireballsRef.current = [];
      setLives(10);
      setGameOver(false);
      setTimeLeft(30);
      setFinalScore(0);
      frameCountRef.current = 0;
      difficultyRef.current = 1;
      setGameStarted(true);
    }
  };

  // Calculate final score
  const calculateFinalScore = () => {
    const timeBonus = 100;
    const livesPenalty = (10 - lives) * 10;
    return Math.max(0, timeBonus - livesPenalty);
  };

  // p5.js preload function
  const preload = (p5: p5Types) => {
    p5.loadImage(
        '/imgs/level_7_game_background.png',
        (img) => {
          backgroundImgRef.current = img;
          canvasSizeRef.current = { width: img.width, height: img.height };
          vikingXRef.current = img.width / 2;
          vikingYRef.current = img.height - 80;
        },
        () => console.error("Failed to load background image")
    );

    p5.loadImage(
        '/imgs/viking-pixel.png',
        (img) => { vikingImgRef.current = img; },
        () => console.error("Failed to load Viking image")
    );

    p5.loadImage(
        '/imgs/fireball.png',
        (img) => { fireballImgRef.current = img; },
        () => console.error("Failed to load Fireball image")
    );

    p5.loadImage(
        '/imgs/serceve.png',
        (img) => {
          // Resize heart image if too large
          if (img.width > 64) {
            const resizedImg = p5.createImage(32, 32);
            resizedImg.copy(img, 0, 0, img.width, img.height, 0, 0, 32, 32);
            heartImgRef.current = resizedImg;
          } else {
            heartImgRef.current = img;
          }
        },
        () => console.error("Failed to load Heart image")
    );
  };

  // p5.js setup function
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5InstanceRef.current = p5;

    if (backgroundImgRef.current && canvasSizeRef.current.width > 0) {
      p5.createCanvas(
          canvasSizeRef.current.width,
          canvasSizeRef.current.height
      ).parent(canvasParentRef);

      canvasReadyRef.current = true;
      setCanvasReady(true);
    } else {
      p5.createCanvas(800, 360).parent(canvasParentRef);

      const checkInterval = setInterval(() => {
        if (backgroundImgRef.current && !canvasReadyRef.current) {
          clearInterval(checkInterval);
          canvasSizeRef.current = { width: 1600, height: 1200 };
          p5.resizeCanvas(canvasSizeRef.current.width, canvasSizeRef.current.height);
          vikingXRef.current = canvasSizeRef.current.width / 2;
          vikingYRef.current = canvasSizeRef.current.height - 80;
          canvasReadyRef.current = true;
          setCanvasReady(true);
        }
      }, 100);
    }
  };

  // Draw hearts function
  const drawHearts = (p5: p5Types) => {
    const heartSize = p5.min(28, p5.width / 28);
    const spacing = heartSize * 0.7;
    const startX = 20;
    const startY = 20;

    // Background
    p5.fill(0, 0, 0, 180);
    p5.rect(startX - 5, startY - 5, 10 * spacing + 10, heartSize + 10, 8);

    // Border
    p5.noFill();
    p5.stroke(255, 255, 255, 80);
    p5.strokeWeight(1);
    p5.rect(startX - 5, startY - 5, 10 * spacing + 10, heartSize + 10, 8);

    // Hearts
    for (let i = 0; i < 10; i++) {
      const x = startX + i * spacing;
      const y = startY;

      if (heartImgRef.current) {
        if (i < lives) {
          // Pulsing effect for active hearts
          const pulse = p5.sin(frameCountRef.current * 0.1) * 0.1 + 1;
          p5.push();
          p5.translate(x + heartSize/2, y + heartSize/2);
          p5.scale(pulse, pulse);
          p5.tint(255, 255, 255, 255);
          p5.image(heartImgRef.current, -heartSize/2, -heartSize/2, heartSize, heartSize);
          p5.pop();
        } else {
          // Grayed out for lost hearts
          p5.tint(100, 100, 100, 150);
          p5.image(heartImgRef.current, x, y, heartSize, heartSize);
          p5.noTint();
        }
      } else {
        // Fallback rectangles
        if (i < lives) {
          p5.fill(255, 0, 0);
          p5.rect(x, y, heartSize, heartSize, 3);
        } else {
          p5.fill(80, 80, 80, 180);
          p5.rect(x, y, heartSize, heartSize, 3);
        }
      }
    }
  };

  // p5.js draw function
  const draw = (p5: p5Types) => {
    if (!canvasReadyRef.current || !backgroundImgRef.current) {
      p5.background(0);
      p5.fill(255);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Loading...', p5.width/2, p5.height/2);
      return;
    }

    // Start Screen
    if (!gameStarted && !gameOver) {
      p5.image(backgroundImgRef.current, 0, 0);
      p5.fill(0, 0, 0, 200);
      p5.rect(0, 0, p5.width, p5.height);
      p5.fill(255);
      p5.textSize(p5.min(40, p5.width/16));
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Viking Runner', p5.width/2, p5.height/2 - p5.height/7);
      p5.textSize(p5.min(20, p5.width/32));
      return;
    }

    // Game Over Screen
    if (gameOver) {
      p5.image(backgroundImgRef.current, 0, 0);
      setIsModalOpen(true);
      setFinalScore(calculateFinalScore());
      p5.fill(0, 0, 0, 180);
      p5.rect(0, 0, p5.width, p5.height);
      p5.fill(255, 0, 0);
      p5.textSize(p5.min(40, p5.width/16));
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('GAME OVER!', p5.width/2, p5.height/2 - p5.height/10);
      return;
    }

    // Gameplay
    p5.image(backgroundImgRef.current, 0, 0);

    // Draw Viking
    if (vikingImgRef.current) {
      p5.image(
          vikingImgRef.current,
          vikingXRef.current - VIKING_WIDTH/2,
          vikingYRef.current - VIKING_HEIGHT/2,
          VIKING_WIDTH,
          VIKING_HEIGHT
      );
    } else {
      p5.fill(0, 255, 0);
      p5.rect(
          vikingXRef.current - VIKING_WIDTH/2,
          vikingYRef.current - VIKING_HEIGHT/2,
          VIKING_WIDTH,
          VIKING_HEIGHT
      );
    }

    // Viking movement
    const vikingSpeed = p5.width / 64;
    if ((p5.keyIsDown(p5.LEFT_ARROW) || p5.keyIsDown(65)) && vikingXRef.current > VIKING_WIDTH/2) {
      vikingXRef.current -= vikingSpeed;
    }
    if ((p5.keyIsDown(p5.RIGHT_ARROW) || p5.keyIsDown(68)) && vikingXRef.current < p5.width - VIKING_WIDTH/2) {
      vikingXRef.current += vikingSpeed;
    }

    // Difficulty
    if (frameCountRef.current % 300 === 0 && frameCountRef.current > 0) {
      difficultyRef.current += 0.2;
    }

    // Spawn fireballs
    const spawnInterval = Math.max(600, 1000 - (difficultyRef.current * 100));
    if (p5.millis() - lastFireballTimeRef.current > spawnInterval) {
      const fireballCount = Math.min(5, Math.floor(difficultyRef.current));
      for (let i = 0; i < fireballCount; i++) {
        fireballsRef.current.push({
          x: p5.random(FIREBALL_WIDTH/2, p5.width - FIREBALL_WIDTH/2),
          y: -FIREBALL_HEIGHT/2,
          speed: (3 + difficultyRef.current + p5.random(-1, 2)) * (p5.height / 360),
          width: FIREBALL_WIDTH,
          height: FIREBALL_HEIGHT
        });
      }
      lastFireballTimeRef.current = p5.millis();
    }

    // Update fireballs
    for (let i = fireballsRef.current.length - 1; i >= 0; i--) {
      const fireball = fireballsRef.current[i];
      fireball.y += fireball.speed;

      if (fireballImgRef.current) {
        p5.image(
            fireballImgRef.current,
            fireball.x - fireball.width/2,
            fireball.y - fireball.height/2,
            fireball.width,
            fireball.height
        );
      } else {
        p5.fill(255, 0, 0);
        p5.ellipse(fireball.x, fireball.y, fireball.width, fireball.height);
      }

      if (fireball.y > p5.height + fireball.height/2) {
        fireballsRef.current.splice(i, 1);
      }

      const distance = p5.dist(vikingXRef.current, vikingYRef.current, fireball.x, fireball.y);
      if (distance < (VIKING_WIDTH + fireball.width) / 2.5) {
        fireballsRef.current.splice(i, 1);
        setLives(prevLives => {
          const newLives = prevLives - 1;
          if (newLives <= 0) setGameOver(true);
          return newLives;
        });
      }
    }

    // Timer
    if (frameCountRef.current % 60 === 0 && frameCountRef.current > 0) {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setGameOver(true);
          setIsModalOpen(true);
          return 0;
        }
        return prevTime - 1;
      });
    }

    // Draw HUD
    drawHearts(p5);

    p5.fill(255);
    p5.textSize(p5.min(24, p5.width/27));
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Time: ${timeLeft}s`, 20, 60);
    if (highScore > 0) {
      p5.text(`Best: ${highScore}`, 20, 90);
    }

    frameCountRef.current++;

    // Difficulty wave
    if (frameCountRef.current % 250 === 0 && frameCountRef.current > 0) {
      const waveCount = Math.floor(difficultyRef.current * 2);
      for (let i = 0; i < waveCount; i++) {
        const spacing = p5.width / waveCount;
        fireballsRef.current.push({
          x: spacing * i + spacing/2,
          y: -FIREBALL_HEIGHT/2,
          speed: (4 + difficultyRef.current) * (p5.height / 360),
          width: FIREBALL_WIDTH,
          height: FIREBALL_HEIGHT
        });
      }
    }
  };

  // Mouse click handler
  const mousePressed = (p5: p5Types) => {
    if (!gameStarted && !gameOver) {
      resetGame();
    }
  };

  // Modal close handler
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetGame();
  };

  return (
      <div className="viking-game-container">
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="game-inner-container"
        >
          <div className="game-canvas">
            <h1 className="game-title">Viking vs Fireballs</h1>
            <Sketch
                preload={preload}
                setup={setup}
                draw={draw}
                mousePressed={mousePressed}
            />
          </div>
        </motion.div>

        <Modal3 open={isModalOpen} onClose={handleModalClose}>
          <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="flex flex-col"
          >
            <h1 className="text-4xl font-bold mb-6 norse">
              {finalScore >= 100
                  ? 'Perfect! Odin is proud of you!'
                  : finalScore >= 70
                      ? 'Great effort, warrior!'
                      : finalScore >= 40
                          ? 'You fought bravely!'
                          : 'Better luck next time!'}
            </h1>
            <h2 className="text-3xl mb-3 font-bold norse">Lives: {lives}/10</h2>
            <h2 className="text-3xl mb-3 font-bold norse">Time: {30 - timeLeft}s</h2>
            <h2 className="text-3xl mb-3 font-bold norse">Score: {finalScore} points</h2>
            <Button
                onClick={() => { resetGame(); setIsModalOpen(false); }}
                add={"text-white text-3xl hover:bg-white hover:text-black border-2 border-solid border-black"}
            >
              Try Again!
            </Button>
          </motion.div>
        </Modal3>
      </div>
  );
};

export default Level7;