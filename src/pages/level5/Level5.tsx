import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/own/button';
import Modal3 from '@/commons/Modal3';
import { useUser } from '@/context/UserContext';

// Define rune types and their meanings
type RuneType = 'fehu' | 'uruz' | 'thurisaz' | 'ansuz' | 'raidho' | 'kenaz';

interface Rune {
  id: number;
  type: RuneType;
  symbol: string;
  meaning: string;
  isSelected: boolean;
  isMatched: boolean;
  position: { row: number; col: number };
}

// Constants for game board
const BOARD_SIZE = 8;
const MIN_MATCH_LENGTH = 3;

const Level5 = () => {
  const { user, updateScore, updateLevel } = useUser();

  // Game state
  const [board, setBoard] = useState<Rune[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(60); // 60 seconds game
  const [gameOver, setGameOver] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [highlightedRunes, setHighlightedRunes] = useState<Rune[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [targetScore] = useState(100);
  const [dragStartPosition, setDragStartPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Rune definitions with Norse symbols and meanings
  const runeDefinitions: Record<RuneType, { symbol: string; meaning: string }> =
    {
      fehu: { symbol: 'ᚠ', meaning: 'Wealth' },
      uruz: { symbol: 'ᚢ', meaning: 'Strength' },
      thurisaz: { symbol: 'ᚦ', meaning: 'Protection' },
      ansuz: { symbol: 'ᚨ', meaning: 'Communication' },
      raidho: { symbol: 'ᚱ', meaning: 'Journey' },
      kenaz: { symbol: 'ᚲ', meaning: 'Knowledge' },
    };

  const runeTypes = Object.keys(runeDefinitions) as RuneType[];

  // Initialize game board
  const initializeBoard = useCallback(() => {
    const newBoard: Rune[][] = [];
    let runeId = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      newBoard[row] = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        // Randomly select a rune type
        const randomType =
          runeTypes[Math.floor(Math.random() * runeTypes.length)];
        const { symbol, meaning } = runeDefinitions[randomType];

        newBoard[row][col] = {
          id: runeId++,
          type: randomType,
          symbol,
          meaning,
          isSelected: false,
          isMatched: false,
          position: { row, col },
        };
      }
    }

    // Check for any initial matches and replace them
    let hasInitialMatches = true;
    while (hasInitialMatches) {
      const matches = findAllMatches(newBoard);
      if (matches.length > 0) {
        // Replace matching runes
        for (const match of matches) {
          for (const rune of match) {
            const randomType =
              runeTypes[Math.floor(Math.random() * runeTypes.length)];
            const { symbol, meaning } = runeDefinitions[randomType];

            newBoard[rune.position.row][rune.position.col] = {
              ...newBoard[rune.position.row][rune.position.col],
              type: randomType,
              symbol,
              meaning,
            };
          }
        }
      } else {
        hasInitialMatches = false;
      }
    }

    return newBoard;
  }, []);

  // Find all matches in the board
  const findAllMatches = (currentBoard: Rune[][]) => {
    const matches: Rune[][] = [];

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      let currentMatch: Rune[] = [];
      let currentType: RuneType | null = null;

      for (let col = 0; col < BOARD_SIZE; col++) {
        const rune = currentBoard[row][col];

        if (rune.type === currentType) {
          currentMatch.push(rune);
        } else {
          if (currentMatch.length >= MIN_MATCH_LENGTH) {
            matches.push([...currentMatch]);
          }
          currentMatch = [rune];
          currentType = rune.type;
        }
      }

      if (currentMatch.length >= MIN_MATCH_LENGTH) {
        matches.push([...currentMatch]);
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      let currentMatch: Rune[] = [];
      let currentType: RuneType | null = null;

      for (let row = 0; row < BOARD_SIZE; row++) {
        const rune = currentBoard[row][col];

        if (rune.type === currentType) {
          currentMatch.push(rune);
        } else {
          if (currentMatch.length >= MIN_MATCH_LENGTH) {
            matches.push([...currentMatch]);
          }
          currentMatch = [rune];
          currentType = rune.type;
        }
      }

      if (currentMatch.length >= MIN_MATCH_LENGTH) {
        matches.push([...currentMatch]);
      }
    }

    return matches;
  };

  // Handle drag start
  const handleDragStart = (row: number, col: number) => {
    if (gameOver) return;
    setDragStartPosition({ row, col });
  };

  // Handle drag end
  const handleDragEnd = (row: number, col: number) => {
    if (gameOver || !dragStartPosition) return;

    // Check if the drag ended in an adjacent cell
    const rowDiff = Math.abs(dragStartPosition.row - row);
    const colDiff = Math.abs(dragStartPosition.col - col);

    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      // Valid move to adjacent cell
      const rune1 = board[dragStartPosition.row][dragStartPosition.col];
      const rune2 = board[row][col];
      swapRunes(rune1, rune2);
      setMoves(moves + 1);
    }

    setDragStartPosition(null);
  };

  // Update rune selection state
  const updateRuneSelection = (
    row: number,
    col: number,
    isSelected: boolean
  ) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[row][col] = { ...newBoard[row][col], isSelected };
      return newBoard;
    });
  };

  // Swap two runes and check for matches
  const swapRunes = (rune1: Rune, rune2: Rune) => {
    // Create a new board with swapped positions
    const newBoard = [...board];

    // Temporarily swap positions for checking matches
    const tempRune = { ...newBoard[rune1.position.row][rune1.position.col] };
    newBoard[rune1.position.row][rune1.position.col] = {
      ...newBoard[rune2.position.row][rune2.position.col],
      position: { row: rune1.position.row, col: rune1.position.col },
      isSelected: false,
    };
    newBoard[rune2.position.row][rune2.position.col] = {
      ...tempRune,
      position: { row: rune2.position.row, col: rune2.position.col },
      isSelected: false,
    };

    // Check for matches after swap
    const matches = findAllMatches(newBoard);

    if (matches.length > 0) {
      // Valid move with matches
      setBoard(newBoard);

      // Get all matched runes based on their positions on the board
      const allMatchedRunes = matches.flat().map((matchedRune) => {
        // Make sure we're getting the rune from its current position on the board
        return newBoard[matchedRune.position.row][matchedRune.position.col];
      });

      // Highlight all matched runes in their current positions
      setHighlightedRunes(allMatchedRunes);

      // Process matches after a short delay
      setTimeout(() => {
        processMatches(matches);
      }, 300);
    } else {
      // No matches, swap back
      setTimeout(() => {
        setBoard((prevBoard) => {
          const revertedBoard = [...prevBoard];
          revertedBoard[rune1.position.row][rune1.position.col].isSelected =
            false;
          revertedBoard[rune2.position.row][rune2.position.col].isSelected =
            false;
          return revertedBoard;
        });
      }, 500);
    }
  };

  // Process matched runes
  const processMatches = (matches: Rune[][]) => {
    // Highlight matched runes
    const allMatchedRunes = matches.flat();
    setHighlightedRunes(allMatchedRunes);

    // Calculate score based on matches - reduced points per rune (3 points instead of 10)
    const matchScore = matches.reduce((total, match) => {
      // Award 3 points per rune instead of 10
      return total + match.length * 3;
    }, 0);

    setScore((prevScore) => {
      // Calculate new score (allow reaching exactly 100)
      const newScore = prevScore + matchScore;

      // Check for win condition
      if (newScore >= targetScore && !gameWon) {
        setGameWon(true);
        setGameOver(true);
        setTimeout(() => setIsModalOpen(true), 1000);
        return targetScore; // Return exactly target score
      }
      return newScore;
    });

    // After a delay, remove matched runes and drop new ones
    setTimeout(() => {
      setHighlightedRunes([]);
      removeMatchedRunes(matches);
    }, 500);
  };

  // Remove matched runes and drop new ones
  const removeMatchedRunes = (matches: Rune[][]) => {
    const newBoard = [...board];
    const allMatchedRunes = matches.flat();

    // Mark matched positions
    allMatchedRunes.forEach((rune) => {
      newBoard[rune.position.row][rune.position.col].isMatched = true;
    });

    // Drop runes from above and generate new ones at the top
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0;

      // Count how many tiles were matched in this column
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (newBoard[row][col].isMatched) {
          emptySpaces++;
        }
      }

      if (emptySpaces === 0) continue; // Skip if no matches in this column

      // Move existing tiles down
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col].isMatched) {
          // Find the next non-matched tile above
          let sourceRow = row - 1;
          while (sourceRow >= 0 && newBoard[sourceRow][col].isMatched) {
            sourceRow--;
          }

          if (sourceRow >= 0) {
            // Move the tile down
            newBoard[row][col] = {
              ...newBoard[sourceRow][col],
              position: { row, col },
            };
            // Mark the original position as matched (empty)
            newBoard[sourceRow][col].isMatched = true;
          }
        }
      }

      // Fill top with new runes
      for (let row = 0; row < BOARD_SIZE; row++) {
        if (newBoard[row][col].isMatched) {
          const randomType =
            runeTypes[Math.floor(Math.random() * runeTypes.length)];
          const { symbol, meaning } = runeDefinitions[randomType];

          newBoard[row][col] = {
            id: Date.now() + Math.random(), // Generate unique ID
            type: randomType,
            symbol,
            meaning,
            isSelected: false,
            isMatched: false,
            position: { row, col },
          };
        }
      }
    }

    setBoard(newBoard);

    // Check for cascade matches
    const cascadeMatches = findAllMatches(newBoard);
    if (cascadeMatches.length > 0) {
      setTimeout(() => {
        processMatches(cascadeMatches);
      }, 500);
    }
  };

  // Start the game
  const startGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setMoves(0);
    setTime(45);
    setGameOver(false);
    setGameStarted(true);
    setGameWon(false);
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          if (!gameWon) {
            setTimeout(() => setIsModalOpen(true), 1000);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, gameWon]);

  // Check win condition
  useEffect(() => {
    if (score >= targetScore && !gameWon) {
      setGameWon(true);
      setGameStarted(false);
      setIsModalOpen(true);
      // Update global score and level
      updateScore(user?.score ? user.score + score : score);
      updateLevel(6);
    }
  }, [score, targetScore, gameWon]);

  // Initialize game board on component mount
  useEffect(() => {
    setBoard(initializeBoard());
    setGameStarted(true);
  }, [initializeBoard]);

  // Calculate time display
  const timeDisplay = `${Math.floor(time / 60)}:${
    Math.floor(time % 60) < 10 ? '0' : ''
  }${time % 60}`;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-2 overflow-hidden"
      style={{
        backgroundImage: "url('/imgs/level5.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Force full height
        width: '100vw', // Force full width
        position: 'fixed', // Prevent scrolling
        top: 0,
        left: 0,
      }}
    >
      <div className="bg-black/60 p-3 rounded-lg shadow-2xl w-full max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'Norse, serif' }}
          >
            Runes of the Future
          </h1>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-black/70 p-1 rounded text-white text-sm">
              <span>Time: {timeDisplay}</span>
            </div>
            <div className="bg-black/70 p-1 rounded text-white text-sm">
              <span>
                Score: {score}/{targetScore}
              </span>
            </div>
            <div className="bg-black/70 p-1 rounded text-white text-sm">
              <span>Moves: {moves}</span>
            </div>
          </div>
        </div>

        <div className="mb-2 bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }}
          ></div>
        </div>

        <div className="text-center mb-2 text-white text-xs">
          <p>
            Match 3+ identical runes to reveal Vanir wisdom. Reach {targetScore}{' '}
            points to win!
          </p>
        </div>

        <div
          className="grid grid-cols-8 gap-0.5 bg-black/70 p-1.5 rounded-lg mx-auto"
          ref={boardRef}
          style={{
            maxWidth: 'min(100%, 70vh)',
            width: '100%',
            aspectRatio: '1/1',
          }}
        >
          {board.flat().map((rune) => (
            <motion.div
              key={rune.id}
              className={`aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing rounded-sm ${
                rune.isSelected
                  ? 'bg-blue-600'
                  : highlightedRunes.some((r) => r.id === rune.id)
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              } hover:bg-gray-600 transition-colors`}
              whileHover={{ scale: 1.05 }}
              animate={{
                scale: highlightedRunes.some((r) => r.id === rune.id)
                  ? [1, 1.2, 1]
                  : 1,
              }}
              transition={{ duration: 0.2 }}
              onMouseDown={() =>
                handleDragStart(rune.position.row, rune.position.col)
              }
              onMouseUp={() =>
                handleDragEnd(rune.position.row, rune.position.col)
              }
              onMouseEnter={() => {
                if (dragStartPosition && !gameOver) {
                  // If we're dragging, consider this a potential drop target
                  const rowDiff = Math.abs(
                    dragStartPosition.row - rune.position.row
                  );
                  const colDiff = Math.abs(
                    dragStartPosition.col - rune.position.col
                  );

                  if (
                    (rowDiff === 1 && colDiff === 0) ||
                    (rowDiff === 0 && colDiff === 1)
                  ) {
                    updateRuneSelection(
                      rune.position.row,
                      rune.position.col,
                      true
                    );
                  }
                }
              }}
              onMouseLeave={() => {
                if (dragStartPosition && !gameOver) {
                  updateRuneSelection(
                    rune.position.row,
                    rune.position.col,
                    false
                  );
                }
              }}
            >
              <span
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white select-none"
                style={{ fontFamily: 'Norse, serif' }}
              >
                {rune.symbol}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-2 flex justify-end">
          <Button
            onClick={startGame}
            add="px-3 py-1 text-base hover:bg-white hover:text-black border-2 border-solid border-white text-white"
          >
            New Game
          </Button>
        </div>
      </div>

      <Modal3 open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1
          className="text-3xl mb-6 font-bold"
          style={{ fontFamily: 'Norse, serif' }}
        >
          {gameWon ? 'Great Job!' : 'Game Over!'}
        </h1>
        <h2 className="text-2xl mb-3 font-bold">Your score: {score}</h2>
        <p className="text-xl mb-6">
          {gameWon
            ? 'You have successfully uncovered the ancient knowledge of the Vanir! The runes have revealed their power!'
            : 'You failed to uncover all the secrets of the runes. Try again!'}
        </p>

        <div className="flex justify-center">
          <Button
            onClick={() => {
              setIsModalOpen(false);
              startGame();
            }}
            add="px-6 py-2 text-lg hover:bg-white hover:text-black border-2 border-solid border-white text-white"
          >
            {gameWon ? 'Play Again' : 'Try Again'}
          </Button>
        </div>
      </Modal3>
    </div>
  );
};

export default Level5;
