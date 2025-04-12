import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/own/button';
import { motion, AnimatePresence } from 'framer-motion';
import Modal3 from '@/commons/Modal3';

interface GameItem {
  id: string;
  x: number;
  y: number;
  type: 'hammer' | 'skull';
  dx: number;
  dy: number;
  createdAt: number;
}

const Level4 = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [misses, setMisses] = useState(0);
  const [holdTimer, setHoldTimer] = useState<{
    [key: string]: NodeJS.Timeout | null;
  }>({});

  const ITEM_LIFETIME = 4000; // Items disappear after 4 seconds
  const MOVEMENT_SPEED = 3; // Base speed for items
  const MAX_ITEMS = 4; // Maximum number of items on screen

  const createNewItem = useCallback((): GameItem => {
    const id = Math.random().toString(36).substring(7);
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    const angle = Math.random() * Math.PI * 2;
    const type: 'hammer' | 'skull' = Math.random() > 0.3 ? 'hammer' : 'skull';

    return {
      id,
      x,
      y,
      type,
      dx: Math.cos(angle) * MOVEMENT_SPEED,
      dy: Math.sin(angle) * MOVEMENT_SPEED,
      createdAt: Date.now(),
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setMisses(0);
    setGameItems([createNewItem()]);
  };

  const handleItemClick = (item: GameItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setGameItems((prev) => prev.filter((i) => i.id !== item.id));

    if (item.type === 'hammer') {
      setScore((prev) => prev + 1);
    } else {
      setScore((prev) => Math.max(0, prev - 2)); // Skulls decrease score by 2
    }
  };

  const handleItemMouseDown = (item: GameItem, e: React.MouseEvent) => {
    e.stopPropagation();

    const timer = setTimeout(() => {
      handleItemClick(item, e);
    }, 1);

    setHoldTimer((prev) => ({
      ...prev,
      [item.id]: timer,
    }));
  };

  const handleItemMouseUp = (item: GameItem) => {
    // Clear the timer if mouse is released before timeout
    if (holdTimer[item.id]) {
      clearTimeout(holdTimer[item.id]!);
      setHoldTimer((prev) => ({
        ...prev,
        [item.id]: null,
      }));
    }
  };

  const handleBackgroundClick = () => {
    if (gameActive) {
      setMisses((prev) => prev + 1);
    }
  };

  // Update items positions and manage their lifecycle
  useEffect(() => {
    if (!gameActive) return;

    const updateInterval = setInterval(() => {
      setGameItems((prevItems) => {
        const now = Date.now();

        // Update positions and remove expired items
        const updatedItems = prevItems
          .filter((item) => now - item.createdAt < ITEM_LIFETIME)
          .map((item) => {
            let newX = item.x + item.dx;
            let newY = item.y + item.dy;
            let newDx = item.dx;
            let newDy = item.dy;

            // Bounce off walls
            if (newX <= 0 || newX >= window.innerWidth - 100) {
              newDx = -newDx;
              newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
            }
            if (newY <= 0 || newY >= window.innerHeight - 100) {
              newDy = -newDy;
              newY = Math.max(0, Math.min(window.innerHeight - 100, newY));
            }

            return {
              ...item,
              x: newX,
              y: newY,
              dx: newDx,
              dy: newDy,
            };
          });

        // Add new items if needed
        while (updatedItems.length < MAX_ITEMS && Math.random() > 0.7) {
          updatedItems.push(createNewItem());
        }

        return updatedItems;
      });
    }, 16); // ~60 FPS

    return () => clearInterval(updateInterval);
  }, [gameActive, createNewItem]);

  // Game timer
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setIsModalOpen(true);
    }
  }, [timeLeft, gameActive]);

  return (
    <div
      className="fixed inset-0 overflow-hidden cursor-crosshair"
      onClick={handleBackgroundClick}
      style={{
        backgroundImage: "url('/imgs/level4.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col items-start  m-5 bg-[#000000] text-white  px-6 py-3  skew-x-12">
        <h2 className="text-4xl mb-2 norse">Catch Mjölnir</h2>
        <p className="text-2xl norse">Score: {score}</p>
        <p className="text-2xl norse">Misses: {misses}</p>
        <p className="text-2xl norse">Time: {timeLeft}</p>
      </div>

      {!gameActive && !isModalOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <Button
            onClick={startGame}
            add="px-8 py-4 text-4xl hover:bg-white hover:text-black border-2 border-solid border-black text-white"
          >
            Start Game
          </Button>
        </div>
      )}

      <AnimatePresence>
        {gameActive &&
          gameItems.map((item) => (
            <motion.div
              key={item.id}
              className="absolute w-20 h-20 cursor-pointer"
              style={{
                left: item.x,
                top: item.y,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: 1,
                rotate: 360,
                transition: { duration: 0.3 },
              }}
              exit={{ scale: 0, opacity: 0 }}
              //   onClick={(e) => handleItemClick(item, e)}
              onMouseDown={(e) => handleItemMouseDown(item, e)}
              onMouseUp={() => handleItemMouseUp(item)}
              onMouseLeave={() => handleItemMouseUp(item)}
              whileHover={{ scale: 1.2 }}
            >
              <img
                src={
                  item.type === 'hammer'
                    ? '/imgs/hammer.png'
                    : '/imgs/pobrane.png'
                }
                alt={item.type === 'hammer' ? 'Mjölnir' : 'Skull'}
                className="w-full h-full"
              />
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-red-500"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: ITEM_LIFETIME / 1000, ease: 'linear' }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      <Modal3 open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1 className="text-3xl mb-6 font-bold norse">Game Over, Warrior!</h1>
        <h2 className="text-3xl mb-3 font-bold norse">Final Score: {score}</h2>
        <p className="text-3xl mb-3 font-bold norse">Misses: {misses}</p>
        <p className="text-2xl mb-6 norse">
          {score > 15
            ? 'Odin himself would be proud of your quick reflexes!'
            : score > 10
            ? 'A valiant effort worthy of Valhalla!'
            : 'Keep training, young Viking!'}
        </p>
      </Modal3>
    </div>
  );
};

export default Level4;
