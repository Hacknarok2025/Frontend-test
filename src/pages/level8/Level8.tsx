import { useState, useEffect } from 'react';
import Button from '@/components/own/button';

// Define the question type
interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
}

// Question pool - moved outside the component
const questionPool: Question[] = [
  {
    id: 1,
    question: "Who is the chief god in Norse mythology?",
    answers: ["Thor", "Loki", "Odin", "Baldur"],
    correctAnswer: 2,
    explanation: "Odin is the highest god in Norse mythology, called the All-Father."
  },
  {
    id: 2,
    question: "What is the name of the great ash tree that connects the nine worlds in Norse mythology?",
    answers: ["Mjolnir", "Bifrost", "Yggdrasil", "Valhalla"],
    correctAnswer: 2,
    explanation: "Yggdrasil is the enormous ash tree that connects the nine worlds in Norse cosmology."
  },
  {
    id: 3,
    question: "Who is the god of thunder in Norse mythology?",
    answers: ["Thor", "Loki", "Baldur", "Freya"],
    correctAnswer: 0,
    explanation: "Thor is the god of thunder, who wields the hammer Mjolnir."
  },
  {
    id: 4,
    question: "What is Ragnarok?",
    answers: ["Harvest festival", "Norse feast", "End of the world", "Meeting place of gods"],
    correctAnswer: 2,
    explanation: "Ragnarok in Norse mythology is a series of events that lead to the end of the world."
  },
  {
    id: 5,
    question: "What is the name of the realm of the dead ruled by goddess Hel?",
    answers: ["Asgard", "Niflheim", "Valhalla", "Helheim"],
    correctAnswer: 3,
    explanation: "Helheim is the realm of the dead ruled by the goddess Hel, daughter of Loki."
  },
  {
    id: 6,
    question: "Which creature wraps around Midgard (Earth)?",
    answers: ["Fenrir", "Jormungandr", "Sleipnir", "Hugin"],
    correctAnswer: 1,
    explanation: "Jormungandr, also known as the Midgard Serpent, is the giant serpent that encircles Earth."
  },
  {
    id: 7,
    question: "Which animals accompany Odin?",
    answers: ["Two ravens and two wolves", "Two ravens and two horses", "Two wolves and two eagles", "Two eagles and two lions"],
    correctAnswer: 0,
    explanation: "Odin is accompanied by two ravens - Hugin and Munin, and two wolves - Geri and Freki."
  },
  {
    id: 8,
    question: "Who is Loki's father?",
    answers: ["Odin", "Thor", "Farbauti", "Bor"],
    correctAnswer: 2,
    explanation: "Loki is the son of the giant Farbauti and the giantess Laufey."
  }
];

const Level8 = () => {
  // State for randomly selected questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);

  // Select random questions on component mount
  useEffect(() => {
    // Shuffle and pick 5 random questions
    const shuffledQuestions = [...questionPool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    setQuestions(selectedQuestions);
  }, []);

  // Reset timer when moving to a new question
  useEffect(() => {
    if (quizCompleted || showExplanation || showFinalScore || questions.length === 0) return;
    
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleAnswer(-1); // Time's up, handle as wrong answer
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [currentQuestionIndex, quizCompleted, showExplanation, questions]);

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswer(answerIndex);
    
    // Check if the answer is correct
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    
    setShowResult(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimer(30); // Reset timer for new question
    } else {
      setQuizCompleted(true);
      setShowFinalScore(true);
    }
  };

  const restartQuiz = () => {
    // Shuffle and pick new random questions
    const shuffledQuestions = [...questionPool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    setQuestions(selectedQuestions);
    
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setTimer(30);
    setShowExplanation(false);
    setShowFinalScore(false);
  };

  // Check if questions are loaded
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#18181b] text-white flex flex-col items-center justify-center">
        <p className="text-xl norse">Loading quiz...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#18181b] text-white flex flex-col items-center justify-center py-8 px-4 md:px-0 relative">
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/imgs/tree-bg.png')" }}
      ></div>
      
      <div className="relative z-10 w-full max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold mb-2 norse">
            Norse Mythology
          </h1>
          <p className="text-lg norse">Level 8: Norse Mythology Quiz</p>
        </div>

        {!quizCompleted ? (
          <div className="bg-[#27272a] p-6 rounded-lg shadow-xl border border-[#3f3f46]">
            <div className="flex justify-between mb-3">
              <span className="text-lg norse">Question {currentQuestionIndex + 1}/{questions.length}</span>
              <span className="text-lg norse">Score: {score}/{questions.length}</span>
            </div>
            
            <div className="mb-3 w-full bg-[#3f3f46] h-2 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${(timer / 30) * 100}%`, backgroundColor: timer < 10 ? '#ef4444' : '#3b82f6' }}
              ></div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 norse">{currentQuestion.question}</h2>
            <div className="space-y-2 mb-3">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-3 text-left rounded-lg transition-all duration-300 transform hover:scale-[1.01] border norse text-lg ${
                    selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-500/20"
                        : "border-red-500 bg-red-500/20"
                      : selectedAnswer !== null && index === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-500/20"
                      : "border-[#3f3f46] bg-[#3f3f46]/40 hover:bg-[#3f3f46]"
                  }`}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span> {answer}
                </button>
              ))}
            </div>
            
            <div className={`transition-all duration-300 overflow-hidden ${showExplanation ? 'max-h-28' : 'max-h-0'}`}>
              {showExplanation && (
                <div className="mb-2 p-2 bg-[#3f3f46]/50 rounded-lg">
                  <p className="norse text-base"><span className="font-bold">Explanation:</span> {currentQuestion.explanation}</p>
                </div>
              )}
            </div>
            
            <div className={`transition-opacity duration-300 ${showResult ? 'opacity-100' : 'opacity-0 h-0'}`}>
              {showResult && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleNextQuestion} 
                    add="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 text-sm norse"
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next question" : "Finish quiz"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#27272a] p-8 rounded-lg shadow-xl border border-[#3f3f46] text-center">
            <h2 className="text-3xl font-bold mb-4 norse">
              Quiz Completed!
            </h2>
            <p className="text-2xl mb-6 norse">Your score: {score}/{questions.length}</p>
            
            {score === questions.length ? (
              <p className="mb-8 text-green-400 norse">Excellent! You are a master of Norse mythology!</p>
            ) : score >= questions.length * 0.7 ? (
              <p className="mb-8 text-blue-400 norse">Good job! You have solid knowledge of Norse mythology.</p>
            ) : (
              <p className="mb-8 text-yellow-400 norse">Try again to learn more about Norse mythology!</p>
            )}
            
            <Button 
              onClick={restartQuiz} 
              add="bg-blue-600 hover:bg-blue-700 text-white norse"
            >
              Play again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level8;