import React from 'react';
import LevelCircle from './components/level-circle/LevelCircle';

const Tree = () => {
  return (
    <div className="relative">
      <img src="/imgs/tree-bg.png" alt="Tree Background" className="w-full" />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => {
        // Przykładowe współrzędne dla poziomów
        const positions: Record<number, { top: string; left: string }> = {
          1: { top: '88%', left: '49%' },
          2: { top: '80%', left: '37%' },
          3: { top: '75%', left: '50%' },
          4: { top: '65%', left: '42%' },
          5: { top: '55%', left: '48%' },
          6: { top: '45%', left: '44%' },
          7: { top: '33%', left: '47%' },
          8: { top: '19%', left: '42%' },
          9: { top: '5%', left: '45%' },
        };

        return (
          <LevelCircle
            key={l}
            level={l}
            top={positions[l].top}
            left={positions[l].left}
            disabled={l > 5}
          />
        );
      })}
    </div>
  );
};

export default Tree;
