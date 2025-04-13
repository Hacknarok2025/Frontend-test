import { Entity, Platform } from '../types';
import { 
  PLAYER_WIDTH, PLAYER_HEIGHT, ENEMY_WIDTH, ENEMY_HEIGHT,
  PLAYER_INITIAL_HEALTH, ENEMY_INITIAL_HEALTH
} from '../constants';

// Initialize game platforms
export const initPlatforms = (groundLevel: number): Platform[] => {
  return [
    { x: 100, y: groundLevel - 100, width: 150, height: 15 },
    { x: 550, y: groundLevel - 100, width: 150, height: 15 },
    { x: 350, y: groundLevel - 180, width: 100, height: 15 },
  ];
};

// Initialize player entity
export const initPlayer = (groundLevel: number): Entity => {
  return {
    x: 200,
    y: groundLevel - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    health: PLAYER_INITIAL_HEALTH,
    direction: 1,
    jumping: false,
    attacking: false,
    velocity: 0,
    attackCooldown: 0,
    hitCooldown: 0,
  };
};

// Initialize enemy entity
export const initEnemy = (groundLevel: number): Entity => {
  const height = 80; // Zwiększona wysokość Ice Gianta (była 60)
  return {
    x: 600,
    y: groundLevel - height, // Ustawiamy dokładnie na ziemi
    width: 70, // Zwiększona szerokość (była 60)
    height: height,
    health: ENEMY_INITIAL_HEALTH,
    direction: -1, // Start facing left
    jumping: false,
    attacking: false,
    velocity: 0,
    velocityY: 0,
    attackCooldown: 0,
    hitCooldown: 0,
  };
};

// Check win/lose conditions
export const checkGameOver = (playerHealth: number, enemyHealth: number): { isGameOver: boolean; playerWon: boolean } => {
  if (playerHealth <= 0) {
    return { isGameOver: true, playerWon: false };
  } else if (enemyHealth <= 0) {
    return { isGameOver: true, playerWon: true };
  }
  return { isGameOver: false, playerWon: false };
};