import { useEffect, useState, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import './Level7.css';

interface Fireball {
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
}

const Level7 = () => {
  // Game state
  const [score, setScore] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Game constants
  const VIKING_WIDTH = 35;
  const VIKING_HEIGHT = 49;
  const FIREBALL_WIDTH = 30; // Fireballs are taller than wide
  const FIREBALL_HEIGHT = 50;
  
  // Use refs to persist values between renders
  const canvasSizeRef = useRef({ width: 0, height: 0 });
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
      setScore(10);
      setGameOver(false);
      setTimeLeft(30);
      frameCountRef.current = 0;
      difficultyRef.current = 1;
      setGameStarted(true);
    }
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
      p5.text('Press SPACE or click to start', p5.width/2, p5.height/2);
      p5.text('Move using LEFT and RIGHT arrow keys', p5.width/2, p5.height/2 + p5.height/15);
      p5.text('Game lasts for 30 seconds', p5.width/2, p5.height/2 + p5.height/10);
      p5.text('You have 10 points, lose 1 for each hit', p5.width/2, p5.height/2 + p5.height/7);
      
      if (p5.keyIsDown(32) || p5.mouseIsPressed) { // 32 is spacebar
        resetGame();
      }
      
      return;
    }

    // Game over screen
    if (gameOver) {
      // Draw background
      p5.image(backgroundImgRef.current, 0, 0);
      
      // Add semi-transparent overlay
      p5.fill(0, 0, 0, 180);
      p5.rect(0, 0, p5.width, p5.height);
      
      p5.fill(255, 0, 0); // Red for "GAME OVER" text
      p5.textSize(p5.min(40, p5.width/16));
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('GAME OVER!', p5.width/2, p5.height/2 - p5.height/10);
      
      p5.fill(255); // White text
      p5.textSize(p5.min(30, p5.width/21));
      p5.text(`Score: ${score}/10`, p5.width/2, p5.height/2);
      
      if (score > highScore) {
        setHighScore(score);
      }
      
      p5.textSize(p5.min(20, p5.width/32));
      p5.text(`Best score: ${Math.max(highScore, score)}`, p5.width/2, p5.height/2 + p5.height/15);
      p5.text('Press SPACE to play again', p5.width/2, p5.height/2 + p5.height/7);
      
      // Listen for space to restart
      if (p5.keyIsDown(32)) { // 32 is spacebar
        resetGame();
      }
      
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
        
        // Deduct points on collision
        setScore(prevScore => {
          const newScore = prevScore - 1;
          if (newScore <= 0) {
            setGameOver(true);
            return 0;
          }
          return newScore;
        });
      }
    }

    // Update game timer
    if (frameCountRef.current % 60 === 0 && frameCountRef.current > 0) {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }

    // Draw HUD (Heads-Up Display)
    p5.fill(255);
    p5.textSize(p5.min(24, p5.width/27));
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Points: ${score}/10`, 20, 20);
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

  return (
    <div className="viking-game-container">
      <div className="game-inner-container">
        <h1 className="game-title">Viking vs Fireballs</h1>
        <div className="game-canvas">
          <Sketch preload={preload} setup={setup} draw={draw} mousePressed={mousePressed} />
        </div>
        <div className="game-instructions">
          <h2>How to Play:</h2>
          <p>Use LEFT and RIGHT arrow keys to move the Viking.</p>
          <p>Avoid the falling fireballs!</p>
          <p>You have 10 points, lose 1 for each hit.</p>
          <p>Game ends after 30 seconds or when you lose all points.</p>
        </div>
      </div>
    </div>
  );
};

export default Level7;