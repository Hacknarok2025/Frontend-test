import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';

const Level9 = () => {
  const { user, updateScore, updateLevel } = useUser();
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // This is the final level, so when completed we'll set a high score
    const finalScore = 100; // Perfect score for completing all levels
    setScore(finalScore);
    // Update global score
    updateScore(user?.score ? user.score + finalScore : finalScore);
    // No need to update level since this is the final level
    return () => setIsVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center p-4"
          style={{
            backgroundImage: "url('/imgs/level9.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/80 p-8 rounded-lg max-w-2xl text-white text-center"
          >
            <h1 className="text-6xl mb-6 norse">Congratulations Warrior!</h1>
            <p className="text-3xl mb-4 norse">
              You have completed all levels of Yggdrasil Quest!
            </p>
            <p className="text-2xl mb-4 norse">
              Final Score: {user?.score || 0}
            </p>
            <p className="text-xl norse">
              You have proven yourself worthy of Valhalla!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Level9;
