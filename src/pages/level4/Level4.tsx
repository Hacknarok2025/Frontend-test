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
  const [isVisible, setIsVisible] = useState(false);

  const ITEM_LIFETIME = 4000;
  const MOVEMENT_SPEED = 3;
  const MAX_ITEMS = 4;

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

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
      setScore((prev) => Math.max(0, prev - 2));
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

  useEffect(() => {
    if (!gameActive) return;

    const updateInterval = setInterval(() => {
      setGameItems((prevItems) => {
        const now = Date.now();
        const updatedItems = prevItems
            .filter((item) => now - item.createdAt < ITEM_LIFETIME)
            .map((item) => {
              let newX = item.x + item.dx;
              let newY = item.y + item.dy;
              let newDx = item.dx;
              let newDy = item.dy;

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

        while (updatedItems.length < MAX_ITEMS && Math.random() > 0.7) {
          updatedItems.push(createNewItem());
        }

        return updatedItems;
      });
    }, 16);

    return () => clearInterval(updateInterval);
  }, [gameActive, createNewItem]);

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
      <AnimatePresence>
        {isVisible && (
            <motion.div

                transition={{ duration: 0.5 }}
                className="fixed inset-0 overflow-hidden cursor-crosshair"
                onClick={handleBackgroundClick}
                style={{
                  backgroundImage: "url('/imgs/level4.webp')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
            >
              <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col items-start max-w-50 ml-10 mt-15 bg-[#000000] text-white px-6 py-3 skew-x-12"
              >
                <h2 className="text-4xl mb-2 norse">Catch Mjölnir</h2>
                <p className="text-2xl norse">Score: {score}</p>
                <p className="text-2xl norse">Misses: {misses}</p>
                <p className="text-2xl norse">Time: {timeLeft}</p>
              </motion.div>

              {!gameActive && !isModalOpen && (
                  <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                  >
                    <Button
                        onClick={startGame}
                        add="px-8 py-4 text-4xl hover:bg-white hover:text-black border-2 border-solid border-black text-white"
                    >
                      Start Game
                    </Button>
                  </motion.div>
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
                            onMouseDown={(e) => handleItemMouseDown(item, e)}
                            onMouseUp={() => handleItemMouseUp(item)}
                            onMouseLeave={() => handleItemMouseUp(item)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                        >
                          <img
                              src={
                                item.type === 'hammer'
                                    ? '/imgs/hammer.png'
                                    : '/imgs/apple.png'
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
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="text-center"
                >
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
                </motion.div>
              </Modal3>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

export default Level4;