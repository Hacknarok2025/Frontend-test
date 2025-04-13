import { useEffect, useState, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import './Level7.css';
import {motion} from "framer-motion";
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
  const [lives, setLives] = useState(10); // Zmieniamy z score na lives
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0); // Nowy stan dla końcowego wyniku

  // Game constants
  const VIKING_WIDTH = 50;
  const VIKING_HEIGHT = 49;
  const FIREBALL_WIDTH = 30;
  const FIREBALL_HEIGHT = 50;

  // Use refs to persist values between renders
  const canvasSizeRef = useRef({ width:'100%', height: '100%' });
  const vikingImgRef = useRef<p5Types.Image | null>(null);
  const fireballImgRef = useRef<p5Types.Image | null>(null);
  const backgroundImgRef = useRef<p5Types.Image | null>(null);
  const vikingXRef = useRef(0);
  const vikingYRef = useRef(0);
  const fireballsRef = useRef<Fireball[]>([]);
  const lastFireballTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const difficultyRef = useRef(1);
  const p5InstanceRef = useRef<p5Types | null>(null);
  const canvasReadyRef = useRef(false);

  // Function to reset the game
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
    const timeBonus = 100; // 100 punktów za przetrwanie
    const livesPenalty = (10 - lives) * 10; // 10 punktów za każde stracone życie
    return Math.max(0, timeBonus - livesPenalty); // Zabezpieczenie przed ujemnym wynikiem
  };

  // p5.js preload function - load images before setup
  const preload = (p5: p5Types) => {
    console.log("Preload called");

    // Load background image first
    p5.loadImage(
        '/imgs/level_7_game_background.png',
        (img) => {
          backgroundImgRef.current = img;
          console.log("Background image loaded successfully", img.width, img.height);

          // Store the canvas dimensions based on background image
          canvasSizeRef.current = { width: img.width, height: img.height };

          // Set initial viking position
          vikingXRef.current = img.width / 2;
          vikingYRef.current = img.height - 80;
        },
        () => console.error("Failed to load background image")
    );

    // Load Viking image
    p5.loadImage(
        '/imgs/viking-pixel.png',
        (img) => {
          vikingImgRef.current = img;
          console.log("Viking image loaded successfully");
        },
        () => console.error("Failed to load Viking image")
    );

    // Load Fireball image
    p5.loadImage(
        '/imgs/fireball.png',
        (img) => {
          fireballImgRef.current = img;
          console.log("Fireball image loaded successfully");
        },
        () => console.error("Failed to load Fireball image")
    );
  };

  // p5.js setup function - initialize game environment
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log("Setup called with canvas size:", canvasSizeRef.current);
    p5InstanceRef.current = p5;

    // Wait until we have the background dimensions
    if (backgroundImgRef.current && canvasSizeRef.current.width > 0) {
      p5.createCanvas(
          canvasSizeRef.current.width,
          canvasSizeRef.current.height
      ).parent(canvasParentRef);

      canvasReadyRef.current = true;
      setCanvasReady(true);
      console.log("Canvas created with dimensions:", canvasSizeRef.current);
    } else {
      // Create temporary canvas and wait for assets
      p5.createCanvas(640, 360).parent(canvasParentRef);

      // Check again once assets are loaded
      const checkInterval = setInterval(() => {
        if (backgroundImgRef.current && !canvasReadyRef.current) {
          clearInterval(checkInterval);
          canvasSizeRef.current = {
            width: backgroundImgRef.current.width,
            height: backgroundImgRef.current.height
          };

          p5.resizeCanvas(
              canvasSizeRef.current.width,
              canvasSizeRef.current.height
          );

          // Update viking position
          vikingXRef.current = canvasSizeRef.current.width / 2;
          vikingYRef.current = canvasSizeRef.current.height - 80;

          canvasReadyRef.current = true;
          setCanvasReady(true);
          console.log("Canvas resized with dimensions:", canvasSizeRef.current);
        }
      }, 100);
    }
  };

  // p5.js draw function - runs continuously
  const draw = (p5: p5Types) => {
    if (!canvasReadyRef.current || !backgroundImgRef.current) {
      p5.background(0);
      p5.fill(255);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Loading...', p5.width/2, p5.height/2);
      return;
    }

    // Start Screen if not started
    if (!gameStarted && !gameOver) {
      // Draw background
      p5.image(backgroundImgRef.current, 0, 0);

      // Add semi-transparent black overlay for text readability
      p5.fill(0, 0, 0, 200);
      p5.rect(0, 0, p5.width, p5.height);

      p5.fill(255); // White text
      p5.textSize(p5.min(40, p5.width/16));
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Viking Runner', p5.width/2, p5.height/2 - p5.height/7);

      p5.textSize(p5.min(20, p5.width/32));

      if (p5.keyIsDown(32) || p5.mouseIsPressed) { // 32 is spacebar
        resetGame();
      }

      return;
    }

    // Game over screen
    if (gameOver) {
      // Draw background
      p5.image(backgroundImgRef.current, 0, 0);
      setIsModalOpen(true);
      setFinalScore(calculateFinalScore()); // Oblicz wynik końcowy

      // Add semi-transparent overlay
      p5.fill(0, 0, 0, 180);
      p5.rect(0, 0, p5.width, p5.height);

      p5.fill(255, 0, 0); // Red for "GAME OVER" text
      p5.textSize(p5.min(40, p5.width/16));
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('GAME OVER!', p5.width/2, p5.height/2 - p5.height/10);

      p5.fill(255); // White text
      p5.textSize(p5.min(30, p5.width/21));
      p5.text(`Lives: ${lives}/10`, p5.width/2, p5.height/2);

      if (finalScore > highScore) {
        setHighScore(finalScore);
      }

      p5.textSize(p5.min(20, p5.width/32));

      return;
    }

    // Gameplay
    // Draw game background
    p5.image(backgroundImgRef.current, 0, 0);

    // Draw viking
    if (vikingImgRef.current) {
      p5.image(
          vikingImgRef.current,
          vikingXRef.current - VIKING_WIDTH/2,
          vikingYRef.current - VIKING_HEIGHT/2,
          VIKING_WIDTH,
          VIKING_HEIGHT
      );
    } else {
      // Fallback if image failed to load
      p5.fill(0, 255, 0);
      p5.rect(
          vikingXRef.current - VIKING_WIDTH/2,
          vikingYRef.current - VIKING_HEIGHT/2,
          VIKING_WIDTH,
          VIKING_HEIGHT
      );
    }

    // Viking movement - only left-right movement
    const vikingSpeed = p5.width / 64; // Scale speed based on canvas width
    if (p5.keyIsDown(p5.LEFT_ARROW) && vikingXRef.current > VIKING_WIDTH/2) {
      vikingXRef.current -= vikingSpeed;
    }
    if (p5.keyIsDown(p5.RIGHT_ARROW) && vikingXRef.current < p5.width - VIKING_WIDTH/2) {
      vikingXRef.current += vikingSpeed;
    }

    // Increase difficulty over time
    if (frameCountRef.current % 300 === 0 && frameCountRef.current > 0) {
      difficultyRef.current += 0.2;
    }

    // Spawn fireballs - more frequently as difficulty increases
    const spawnInterval = Math.max(600, 1000 - (difficultyRef.current * 100));
    if (p5.millis() - lastFireballTimeRef.current > spawnInterval) {
      // Spawn multiple fireballs at higher difficulties
      const fireballCount = Math.min(5, Math.floor(difficultyRef.current));

      for (let i = 0; i < fireballCount; i++) {
        const newFireball = {
          x: p5.random(FIREBALL_WIDTH/2, p5.width - FIREBALL_WIDTH/2),
          y: -FIREBALL_HEIGHT/2,
          speed: (3 + difficultyRef.current + p5.random(-1, 2)) * (p5.height / 360), // Scale speed based on canvas height
          width: FIREBALL_WIDTH,
          height: FIREBALL_HEIGHT
        };
        fireballsRef.current.push(newFireball);
      }
      lastFireballTimeRef.current = p5.millis();
    }

    // Update and draw fireballs
    for (let i = fireballsRef.current.length - 1; i >= 0; i--) {
      const fireball = fireballsRef.current[i];
      fireball.y += fireball.speed;

      // Draw fireball (with fallback) - no rotation
      if (fireballImgRef.current) {
        p5.image(
            fireballImgRef.current,
            fireball.x - fireball.width/2,
            fireball.y - fireball.height/2,
            fireball.width,
            fireball.height
        );
      } else {
        // Fallback if image failed to load
        p5.fill(255, 0, 0);
        p5.ellipse(fireball.x, fireball.y, fireball.width, fireball.height);
      }

      // Remove fireballs that are off-screen
      if (fireball.y > p5.height + fireball.height/2) {
        fireballsRef.current.splice(i, 1);
      }

      // Check collision with viking
      const distance = p5.dist(vikingXRef.current, vikingYRef.current, fireball.x, fireball.y);
      if (distance < (VIKING_WIDTH + fireball.width) / 2.5) {
        fireballsRef.current.splice(i, 1);

        // Deduct lives on collision
        setLives(prevLives => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            setGameOver(true);
            return 0;
          }
          return newLives;
        });
      }
    }

    // Update game timer
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

    // Draw HUD (Heads-Up Display)
    p5.fill(255);
    p5.textSize(p5.min(24, p5.width/27));
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Lives: ${lives}/10`, 20, 20);
    p5.text(`Time: ${timeLeft}s`, 20, 50);
    if (highScore > 0) {
      p5.text(`Best score: ${highScore}`, 20, 80);
    }

    // Increment frame count
    frameCountRef.current++;

    // Special difficult wave every 250 frames
    if (frameCountRef.current % 250 === 0 && frameCountRef.current > 0) {
      const waveCount = Math.floor(difficultyRef.current * 2);
      for (let i = 0; i < waveCount; i++) {
        const spacing = p5.width / waveCount;
        const newFireball = {
          x: spacing * i + spacing/2,
          y: -FIREBALL_HEIGHT/2,
          speed: (4 + difficultyRef.current) * (p5.height / 360),
          width: FIREBALL_WIDTH,
          height: FIREBALL_HEIGHT
        };
        fireballsRef.current.push(newFireball);
      }
    }
  };

  // Mouse click handler for starting the game
  const mousePressed = (p5: p5Types) => {
    if (!gameStarted && !gameOver) {
      resetGame();
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetGame();
  };

  return (
      <div className="viking-game-container" style={{
        backgroundImage: "url('/imgs/level7.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="game-inner-container">
          <div className="game-canvas">
            <h1 className="game-title">Viking vs Fireballs</h1>
            <Sketch preload={preload} setup={setup} draw={draw} mousePressed={mousePressed} />
          </div>
          <div className="game-instructions">
            <h2>How to Play:</h2>
            <p>Use LEFT and RIGHT arrow keys to move the Viking.</p>
            <p>Avoid the falling fireballs!</p>
            <p>You have 10 lives, lose 1 for each hit.</p>
            <p>Game ends after 30 seconds or when you lose all lives.</p>
            <p>Score: 100 points for surviving minus 10 for each lost life.</p>
          </div>
        </div>
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