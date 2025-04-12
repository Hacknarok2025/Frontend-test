import { useState, useEffect } from 'react';
import Button from '../../components/own/button';

//TODO zmienić wielkość okienka wokół liter - za duże, zmienić kolor wokół na czarny?
const Level1 = () => {
    // Pool of Nordic-themed words to randomly select from
    const wordPool = [
        'HUGIN', 'ODIN', 'THOR', 'LOKI', 'FREYA', 
        'MJOLNIR', 'ASGARD', 'BIFROST', 'YGGDRASIL', 
        'RAGNAROK', 'VALHALLA', 'VIKING', 'JOTUNHEIM',
        'MIDGARD', 'FENRIR', 'SLEIPNIR', 'NIFLHEIM',
        'HEIMDALL', 'VALKYRIE', 'SEIDR'
    ];

    const [userAnswer, setUserAnswer] = useState('');
    const [message, setMessage] = useState('');
    const [completed, setCompleted] = useState(false);
    const [secretWord, setSecretWord] = useState('');
    const [runeWord, setRuneWord] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    
    // Mapping of Latin letters to runes (simplified Elder Futhark representation)
    const runeMapping: Record<string, string> = {
        'A': 'ᚨ', 'B': 'ᛒ', 'C': 'ᚲ', 'D': 'ᛞ', 'E': 'ᛖ', 'F': 'ᚠ', 
        'G': 'ᚷ', 'H': 'ᚺ', 'I': 'ᛁ', 'J': 'ᛃ', 'K': 'ᚲ', 'L': 'ᛚ', 
        'M': 'ᛗ', 'N': 'ᚾ', 'O': 'ᛟ', 'P': 'ᛈ', 'Q': 'ᚲᚹ', 'R': 'ᚱ', 
        'S': 'ᛊ', 'T': 'ᛏ', 'U': 'ᚢ', 'V': 'ᚹ', 'W': 'ᚹ', 'X': 'ᚲᛊ', 
        'Y': 'ᚤ', 'Z': 'ᛉ'
    };

    // Select a random word from the pool when component mounts
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * wordPool.length);
        const selectedWord = wordPool[randomIndex];
        setSecretWord(selectedWord);
        
        // Convert the secret word to runes
        const runicVersion = selectedWord.split('').map(char => runeMapping[char] || char).join('');
        setRuneWord(runicVersion);
    }, []);

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            setGameOver(true);
            setMessage('Time is up! You failed to solve the puzzle.');
            return;
        }

        if (completed || gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, completed, gameOver]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserAnswer(e.target.value);
    };

    const checkAnswer = () => {
        if (userAnswer.toUpperCase() === secretWord) {
            setCompleted(true);
            setMessage('Correct! You deciphered the word!');
        } else {
            setMessage('Try again. That is not the correct word.');
        }
    };

    const resetGame = () => {
        // Reset the game state
        setUserAnswer('');
        setMessage('');
        setCompleted(false);
        setGameOver(false);
        setTimeLeft(30);
        
        // Select a new random word
        const randomIndex = Math.floor(Math.random() * wordPool.length);
        const selectedWord = wordPool[randomIndex];
        setSecretWord(selectedWord);
        
        // Convert the secret word to runes
        const runicVersion = selectedWord.split('').map(char => runeMapping[char] || char).join('');
        setRuneWord(runicVersion);
    };

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden" style={{
            backgroundImage: "url('/imgs/level1.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="bg-white bg-opacity-80 p-4 md:p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4 h-[90vh] flex flex-col">
                <h1 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: 'Norse, serif' }}>
                    Nordic Puzzle
                </h1>
                
                <div className="mb-2 text-center">
                    <div className="text-xl font-bold text-red-600">
                        Time remaining: {timeLeft} seconds
                    </div>
                </div>
                
                <div className="mb-2 text-center bg-black text-white p-3 rounded-lg">
                    <p className="text-base mb-2">Discover the hidden word by deciphering these runes:</p>
                    <div className="text-4xl my-2 tracking-wider" style={{ fontFamily: 'Norse, serif' }}>
                        {runeWord}
                    </div>
                </div>

                <div className="mb-3 border-2 border-gray-300 rounded-lg flex-grow overflow-auto flex flex-col">
                    <h2 className="text-xl mb-1 text-center pt-1">Runic Alphabet</h2>
                    <div className="grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-13 text-sm px-2 pb-2">
                        {Object.entries(runeMapping).map(([letter, rune]) => (
                            <div key={letter} className="text-center p-1 border border-gray-300 rounded">
                                <div className="text-lg">{rune}</div>
                                <div className="text-xs">{letter}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {!completed && !gameOver ? (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center w-full max-w-md">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={handleInputChange}
                                className="flex-grow px-3 py-1 border-2 border-gray-400 rounded mr-2"
                                placeholder="Enter your answer..."
                            />
                            <Button onClick={checkAnswer} add="bg-blue-700 text-white hover:bg-blue-800 text-sm py-1">
                                Check
                            </Button>
                        </div>
                        {message && (
                            <p className={`mt-1 text-sm ${message.includes('Correct') ? 'text-green-600' : 'text-red-600'}`}>
                                {message}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center mb-2">
                        {completed ? (
                            <>
                                <p className="text-xl text-green-600 mb-2">Congratulations! You solved the puzzle!</p>
                                <p className="text-lg mb-2">Word: {secretWord}</p>
                            </>
                        ) : (
                            <p className="text-xl text-red-600 mb-2">{message}</p>
                        )}
                        <Button onClick={resetGame} add="bg-green-600 text-white hover:bg-green-700 text-sm py-1">
                            Play again
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Level1;