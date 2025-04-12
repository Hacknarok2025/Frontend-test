import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from "@/components/own/button.tsx";

type Card = {
    id: number;
    content: string;
    isFlipped: boolean;
    isMatched: boolean;
};

const Level6 = () => {
    const emojiPairs = [
        '⚡',  // Mjölnir
        '🌳',  // Yggdrasil
        '🐺',  // Fenrir
        '🦅',  // Orzeł
        '🐍',  // Jörmungandr
        '🌌'   // Bifröst
    ];
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [darkenBackground, setDarkenBackground] = useState(false);

    const createShuffledCards = () => {
        const pairedEmojis = [...emojiPairs, ...emojiPairs];
        return pairedEmojis
            .map((content, index) => ({
                id: index,
                content,
                isFlipped: true,
                isMatched: false
            }))
            .sort(() => Math.random() - 0.5);
    };

    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = '/imgs/level6.webp';
        img.onload = () => {
            initializeGame();
        };
    }, []);

    const initializeGame = () => {
        setDarkenBackground(true);
        const shuffledCards = createShuffledCards();
        setCards(shuffledCards);
        setFlippedCards([]);
        setMoves(0);
        setGameStarted(false);
        setGamesPlayed(prev => prev + 1);

        setTimeout(() => {
            setCards(prevCards =>
                prevCards.map(card => ({ ...card, isFlipped: false }))
            );
            setGameStarted(true);
            setDarkenBackground(false);
        }, 3000);
    };

    const handleCardClick = (id: number) => {
        if (!gameStarted || flippedCards.length >= 2) return;

        const clickedCard = cards.find(card => card.id === id);
        if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

        const newCards = cards.map(card =>
            card.id === id ? { ...card, isFlipped: true } : card
        );

        setCards(newCards);
        setFlippedCards([...flippedCards, id]);

        if (flippedCards.length === 1) {
            setMoves(prev => prev + 1);
            const firstCardId = flippedCards[0];
            const firstCard = cards.find(card => card.id === firstCardId);
            const secondCard = newCards.find(card => card.id === id);

            if (firstCard?.content === secondCard?.content) {
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === firstCardId || card.id === id
                                ? { ...card, isMatched: true }
                                : card
                        )
                    );
                    setFlippedCards([]);
                }, 500);
            } else {
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === firstCardId || card.id === id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            alert(`Gratulacje! Ukończyłeś grę w ${moves} ruchach!`);
        }
    }, [cards, moves]);

    return (
        <AnimatePresence>
            <motion.div
                className="min-h-screen flex flex-col items-center justify-center p-4 h-[100vh] w-[100vw] bg-cover bg-center"
                style={{ backgroundImage: "url('/imgs/level6.webp')" }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <motion.div
                    className="p-8 rounded-xl"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h1 className="text-8xl font-bold mb-10 text-white drop-shadow-lg">Memory Game</h1>

                    <div className="flex gap-10 mb-10">
                        <h2 className="text-5xl text-white drop-shadow-lg">Ruchy: {moves}</h2>
                        <h2 className="text-5xl text-white drop-shadow-lg">Gry: {gamesPlayed}</h2>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                        {cards.map(card => (
                            <motion.div
                                key={card.id}
                                onClick={() => handleCardClick(card.id)}
                                className={`w-32 h-40 sm:w-40 sm:h-48 flex items-center justify-center text-5xl 
                                cursor-pointer ${card.isMatched ? 'opacity-50 cursor-default' : ''}`}
                                whileHover={!card.isMatched ? { scale: 1.05 } : {}}
                                whileTap={!card.isMatched ? { scale: 0.95 } : {}}
                                animate={{ rotateY: card.isFlipped ? 0 : 180 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className={`w-full h-full rounded-xl flex items-center justify-center
                                ${card.isFlipped ? 'bg-gray-800/90' : 'bg-gray-900'}
                                ${card.isMatched ? 'bg-green-600/70' : ''}
                                shadow-lg border-2 ${card.isFlipped ? 'border-gray-600' : 'border-gray-700'}`}>
                                    <span className={`drop-shadow-lg ${!card.isFlipped ? 'text-white' : ''}`}>
                                        {card.isFlipped ? card.content : '?'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="mt-10 flex gap-4 justify-end">
                        <Button
                            onClick={initializeGame}
                            add={"px-24 py-6 text-5xl hover:bg-white hover:text-black skew-x-[24deg] border-2 border-solid border-black text-white"}
                        >
                            Nowa gra
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Level6;