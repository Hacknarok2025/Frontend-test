import { useCallback, useRef, useEffect, useState } from 'react';
import type p5Types from 'p5';
import Sketch from 'react-p5';
import { motion, AnimatePresence } from "framer-motion";
import Modal3 from "@/commons/Modal3.tsx";

const CELL_SIZE = 40;
const COLS = 20;
const ROWS = 20;
const LIGHT_RADIUS = 150;
const SCORE_MULTIPLIER = 1.5;
const INITIAL_SCORE = 100;
const GRACE_PERIOD = 10;

interface Player {
  x: number;
  y: number;
}

const Level2 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const playerImage = useRef<p5Types.Image | null>(null);
  const hammerImage = useRef<p5Types.Image | null>(null);
  const p5Instance = useRef<p5Types | null>(null);
  const canvasParentRef = useRef<Element | null>(null);
  const lastMoveTime = useRef(0);
  const MOVE_COOLDOWN = 50;
  const [isModalOpen3, setModalOpen3] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [showScore, setShowScore] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVisible && startTime && !endTime) {
      interval = setInterval(() => {
        const timeNow = Date.now();
        const elapsedSeconds = Math.floor((timeNow - startTime) / 1000);
        setCurrentTime(elapsedSeconds);

        if (elapsedSeconds >= GRACE_PERIOD) {
          setShowScore(true);
          const timeAfterGrace = elapsedSeconds - GRACE_PERIOD;
          const newScore = Math.max(0, INITIAL_SCORE - Math.floor(timeAfterGrace * SCORE_MULTIPLIER));
          setScore(newScore);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible, startTime, endTime]);

  useEffect(() => {
    setIsVisible(true);
    const now = Date.now();
    setStartTime(now);
    setScore(INITIAL_SCORE);
    setShowScore(false);
    return () => {
      setIsVisible(false);
      setStartTime(null);
      setEndTime(null);
    };
  }, []);

  // ... (reszta funkcji pozostaje bez zmian: generateMaze, resetGame, setup, draw)

  const checkWinCondition = () => {
    const playerGridX = Math.floor(gameState.current.player.x / CELL_SIZE);
    const playerGridY = Math.floor(gameState.current.player.y / CELL_SIZE);

    if (playerGridX === COLS - 3 && playerGridY === ROWS - 3) {
      const finalTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
      setEndTime(Date.now());
      setCurrentTime(finalTime);

      // Oblicz końcowy wynik
      let finalScore = INITIAL_SCORE;
      if (finalTime > GRACE_PERIOD) {
        const timeAfterGrace = finalTime - GRACE_PERIOD;
        finalScore = Math.max(0, INITIAL_SCORE - Math.floor(timeAfterGrace * SCORE_MULTIPLIER));
      }
      setScore(finalScore);
      setModalOpen3(true);
    }
  };

  // ... (keyPressed pozostaje bez zmian)

  return (
      <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 overflow-hidden bg-black"
            >
              <div className="absolute inset-0">
                <img src="/imgs/level2.webp" className="object-cover w-full h-full" />
              </div>
              <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center flex-col"
              >
                <div className="text-4xl m-5 bg-[#ffffff] px-6 py-3 transition-all duration-500 transform hover:scale-110 skew-x-12">
                  Time: {currentTime}s
                </div>

                {showScore && (
                    <div className="text-4xl m-5 bg-[#ff0000] px-6 py-3 transition-all duration-500 transform hover:scale-110 skew-x-12">
                      Score: {score}
                    </div>
                )}

                {currentTime < GRACE_PERIOD && (
                    <div className="text-2xl text-white mt-2">
                      Grace period: {GRACE_PERIOD - currentTime}s remaining
                    </div>
                )}

                <Sketch
                    setup={setup as any}
                    draw={draw as any}
                    keyPressed={keyPressed as any}
                />
              </motion.div>
            </motion.div>
        )}

        <Modal3
            open={isModalOpen3}
            onClose={() => setModalOpen3(false)}
        >
          <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center"
          >
            <h1 className="text-3xl mb-6 font-bold">Good Job Warrior You Win!!!!</h1>
            <h2 className="text-3xl mb-3 font-bold">Time: {currentTime} seconds</h2>
            <h2 className="text-3xl mb-6 font-bold">Your Score: {score}</h2>

            {currentTime <= GRACE_PERIOD ? (
                <p className="text-xl text-green-500">Perfect time! Full points!</p>
            ) : (
                <p className="text-xl">
                  (Score: {INITIAL_SCORE} - {currentTime - GRACE_PERIOD}s × {SCORE_MULTIPLIER} = {score})
                </p>
            )}
          </motion.div>
        </Modal3>
      </AnimatePresence>
  );
};

export default Level2;