import p5Types from 'p5';
import { Entity, Attack } from '../types';
import { MOVEMENT_SPEED, JUMP_FORCE, ATTACK_WIDTH, ATTACK_HEIGHT, PLAYER_ATTACK_COOLDOWN } from '../constants';

// Handle player keyboard controls
export const handlePlayerControls = (p5: p5Types, player: Entity, onAttack: (attack: Attack) => void) => {
  // Movement
  if (p5.keyIsDown(p5.LEFT_ARROW)) {
    player.x -= MOVEMENT_SPEED;
    player.direction = -1;
  }
  
  if (p5.keyIsDown(p5.RIGHT_ARROW)) {
    player.x += MOVEMENT_SPEED;
    player.direction = 1;
  }
  
  // Jump (spacebar)
  if (p5.keyIsDown(32) && !player.jumping) { // 32 is spacebar
    player.velocity = JUMP_FORCE;
    player.jumping = true;
  }
  
  // Attack (X key)
  if (p5.keyIsDown(88) && player.attackCooldown <= 0) { // 88 is 'X'
    player.attacking = true;
    player.attackCooldown = PLAYER_ATTACK_COOLDOWN;
    
    // Create a hammer attack
    const attack: Attack = {
      x: player.x + (player.direction * player.width/2),
      y: player.y + player.height/4,
      width: ATTACK_WIDTH,
      height: ATTACK_HEIGHT,
      direction: player.direction,
      isPlayerAttack: true,
      lifetime: 30,
    };
    
    onAttack(attack);
  } else {
    player.attacking = false;
  }
};

// Check if game controls are pressed to start or restart the game
export const checkGameControls = (p5: p5Types) => {
  return p5.keyIsDown(32) || p5.mouseIsPressed; // 32 is spacebar
};