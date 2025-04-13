// Game dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

// Entity dimensions
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 50;
export const ENEMY_WIDTH = 50;
export const ENEMY_HEIGHT = 60;

// Physics constants
export const GRAVITY = 0.6;
export const JUMP_FORCE = -12;
export const MOVEMENT_SPEED = 5;

// Attack settings
export const ATTACK_WIDTH = 40;
export const ATTACK_HEIGHT = 20;

// Game settings
export const PLAYER_INITIAL_HEALTH = 5;
export const ENEMY_INITIAL_HEALTH = 5;
export const PLAYER_ATTACK_COOLDOWN = 30; // 0.5 seconds at 60fps
export const ENEMY_ATTACK_COOLDOWN = 60; // 1 second at 60fps
export const HIT_COOLDOWN = 30;

// Asset paths
export const ASSETS = {
  BACKGROUND: '/imgs/background.jpg',
  PLAYER: '/imgs/viking-pixel.png',
  ENEMY: '/imgs/ice_giant.png',
  HAMMER: '/imgs/hammer.png',
  ICEBALL: '/imgs/ice_ball.png',
  PLATFORM: '/imgs/platform.png',
};