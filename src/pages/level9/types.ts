import p5Types from 'p5';

export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  direction: number; // 1 for right, -1 for left
  jumping: boolean;
  attacking: boolean;
  velocity: number;
  attackCooldown: number;
  hitCooldown: number;
}

export interface Attack {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: number;
  isPlayerAttack: boolean;
  lifetime: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Game image references
export interface GameImages {
  background: p5Types.Image | null;
  player: p5Types.Image | null;
  enemy: p5Types.Image | null;
  hammer: p5Types.Image | null;
  iceball: p5Types.Image | null;
  platform: p5Types.Image | null;
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  playerWon: boolean;
  canvasReady: boolean;
}

export interface CanvasSize {
  width: number;
  height: number;
}