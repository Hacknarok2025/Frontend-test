import { useEffect, useState, useRef } from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';
import './Level9.css';

// Import types
import { Entity, Attack, Platform, GameImages, CanvasSize } from './types';

// Import constants
import { CANVAS_WIDTH, CANVAS_HEIGHT, ASSETS } from './constants';

// Import utility functions
import { applyPhysics } from './utils/physics';
import { drawEntity, drawAttacks, drawHUD } from './utils/renderer';
import { handlePlayerControls, checkGameControls } from './utils/controls';
import { updateEnemyAI } from './utils/enemyAI';
import { updateAttacks } from './utils/combat';
import {
  initPlatforms,
  initPlayer,
  initEnemy,
  checkGameOver,
} from './utils/gameManager';

const Level9 = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Use refs to persist values between renders
  const canvasSizeRef = useRef<CanvasSize>({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });
  const groundLevelRef = useRef(0);

  // Image refs
  const imagesRef = useRef<GameImages>({
    background: null,
    player: null,
    enemy: null,
    hammer: null,
    iceball: null,
    platform: null,
  });

  // Game entities
  const playerRef = useRef<Entity | null>(null);
  const enemyRef = useRef<Entity | null>(null);
  const attacksRef = useRef<Attack[]>([]);
  const platformsRef = useRef<Platform[]>([]);

  // Particle systems
  const dustParticlesRef = useRef<any[]>([]);
  const impactParticlesRef = useRef<any[]>([]);

  const p5InstanceRef = useRef<p5Types | null>(null);
  const frameCountRef = useRef(0);

  // Function to reset the game
  const resetGame = () => {
    // Initialize ground level if not set
    if (groundLevelRef.current === 0) {
      groundLevelRef.current = canvasSizeRef.current.height - 40;
    }

    // Initialize game entities
    playerRef.current = initPlayer(groundLevelRef.current);
    enemyRef.current = initEnemy(groundLevelRef.current);

    // Reset attacks
    attacksRef.current = [];
    frameCountRef.current = 0;

    // Reset particle systems
    dustParticlesRef.current = [];
    impactParticlesRef.current = [];

    // Update game state
    setGameStarted(true);
    setGameOver(false);
    setPlayerWon(false);
  };

  // Function to add a new attack
  const addAttack = (attack: Attack) => {
    attacksRef.current.push(attack);
  };

  // Function to handle entity hit
  const handleHit = (isPlayerHit: boolean) => {
    // Sound effects or visual feedback could be added here
  };

  // p5.js preload function - load images before setup
  const preload = (p5: p5Types) => {
    console.log('Preload called');

    // Load background image
    p5.loadImage(
      ASSETS.BACKGROUND,
      (img) => {
        imagesRef.current.background = img;
        console.log('Background image loaded successfully');
      },
      () => console.error('Failed to load background image')
    );

    // Load player image
    p5.loadImage(
      ASSETS.PLAYER,
      (img) => {
        imagesRef.current.player = img;
        console.log('Player image loaded successfully');
      },
      () => console.error('Failed to load player image')
    );

    // Load enemy image
    p5.loadImage(
      ASSETS.ENEMY,
      (img) => {
        imagesRef.current.enemy = img;
        console.log('Enemy image loaded successfully');
      },
      () => console.error('Failed to load enemy image')
    );

    // Load hammer image
    p5.loadImage(
      ASSETS.HAMMER,
      (img) => {
        imagesRef.current.hammer = img;
        console.log('Hammer image loaded successfully');
      },
      () => console.error('Failed to load hammer image')
    );

    // Load iceball image
    p5.loadImage(
      ASSETS.ICEBALL,
      (img) => {
        imagesRef.current.iceball = img;
        console.log('Iceball image loaded successfully');
      },
      () => console.error('Failed to load iceball image')
    );

    // Load platform image
    p5.loadImage(
      ASSETS.PLATFORM,
      (img) => {
        imagesRef.current.platform = img;
        console.log('Platform image loaded successfully');
      },
      () => console.error('Failed to load platform image')
    );
  };

  // p5.js setup function - initialize game environment
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log('Setup called');
    p5InstanceRef.current = p5;

    // Create canvas
    p5.createCanvas(
      canvasSizeRef.current.width,
      canvasSizeRef.current.height
    ).parent(canvasParentRef);

    // Set ground level
    groundLevelRef.current = canvasSizeRef.current.height - 40;

    // Initialize platforms
    platformsRef.current = initPlatforms(groundLevelRef.current);

    setCanvasReady(true);
  };

  // p5.js draw function - runs continuously
  const draw = (p5: p5Types) => {
    if (!canvasReady) {
      p5.background(0);
      p5.fill(255);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Loading...', p5.width / 2, p5.height / 2);
      return;
    }

    // Draw appropriate screen based on game state
    if (!gameStarted && !gameOver) {
      drawStartScreen(p5);
    } else if (gameOver) {
      drawGameOverScreen(p5);
    } else {
      drawGameplay(p5);
    }

    // Increment frame count
    frameCountRef.current++;
  };

  // Function to draw the start screen
  const drawStartScreen = (p5: p5Types) => {
    // Draw background image if loaded, otherwise black background
    if (imagesRef.current.background) {
      p5.image(imagesRef.current.background, 0, 0, p5.width, p5.height);
    } else {
      p5.background(0);
    }

    // Add semi-transparent black overlay for text readability (less transparent)
    p5.fill(0, 0, 0, 230);
    p5.rect(0, 0, p5.width, p5.height);

    // Title text
    p5.fill(255); // White text
    p5.textSize(p5.min(40, p5.width / 16));
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textFont('Norse');
    p5.text('ASGARD CLASH', p5.width / 2, p5.height / 2 - p5.height / 6); // Moved up to create more space

    // Instructions content with increased spacing between lines
    p5.textSize(p5.min(20, p5.width / 32));
    p5.text(
      'Press SPACE or click to start',
      p5.width / 2,
      p5.height / 2 - p5.height / 20
    );
    p5.text(
      'Move with LEFT and RIGHT arrows, SPACE to jump',
      p5.width / 2,
      p5.height / 2 + p5.height / 10
    ); // Increased spacing
    p5.text(
      'Press X to attack with your lightning hammer',
      p5.width / 2,
      p5.height / 2 + p5.height / 6
    ); // Increased spacing
    p5.text(
      'Hit the ice giant 5 times to win!',
      p5.width / 2,
      p5.height / 2 + p5.height / 4
    ); // Increased spacing

    // Start game when space is pressed or mouse is clicked
    if (p5.keyIsDown(32) || p5.mouseIsPressed) {
      // 32 is spacebar
      resetGame();
    }
  };

  // Helper function to draw Nordic corner decorations
  const drawNordicCorner = (
    p5: p5Types,
    x: number,
    y: number,
    size: number,
    position: number
  ) => {
    p5.push();
    p5.translate(x, y);
    p5.stroke(218, 165, 32);
    p5.strokeWeight(3);

    switch (position) {
      case 0: // Top-left
        p5.line(0, size, size, size);
        p5.line(size, 0, size, size);
        break;
      case 1: // Top-right
        p5.line(-size, size, 0, size);
        p5.line(-size, 0, -size, size);
        break;
      case 2: // Bottom-left
        p5.line(0, -size, size, -size);
        p5.line(size, 0, size, -size);
        break;
      case 3: // Bottom-right
        p5.line(-size, -size, 0, -size);
        p5.line(-size, 0, -size, -size);
        break;
    }
    p5.pop();
  };

  // Function to draw the game over screen
  const drawGameOverScreen = (p5: p5Types) => {
    // Draw background image if loaded
    if (imagesRef.current.background) {
      p5.image(imagesRef.current.background, 0, 0, p5.width, p5.height);
    } else {
      p5.background(0);
    }

    // Add semi-transparent overlay for text readability (less transparent)
    p5.fill(0, 0, 0, 230);
    p5.rect(0, 0, p5.width, p5.height);

    // Game over text with Level7 styling
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textFont('Norse');

    if (playerWon) {
      // Calculate score based on remaining health (0-200)
      const healthScore = playerRef.current ? playerRef.current.health * 40 : 0; // Each health point = 40 score points (5 health = 200)

      // Victory title
      p5.fill(255); // White text
      p5.textSize(p5.min(40, p5.width / 16));
      p5.text('CONGRATULATIONS!', p5.width / 2, p5.height / 2 - p5.height / 5); // Moved up to create more space

      // "You finished the game" subtitle
      p5.textSize(p5.min(32, p5.width / 20));
      p5.text(
        'YOU FINISHED THE GAME',
        p5.width / 2,
        p5.height / 2 - p5.height / 8
      ); // Increased spacing

      // Score display
      p5.textSize(p5.min(30, p5.width / 21));
      p5.text(`You have defeated the ice giant!`, p5.width / 2, p5.height / 2); // Increased spacing
      p5.text(
        `Score: ${healthScore}/200`,
        p5.width / 2,
        p5.height / 2 + p5.height / 8
      ); // Increased spacing

      // Play again instruction
      p5.textSize(p5.min(20, p5.width / 32));
      p5.text(
        'Press SPACE to play again',
        p5.width / 2,
        p5.height / 2 + p5.height / 4
      ); // Increased spacing
    } else {
      // Defeat title - match Level7's red for "GAME OVER" text
      p5.fill(255, 0, 0); // Red text
      p5.textSize(p5.min(40, p5.width / 16));
      p5.text('DEFEAT!', p5.width / 2, p5.height / 2 - p5.height / 5); // Moved up to create more space

      // Defeat message
      p5.fill(255); // White text
      p5.textSize(p5.min(30, p5.width / 21));
      p5.text(
        'The ice giant was too powerful!',
        p5.width / 2,
        p5.height / 2 - p5.height / 10
      ); // Increased spacing

      // Show player's final health score
      const healthScore = playerRef.current ? playerRef.current.health * 40 : 0;
      p5.text(
        `Final score: ${healthScore}/200`,
        p5.width / 2,
        p5.height / 2 + p5.height / 10
      ); // Increased spacing

      // Play again instruction
      p5.textSize(p5.min(20, p5.width / 32));
      p5.text(
        'Press SPACE to play again',
        p5.width / 2,
        p5.height / 2 + p5.height / 5
      ); // Increased spacing
    }

    // Check for restart input (space key)
    if (p5.keyIsDown(32)) {
      // 32 is spacebar
      resetGame();
    }
  };

  // Helper function to draw victory runes around title
  const drawVictoryRunes = (
    p5: p5Types,
    x: number,
    y: number,
    frame: number
  ) => {
    const runeCount = 8;
    const radius = 160;

    p5.push();
    p5.translate(x, y);
    p5.noFill();
    p5.stroke(255, 215, 0, 150);
    p5.strokeWeight(2);

    for (let i = 0; i < runeCount; i++) {
      const angle = (i / runeCount) * p5.TWO_PI + frame * 0.005;
      const runeX = p5.cos(angle) * radius;
      const runeY = p5.sin(angle) * radius;

      p5.push();
      p5.translate(runeX, runeY);
      p5.rotate(angle + p5.PI / 2);

      // Draw a simple rune shape
      p5.line(0, -10, 0, 10);
      p5.line(-5, -5, 5, -5);
      p5.line(-5, 5, 5, 5);

      p5.pop();
    }

    p5.pop();
  };

  // Helper function to draw particles
  const drawParticles = (p5: p5Types, isVictory: boolean) => {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      // Calculate particle position based on time
      const angle = (i / particleCount) * p5.TWO_PI;
      const wobble = p5.sin(frameCountRef.current * 0.05 + i * 0.4) * 30;

      const distFromCenter = 100 + wobble;
      const x =
        p5.width / 2 +
        p5.cos(angle + frameCountRef.current * 0.01) * distFromCenter;
      const y =
        p5.height / 2 +
        p5.sin(angle + frameCountRef.current * 0.01) * distFromCenter;

      // Set particle appearance
      if (isVictory) {
        p5.fill(255, 215, 0, p5.random(100, 200));
      } else {
        p5.fill(255, p5.random(0, 100), 0, p5.random(100, 200));
      }

      p5.noStroke();

      // Draw particle
      const size = p5.random(3, 6);
      p5.ellipse(x, y, size, size);
    }
  };

  // Function to draw the gameplay screen
  const drawGameplay = (p5: p5Types) => {
    if (!playerRef.current || !enemyRef.current) return;

    // Draw game background (nieruchome)
    if (imagesRef.current.background) {
      // Wyświetlenie tła bez efektu parallax
      p5.image(imagesRef.current.background, 0, 0, p5.width, p5.height);
    } else {
      // Create an atmospheric gradient background
      const gradient = p5.drawingContext as CanvasRenderingContext2D;
      const grd = gradient.createLinearGradient(0, 0, 0, p5.height);
      grd.addColorStop(0, '#051428');
      grd.addColorStop(0.5, '#1a3a5f');
      grd.addColorStop(1, '#2a4a6f');
      gradient.fillStyle = grd;
      p5.rect(0, 0, p5.width, p5.height);

      // Add atmospheric particles (snow/stars)
      for (let i = 0; i < 50; i++) {
        const x = (p5.frameCount * 0.5 + i * 20) % p5.width;
        const y = p5.noise(i * 0.1, p5.frameCount * 0.01) * p5.height;
        const size = p5.random(1, 3);
        p5.fill(255, 255, 255, p5.random(100, 200));
        p5.noStroke();
        p5.ellipse(x, y, size, size);
      }
    }

    // Add environmental effects - floating particles
    drawEnvironmentalEffects(p5);

    // Draw platforms with platform image
    for (const platform of platformsRef.current) {
      if (imagesRef.current.platform) {
        // Draw platform using the image with repeating pattern if needed
        const platformImg = imagesRef.current.platform;

        // Calculate how many times we need to repeat the image to cover the platform width
        const repeatCount = Math.ceil(platform.width / platformImg.width);

        for (let i = 0; i < repeatCount; i++) {
          const drawWidth = Math.min(
            platformImg.width,
            platform.width - i * platformImg.width
          );
          p5.image(
            platformImg,
            platform.x + i * platformImg.width,
            platform.y,
            drawWidth,
            platform.height
          );
        }
      } else {
        // Fallback if image not loaded - Create a stone texture gradient for platforms
        const platformGradient = p5.drawingContext as CanvasRenderingContext2D;
        const platformGrd = platformGradient.createLinearGradient(
          platform.x,
          platform.y,
          platform.x,
          platform.y + platform.height
        );
        platformGrd.addColorStop(0, '#4a4a4a');
        platformGrd.addColorStop(0.5, '#5a5a5a');
        platformGrd.addColorStop(1, '#3a3a3a');
        platformGradient.fillStyle = platformGrd;

        // Draw platform base with rounded corners
        p5.strokeWeight(2);
        p5.stroke(80, 80, 80);
        p5.rect(platform.x, platform.y, platform.width, platform.height, 4);
      }
    }

    // Draw ground with improved detail
    const groundGradient = p5.drawingContext as CanvasRenderingContext2D;
    const groundGrd = groundGradient.createLinearGradient(
      0,
      groundLevelRef.current,
      0,
      p5.height
    );
    groundGrd.addColorStop(0, '#5d4037'); // Dark brown
    groundGrd.addColorStop(0.7, '#3e2723'); // Darker brown
    groundGradient.fillStyle = groundGrd;

    p5.strokeWeight(2);
    p5.stroke(60, 40, 20);
    p5.rect(
      0,
      groundLevelRef.current,
      p5.width,
      p5.height - groundLevelRef.current
    );

    // Add ground texture details
    p5.stroke(90, 70, 50, 100);
    p5.strokeWeight(1);
    for (let i = 0; i < p5.width; i += 30) {
      p5.line(
        i,
        groundLevelRef.current + 5,
        i + 15,
        groundLevelRef.current + 5
      );
    }

    for (let i = 15; i < p5.width; i += 30) {
      p5.line(
        i,
        groundLevelRef.current + 15,
        i + 15,
        groundLevelRef.current + 15
      );
    }

    // Handle player controls
    handlePlayerControls(p5, playerRef.current, addAttack);

    // Apply physics to player with animated dust effects when landing
    const wasAirborne = playerRef.current.velocityY > 0;
    applyPhysics(
      playerRef.current,
      groundLevelRef.current,
      platformsRef.current,
      p5
    );
    if (wasAirborne && playerRef.current.velocityY === 0) {
      // Player just landed, create dust effect
      createDustEffect(
        p5,
        playerRef.current.x,
        playerRef.current.y + playerRef.current.height
      );
    }

    // Update enemy AI
    updateEnemyAI(
      p5,
      enemyRef.current,
      playerRef.current,
      frameCountRef.current,
      addAttack
    );

    // Apply physics to enemy
    applyPhysics(
      enemyRef.current,
      groundLevelRef.current,
      platformsRef.current,
      p5
    );

    // Update attacks with improved visuals
    updateAttacks(
      p5,
      attacksRef.current,
      playerRef.current,
      enemyRef.current,
      (isPlayerHit) => {
        handleHit(isPlayerHit);

        // Create impact particles at hit location
        if (isPlayerHit) {
          createImpactEffect(
            p5,
            playerRef.current!.x + playerRef.current!.width / 2,
            playerRef.current!.y + playerRef.current!.height / 2,
            false // Ice impact
          );
        } else {
          createImpactEffect(
            p5,
            enemyRef.current!.x + enemyRef.current!.width / 2,
            enemyRef.current!.y + enemyRef.current!.height / 2,
            true // Lightning impact
          );
        }
      }
    );

    // Draw player with directional facing
    drawEntity(p5, playerRef.current, imagesRef.current.player);

    // Draw enemy
    drawEntity(p5, enemyRef.current, imagesRef.current.enemy);

    // Draw attacks with trail effects
    drawAttacksWithEffects(
      p5,
      attacksRef.current,
      imagesRef.current.hammer,
      imagesRef.current.iceball
    );

    // Check game over conditions
    const gameOverResult = checkGameOver(
      playerRef.current.health,
      enemyRef.current.health
    );
    if (gameOverResult.isGameOver) {
      setGameOver(true);
      setPlayerWon(gameOverResult.playerWon);
    }
  };

  // Function to create dust effect when landing
  const createDustEffect = (p5: p5Types, x: number, y: number) => {
    for (let i = 0; i < 10; i++) {
      const particle = {
        x: x + p5.random(-10, 10),
        y: y,
        vx: p5.random(-1, 1),
        vy: p5.random(-2, -0.5),
        alpha: 255,
        size: p5.random(2, 5),
      };

      dustParticlesRef.current.push(particle);
    }
  };

  // Function to create impact effect when hitting
  const createImpactEffect = (
    p5: p5Types,
    x: number,
    y: number,
    isLightning: boolean
  ) => {
    for (let i = 0; i < 20; i++) {
      const angle = p5.random(0, p5.TWO_PI);
      const speed = p5.random(1, 5);

      const particle = {
        x: x,
        y: y,
        vx: p5.cos(angle) * speed,
        vy: p5.sin(angle) * speed,
        alpha: 255,
        size: p5.random(3, 8),
        isLightning: isLightning,
      };

      impactParticlesRef.current.push(particle);
    }
  };

  // Function to draw environmental effects
  const drawEnvironmentalEffects = (p5: p5Types) => {
    // Draw dust particles
    p5.noStroke();
    for (let i = dustParticlesRef.current.length - 1; i >= 0; i--) {
      const particle = dustParticlesRef.current[i];

      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 5;

      // Draw particle
      p5.fill(200, 200, 200, particle.alpha);
      p5.ellipse(particle.x, particle.y, particle.size, particle.size);

      // Remove faded particles
      if (particle.alpha <= 0) {
        dustParticlesRef.current.splice(i, 1);
      }
    }

    // Draw impact particles
    for (let i = impactParticlesRef.current.length - 1; i >= 0; i--) {
      const particle = impactParticlesRef.current[i];

      // Update particle position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.alpha -= 8;
      particle.size *= 0.95;

      // Draw particle with appropriate color
      if (particle.isLightning) {
        // Lightning effect (golden)
        p5.fill(255, 215, 0, particle.alpha);
      } else {
        // Ice effect (blue)
        p5.fill(100, 200, 255, particle.alpha);
      }

      p5.ellipse(particle.x, particle.y, particle.size, particle.size);

      // Remove faded particles
      if (particle.alpha <= 0) {
        impactParticlesRef.current.splice(i, 1);
      }
    }
  };

  // Function to draw attacks with trail effects
  const drawAttacksWithEffects = (
    p5: p5Types,
    attacks: Attack[],
    hammerImg: p5Types.Image | null,
    iceballImg: p5Types.Image | null
  ) => {
    for (const attack of attacks) {
      // Draw the trail effect first (behind the attack)
      if (attack.isPlayerAttack) {
        // Lightning trail for hammer
        p5.noStroke();
        for (let i = 0; i < 5; i++) {
          const trailAlpha = 150 - i * 30;
          p5.fill(255, 215, 0, trailAlpha);
          p5.ellipse(
            attack.x - attack.velocityX * 0.2 * i,
            attack.y - attack.velocityY * 0.2 * i,
            attack.width * 0.8,
            attack.height * 0.8
          );
        }
      } else {
        // Ice trail for iceball
        p5.noStroke();
        for (let i = 0; i < 5; i++) {
          const trailAlpha = 150 - i * 30;
          p5.fill(100, 200, 255, trailAlpha);
          p5.ellipse(
            attack.x - attack.velocityX * 0.2 * i,
            attack.y - attack.velocityY * 0.2 * i,
            attack.width * 0.8,
            attack.height * 0.8
          );
        }
      }

      // Draw the actual attack
      if (attack.isPlayerAttack && hammerImg) {
        // Rotate the hammer as it flies
        p5.push();
        p5.translate(attack.x + attack.width / 2, attack.y + attack.height / 2);
        p5.rotate(frameCountRef.current * 0.2);
        p5.image(
          hammerImg,
          -attack.width / 2,
          -attack.height / 2,
          attack.width,
          attack.height
        );
        p5.pop();
      } else if (!attack.isPlayerAttack && iceballImg) {
        p5.image(iceballImg, attack.x, attack.y, attack.width, attack.height);

        // Add extra ice particles for effect
        if (p5.frameCount % 3 === 0) {
          const particle = {
            x: attack.x + attack.width / 2,
            y: attack.y + attack.height / 2,
            vx: p5.random(-0.5, 0.5),
            vy: p5.random(-0.5, 0.5),
            alpha: 200,
            size: p5.random(2, 5),
            isLightning: false,
          };

          impactParticlesRef.current.push(particle);
        }
      } else {
        // Fallback if images not loaded
        p5.noStroke();
        if (attack.isPlayerAttack) {
          p5.fill(255, 200, 0);
        } else {
          p5.fill(100, 200, 255);
        }
        p5.ellipse(
          attack.x + attack.width / 2,
          attack.y + attack.height / 2,
          attack.width,
          attack.height
        );
      }
    }
  };

  // Mouse click handler
  const mousePressed = (p5: p5Types) => {
    if (!gameStarted && !gameOver) {
      resetGame();
    }
  };

  return (
    <div className="asgard-game-container">
      <div className="game-inner-container">
        <h1 className="game-title">Asgard Clash</h1>
        <div className="game-canvas">
          <Sketch
            preload={preload}
            setup={setup}
            draw={draw}
            mousePressed={mousePressed}
          />
        </div>
        <div className="game-instructions">
          <h2>How to Play:</h2>
          <p>Use LEFT and RIGHT arrow keys to move, SPACE to jump.</p>
          <p>Press X to throw your lightning hammer.</p>
          <p>Hit the ice giant 5 times to win!</p>
          <p>Dodge the ice giant's attacks.</p>
        </div>
      </div>
    </div>
  );
};

export default Level9;
