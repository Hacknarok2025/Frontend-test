import p5Types from 'p5';
import { Entity, Attack } from '../types';

// Draw an entity (player or enemy)
export const drawEntity = (p5: p5Types, entity: Entity, image: p5Types.Image | null) => {
  // Flash red when hit
  if (entity.hitCooldown > 0) {
    p5.tint(255, 100, 100);
  } else {
    p5.noTint();
  }
  
  // Draw entity
  if (image) {
    const direction = entity.direction === -1 ? -1 : 1;
    
    // Sprawdzenie czy to Ice Giant (przeciwnik) na podstawie szerokości i wysokości
    // Zaktualizowany rozmiar dla Ice Gianta
    const isIceGiant = entity.width === 70 && entity.height === 80;
    
    // Przesunięcie dla Ice Gianta, aby skompensować dodatkową przestrzeń w obrazie
    const offsetY = isIceGiant ? 15 : 0; // Większe przesunięcie dla większego Ice Gianta
    
    p5.push();
    p5.translate(entity.x, entity.y);
    p5.scale(direction, 1);
    p5.image(
      image,
      -entity.width/2,
      offsetY, // Dodanie przesunięcia dla Ice Gianta
      entity.width,
      entity.height
    );
    p5.pop();
  } else {
    // Fallback - use different colors for player vs enemy based on position (player is usually on the left)
    const isPlayerEntity = entity.x < p5.width / 2; // Simple heuristic: player is usually on the left side
    p5.fill(isPlayerEntity ? p5.color(0, 100, 200) : p5.color(200, 100, 0));
    p5.rect(
      entity.x - entity.width/2,
      entity.y,
      entity.width,
      entity.height
    );
  }
  
  p5.noTint();
  
  // Health bar
  const healthBarWidth = entity.width;
  const healthBarHeight = 6;
  const healthPercent = entity.health / 5;
  
  p5.fill(200, 0, 0);
  p5.rect(
    entity.x - healthBarWidth/2,
    entity.y - healthBarHeight - 5,
    healthBarWidth,
    healthBarHeight
  );
  
  p5.fill(0, 200, 0);
  p5.rect(
    entity.x - healthBarWidth/2,
    entity.y - healthBarHeight - 5,
    healthBarWidth * healthPercent,
    healthBarHeight
  );
};

// Draw all attacks
export const drawAttacks = (
  p5: p5Types, 
  attacks: Attack[], 
  hammerImg: p5Types.Image | null, 
  iceballImg: p5Types.Image | null
) => {
  for (const attack of attacks) {
    if (attack.isPlayerAttack) {
      // Draw player attack (hammer)
      if (hammerImg) {
        p5.push();
        p5.translate(attack.x, attack.y);
        p5.rotate(p5.frameCount * 0.2 * attack.direction); // Spinning hammer
        p5.image(
          hammerImg,
          -attack.width/2,
          -attack.height/2,
          attack.width,
          attack.height
        );
        p5.pop();
      } else {
        p5.fill(200, 200, 0);
        p5.ellipse(attack.x, attack.y, attack.width, attack.height);
      }
    } else {
      // Draw enemy attack (iceball)
      if (iceballImg) {
        p5.image(
          iceballImg,
          attack.x - attack.width/2,
          attack.y - attack.height/2,
          attack.width,
          attack.height
        );
      } else {
        p5.fill(0, 200, 200);
        p5.ellipse(attack.x, attack.y, attack.width, attack.height);
      }
    }
  }
};

// Draw the HUD (heads-up display)
export const drawHUD = (p5: p5Types, playerHealth: number, enemyHealth: number) => {
  p5.fill(255);
  p5.textSize(20);
  p5.textAlign(p5.LEFT, p5.TOP);
  p5.text(`Thor HP: ${playerHealth}/5`, 20, 20);
  p5.textAlign(p5.RIGHT, p5.TOP);
  p5.text(`Giant HP: ${enemyHealth}/5`, p5.width - 20, 20);
};