import p5Types from 'p5';
import { Entity, Attack } from '../types';
import { HIT_COOLDOWN } from '../constants';

// Update all active attacks and check for collisions
export const updateAttacks = (
  p5: p5Types,
  attacks: Attack[],
  player: Entity,
  enemy: Entity,
  onHit: (isPlayerHit: boolean) => void
) => {
  for (let i = attacks.length - 1; i >= 0; i--) {
    const attack = attacks[i];
    
    // Move attack
    attack.x += attack.direction * (attack.isPlayerAttack ? 10 : 7);
    
    // Decrease lifetime
    attack.lifetime--;
    
    // Check for collisions
    if (attack.isPlayerAttack) {
      // Zwiększona strefa kolizji dla Ice Gianta
      // Dodatkowe 15px na wysokości i szerokości obszaru kolizji
      const enemyCollisionWidth = enemy.width + 15;
      const enemyCollisionHeight = enemy.height + 15;
      
      // Player attack hitting enemy z większym obszarem kolizji
      if (
        enemy.hitCooldown <= 0 &&
        attack.x + attack.width/2 > enemy.x - enemyCollisionWidth/2 &&
        attack.x - attack.width/2 < enemy.x + enemyCollisionWidth/2 &&
        attack.y + attack.height/2 > enemy.y &&  // Zaczynamy od pozycji Y (zamiast Y - height/2)
        attack.y - attack.height/2 < enemy.y + enemyCollisionHeight
      ) {
        enemy.health--;
        enemy.hitCooldown = HIT_COOLDOWN;
        attacks.splice(i, 1);
        onHit(false); // Enemy was hit
        continue;
      }
    } else {
      // Enemy attack hitting player
      if (
        player.hitCooldown <= 0 &&
        attack.x + attack.width/2 > player.x - player.width/2 &&
        attack.x - attack.width/2 < player.x + player.width/2 &&
        attack.y + attack.height/2 > player.y - player.height/2 &&
        attack.y - attack.height/2 < player.y + player.height/2
      ) {
        player.health--;
        player.hitCooldown = HIT_COOLDOWN;
        attacks.splice(i, 1);
        onHit(true); // Player was hit
        continue;
      }
    }
    
    // Remove if expired or off-screen
    if (
      attack.lifetime <= 0 || 
      attack.x < -50 || 
      attack.x > p5.width + 50
    ) {
      attacks.splice(i, 1);
    }
  }
};