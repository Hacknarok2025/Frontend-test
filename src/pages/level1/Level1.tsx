import { useState, useEffect, useRef } from 'react';
import Button from '../../components/own/button';
import Modal3 from "@/commons/Modal3.tsx";

const Level1 = () => {
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
  const [finalScore, setFinalScore] = useState<number>(0); // Dodany stan dla wyniku
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
  }, []);

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
      setFinalScore(calculateScore(timeLeft)); // Oblicz i zapisz wynik tylko raz
      setModalOpen3(true);
    }
  }, [completed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const checkAnswer = () => {
    if (userAnswer.toUpperCase() === secretWord) {
      setCompleted(true);
    }
  };

  const resetGame = () => {
    setUserAnswer('');
    setCompleted(false);
    setGameOver(false);
    setTimeLeft(30);
    setTimeWhenCompleted(null);
    setFinalScore(0); // Resetuj wynik

    const randomIndex = Math.floor(Math.random() * wordPool.length);
    const selectedWord = wordPool[randomIndex];
    setSecretWord(selectedWord);

    const runicVersion = selectedWord
        .split('')
        .map((char) => runeMapping[char] || char)
        .join('');
    setRuneWord(runicVersion);
  };

  return (
      <div
          className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('/imgs/level1.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
      >
        <div className="px-36 py-3 skew-x-[-12deg] bg-white bg-opacity-80 shadow-xl max-w-7xl w-full max-h-[95vh]">
          <div className="skew-x-12 flex flex-col">
            <h1
                className="text-5xl font-bold mb-2 text-center"
                style={{ fontFamily: 'Norse, serif' }}
            >
              Nordic Puzzle
            </h1>

            <div className="mb-2 text-center">
              <div className="text-6xl font-bold text-red-600">
                Time remaining: {timeLeft} seconds
              </div>
            </div>

            <div className="mb-2 skew-x-[-12deg] text-center bg-black text-white p-3">
              <p className="text-base mb-2">
                Discover the hidden word by deciphering these runes:
              </p>
              <div
                  className="text-6xl skew-x-12 my-2 tracking-wider"
                  style={{ fontFamily: 'Norse, serif' }}
              >
                {runeWord}
              </div>
            </div>

            <div className="p-1 flex-grow flex flex-col">
              <h2 className="text-7xl mb-2 text-center pt-1">Runic Alphabet</h2>
              <div className="grid grid-cols-7 gap-2 text-3xl px-2 pb-2">
                {Object.entries(runeMapping).map(([letter, rune]) => (
                    <div
                        key={letter}
                        className="text-center p-1 border border-gray-300 rounded"
                    >
                      <div className="text-4xl">{rune}</div>
                      <div className="text-3xl">{letter}</div>
                    </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center m-3">
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
            </div>
          </div>
        </div>

        <Modal3
            open={isModalOpen3}
            onClose={() => setModalOpen3(false)}
        >
          <h1 className="text-3xl mb-6 font-bold">Good Job Warrior You Win!!!!</h1>
          <h2 className="text-3xl mb-3 font-bold">Your Score: {finalScore}</h2>
          <p className="text-3xl mb-3 font-bold">Time remaining: {timeWhenCompleted} seconds</p>
        </Modal3>

        <Modal3
            onClick={() => {resetGame() ;setModalOpen4(false)} }
            buttonText={"Again"}
            open={isModalOpen4}
            onClose={() => setModalOpen4(false)}
        >
          <h1 className="text-3xl mb-6 font-bold">Try Again!!</h1>
        </Modal3>
      </div>
  );
};

export default Level1;