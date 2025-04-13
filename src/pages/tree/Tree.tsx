import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LevelCircle from './components/level-circle/LevelCircle';
import { useUser } from '@/context/useUser';

const Tree = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useUser();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [imageLoaded]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* User info display */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50"
          >
            <h2 className="text-2xl font-bold mb-1 norse">
              {user?.name || 'Warrior'}
            </h2>
            <p className="text-xl norse">Score: {user?.score || 0}</p>
          </motion.div>

          <motion.img
            src="/imgs/tree-bg.png"
            alt="Tree Background"
            className="w-full"
            onLoad={handleImageLoad}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => {
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
              <motion.div
                key={l}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.5 + l * 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 10,
                }}
                style={{
                  position: 'absolute',
                  top: positions[l].top,
                  left: positions[l].left,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <LevelCircle
                  level={l}
                  disabled={l !== user?.current_level}
                  top={positions[l].top}
                  left={positions[l].left}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tree;
