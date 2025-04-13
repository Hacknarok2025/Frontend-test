import p5Types from 'p5';
import { Entity, Attack } from '../types';
import { MOVEMENT_SPEED, JUMP_FORCE, ATTACK_WIDTH, ATTACK_HEIGHT, ENEMY_ATTACK_COOLDOWN } from '../constants';

// Update enemy AI behavior
export const updateEnemyAI = (p5: p5Types, enemy: Entity, player: Entity, frameCount: number, onAttack: (attack: Attack) => void) => {
  // Move towards player
  if (frameCount % 120 < 60) { // Move for a while, then pause
    if (enemy.x > player.x + 100) {
      enemy.x -= MOVEMENT_SPEED / 2;
      enemy.direction = -1;
    } else if (enemy.x < player.x - 100) {
      enemy.x += MOVEMENT_SPEED / 2;
      enemy.direction = 1;
    }
  }
  
  // Jump occasionally
  if (frameCount % 180 === 0 && !enemy.jumping) {
    enemy.velocity = JUMP_FORCE * 0.8;
    enemy.jumping = true;
  }
  
  // Attack occasionally
  if (
    frameCount % 90 === 0 && 
    enemy.attackCooldown <= 0 &&
    p5.dist(enemy.x, enemy.y, player.x, player.y) < 300
  ) {
    enemy.attacking = true;
    enemy.attackCooldown = ENEMY_ATTACK_COOLDOWN;
    
    // Create an iceball attack
    const attack: Attack = {
      x: enemy.x + (enemy.direction * enemy.width/2),
      y: enemy.y + enemy.height/4,
      width: ATTACK_WIDTH,
      height: ATTACK_HEIGHT,
      direction: enemy.direction,
      isPlayerAttack: false,
      lifetime: 120,
    };
    
    onAttack(attack);
  } else {
    enemy.attacking = false;
  }
};