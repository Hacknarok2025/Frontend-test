import p5Types from 'p5';
import { Entity, Platform } from '../types';
import { GRAVITY } from '../constants';

// Apply physics to an entity (player or enemy)
export const applyPhysics = (entity: Entity, groundLevel: number, platforms: Platform[], p5: p5Types) => {
  // Apply gravity
  entity.velocity += GRAVITY;
  entity.y += entity.velocity;
  
  // Check platform collisions
  let onPlatform = false;
  for (const platform of platforms) {
    // Check if entity is on a platform
    if (
      entity.y + entity.height > platform.y &&
      entity.y + entity.height < platform.y + platform.height + 10 &&
      entity.x + entity.width/2 > platform.x &&
      entity.x - entity.width/2 < platform.x + platform.width &&
      entity.velocity >= 0
    ) {
      entity.y = platform.y - entity.height;
      entity.velocity = 0;
      entity.jumping = false;
      onPlatform = true;
      break;
    }
  }
  
  // Check ground collision
  if (!onPlatform && entity.y + entity.height > groundLevel) {
    entity.y = groundLevel - entity.height;
    entity.velocity = 0;
    entity.jumping = false;
  }
  
  // Keep entity within screen bounds
  if (entity.x - entity.width/2 < 0) {
    entity.x = entity.width/2;
  } else if (entity.x + entity.width/2 > p5.width) {
    entity.x = p5.width - entity.width/2;
  }
  
  // Decrease cooldowns
  if (entity.attackCooldown > 0) entity.attackCooldown--;
  if (entity.hitCooldown > 0) entity.hitCooldown--;
};