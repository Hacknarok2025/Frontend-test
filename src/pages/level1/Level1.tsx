import { useState, useEffect, useRef } from 'react';
import Button from '../../components/own/button';
import Modal3 from '@/commons/Modal3.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';

const Level1 = () => {
  const { user, updateScore, updateLevel } = useUser();

  const wordPool = [
    'HUGIN',
    'ODIN',
    'THOR',
    'LOKI',
    'FREYA',
    'MJOLNIR',
    'ASGARD',
    'BIFROST',
    'YGGDRASIL',
    'RAGNAROK',
    'VALHALLA',
    'VIKING',
    'JOTUNHEIM',
    'MIDGARD',
    'FENRIR',
    'SLEIPNIR',
    'NIFLHEIM',
    'HEIMDALL',
    'VALKYRIE',
    'SEIDR',
  ];

  const [userAnswer, setUserAnswer] = useState('');

  const [completed, setCompleted] = useState(false);
  const [secretWord, setSecretWord] = useState('');
  const [runeWord, setRuneWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isModalOpen3, setModalOpen3] = useState(false);
  const [isModalOpen4, setModalOpen4] = useState(false);
  const [timeWhenCompleted, setTimeWhenCompleted] = useState<number>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateScore = (remainingTime: number) => {
    return Math.round(Math.min(155 - (30 - remainingTime) * 5.166, 100));
  };

  const runeMapping: Record<string, string> = {
    A: 'ᚨ',
    B: 'ᛒ',
    C: 'ᚲ',
    D: 'ᛞ',
    E: 'ᛖ',
    F: 'ᚠ',
    G: 'ᚷ',
    H: 'ᚺ',
    I: 'ᛁ',
    J: 'ᛃ',
    K: 'ᚲ',
    L: 'ᛚ',
    M: 'ᛗ',
    N: 'ᚾ',
    O: 'ᛟ',
    P: 'ᛈ',
    Q: 'ᚲᚹ',
    R: 'ᚱ',
    S: 'ᛊ',
    T: 'ᛏ',
    U: 'ᚢ',
    V: 'ᚹ',
    W: 'ᚹ',
    X: 'ᚲᛊ',
    Y: 'ᚤ',
    Z: 'ᛉ',
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    const selectedWord = wordPool[randomIndex];
    setSecretWord(selectedWord);

    const runicVersion = selectedWord
      .split('')
      .map((char) => runeMapping[char] || char)
      .join('');
    setRuneWord(runicVersion);
  }, [wordPool, runeMapping]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      setModalOpen4(true);
      return;
    }

    if (gameOver || completed) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, completed, gameOver]);

  useEffect(() => {
    if (completed) {
      setTimeWhenCompleted(timeLeft);
      setFinalScore(calculateScore(timeLeft));
      setShowConfetti(true);
      setTimeout(() => setModalOpen3(true), 1500);
    }
  }, [completed, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const [shake, setShake] = useState(false);

  const checkAnswer = () => {
    if (userAnswer.toUpperCase() === secretWord) {
      setModalOpen3(true);
      setCompleted(true);
      const newScore = (timeWhenCompleted || 60) * 10;
      updateScore(user?.score ? user.score + newScore : newScore);
      updateLevel(2); // Move to next level
    } else {
      setModalOpen4(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const resetGame = () => {
    setUserAnswer('');
    setCompleted(false);
    setGameOver(false);
    setTimeLeft(30);
    setTimeWhenCompleted(null);
    setFinalScore(0);
    setShowConfetti(false);

    const randomIndex = Math.floor(Math.random() * wordPool.length);
    const selectedWord = wordPool[randomIndex];
    setSecretWord(selectedWord);

    const runicVersion = selectedWord
      .split('')
      .map((char) => runeMapping[char] || char)
      .join('');
    setRuneWord(runicVersion);
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const runeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: {
        duration: 0.5,
      },
    },
    normal: {
      x: 0,
    },
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: "url('/imgs/level1.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {showConfetti && (
        <div className="confetti absolute inset-0 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="px-20 py-2 skew-x-[-12deg] bg-white bg-opacity-80 shadow-xl max-w-5xl w-full max-h-[85vh] overflow-hidden">
        <motion.h1
          className="text-4xl font-bold mb-1 text-center"
          style={{ fontFamily: 'Norse, serif' }}
          variants={itemVariants}
        >
          Nordic Puzzle
        </motion.h1>

        <motion.div className="mb-1 text-center" variants={itemVariants}>
          <motion.div
            className="text-4xl font-bold text-red-600"
            animate={shake ? 'shake' : 'normal'}
            variants={shakeVariants}
          >
            Time remaining: {timeLeft} seconds
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-2 skew-x-[-12deg] text-center bg-black text-white p-3"
          variants={itemVariants}
        >
          <p className="text-2xl mb-2">
            Discover the hidden word by deciphering these runes:
          </p>
          <motion.div
            className="text-6xl skew-x-12 my-2 tracking-wider flex justify-center"
            style={{ fontFamily: 'Norse, serif' }}
          >
            {runeWord.split('').map((rune, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={runeVariants}
                initial="hidden"
                animate="visible"
              >
                {rune}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="p-1 flex-grow flex flex-col"
          variants={itemVariants}
        >
          <h2 className="text-7xl mb-2 text-center pt-1">Runic Alphabet</h2>
          <div className="grid grid-cols-7 gap-2 text-3xl px-2 pb-2">
            {Object.entries(runeMapping).map(([letter, rune], index) => (
              <motion.div
                key={letter}
                className="text-center p-1 border border-gray-300 rounded"
                variants={itemVariants}
                custom={index}
              >
                <div className="text-4xl">{rune}</div>
                <div className="text-3xl">{letter}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center m-3"
          variants={itemVariants}
        >
          <div className="flex items-center w-full">
            <input
              type="text"
              value={userAnswer}
              onChange={handleInputChange}
              className="flex-grow text-5xl skew-x-[-12deg] px-3 py-1 border-2 border-gray-400 mr-2"
              placeholder="Enter your answer..."
            />
            <Button
              onClick={checkAnswer}
              add="skew-x-[-12deg] text-white text-5xl py-1"
            >
              Check
            </Button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen3 && (
          <Modal3 open={isModalOpen3} onClose={() => setModalOpen3(false)}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h1 className="text-3xl mb-6 font-bold">
                Good Job Warrior You Win!!!!
              </h1>
              <h2 className="text-3xl mb-3 font-bold">
                Your Score: {finalScore}
              </h2>
              <p className="text-3xl mb-3 font-bold">
                Time remaining: {timeWhenCompleted} seconds
              </p>
            </motion.div>
          </Modal3>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen4 && (
          <Modal3
            onClick={() => {
              resetGame();
              setModalOpen4(false);
            }}
            buttonText={'Again'}
            open={isModalOpen4}
            onClose={() => setModalOpen4(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h1 className="text-3xl mb-6 font-bold">Try Again!!</h1>
            </motion.div>
          </Modal3>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          position: absolute;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Level1;
