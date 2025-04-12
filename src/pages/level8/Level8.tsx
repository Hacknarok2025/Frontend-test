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

const Level8 = () => {
  // Norse mythology quiz questions
  const questions: Question[] = [
    {
      id: 1,
      question: "Kto jest głównym bogiem w mitologii nordyckiej?",
      answers: ["Thor", "Loki", "Odyn", "Baldur"],
      correctAnswer: 2,
      explanation: "Odyn jest najwyższym bogiem w mitologii nordyckiej, nazywany Wszechojcem."
    },
    {
      id: 2,
      question: "Jak nazywa się wielki jesion, który łączy dziewięć światów w mitologii nordyckiej?",
      answers: ["Mjolnir", "Bifrost", "Yggdrasil", "Valhalla"],
      correctAnswer: 2,
      explanation: "Yggdrasil to ogromny jesion, który łączy dziewięć światów w kosmologii nordyckiej."
    },
    {
      id: 3,
      question: "Kto jest bogiem piorunów w mitologii nordyckiej?",
      answers: ["Thor", "Loki", "Baldur", "Freja"],
      correctAnswer: 0,
      explanation: "Thor jest bogiem piorunów, posługuje się młotem Mjolnirem."
    },
    {
      id: 4,
      question: "Co to jest Ragnarök?",
      answers: ["Święto plonów", "Nordycka uczta", "Koniec świata", "Miejsce spotkań bogów"],
      correctAnswer: 2,
      explanation: "Ragnarök to w mitologii nordyckiej seria wydarzeń, które prowadzą do końca świata."
    },
    {
      id: 5,
      question: "Jak nazywa się kraina zmarłych rządzona przez boginię Hel?",
      answers: ["Asgard", "Niflheim", "Valhalla", "Helheim"],
      correctAnswer: 3,
      explanation: "Helheim to kraina zmarłych rządzona przez boginię Hel, córkę Lokiego."
    },
    {
      id: 6,
      question: "Które stworzenie owija się wokół Midgardu (Ziemi)?",
      answers: ["Fenrir", "Jormungandr", "Sleipnir", "Hugin"],
      correctAnswer: 1,
      explanation: "Jormungandr, znany również jako Wąż Midgardu, to olbrzymi wąż oplatający Ziemię."
    },
    {
      id: 7,
      question: "Które zwierzęta towarzyszą Odynowi?",
      answers: ["Dwa kruki i dwa wilki", "Dwa kruki i dwa konie", "Dwa wilki i dwa orły", "Dwa orły i dwa lwy"],
      correctAnswer: 0,
      explanation: "Odynowi towarzyszą dwa kruki - Hugin i Munin oraz dwa wilki - Geri i Freki."
    },
    {
      id: 8,
      question: "Kto jest ojcem Lokiego?",
      answers: ["Odyn", "Thor", "Farbauti", "Bor"],
      correctAnswer: 2,
      explanation: "Loki jest synem olbrzyma Farbautiego i olbrzymki Laufey."
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);

  // Reset timer when moving to a new question
  useEffect(() => {
    if (quizCompleted || showExplanation || showFinalScore) return;
    
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
  }, [currentQuestionIndex, quizCompleted, showExplanation]);

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
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setTimer(30);
    setShowExplanation(false);
    setShowFinalScore(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#18181b] text-white flex flex-col items-center justify-center py-10 px-4 md:px-0 relative">
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/imgs/tree-bg.png')" }}
      ></div>
      
      <div className="relative z-10 w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: 'NorseBold, sans-serif' }}>
            Mitologia Nordycka
          </h1>
          <p className="text-xl">Poziom 8: Quiz o mitologii nordyckiej</p>
        </div>

        {!quizCompleted ? (
          <div className="bg-[#27272a] p-8 rounded-lg shadow-xl border border-[#3f3f46]">
            <div className="flex justify-between mb-6">
              <span className="text-lg">Pytanie {currentQuestionIndex + 1}/{questions.length}</span>
              <span className="text-lg">Wynik: {score}/{questions.length}</span>
            </div>
            
            <div className="mb-4 w-full bg-[#3f3f46] h-2 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-200"
                style={{ width: `${(timer / 30) * 100}%`, backgroundColor: timer < 10 ? '#ef4444' : '#3b82f6' }}
              ></div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
            
            <div className="space-y-4 mb-6">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-300 transform hover:scale-[1.01] border-2 ${
                    selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-500/20"
                        : "border-red-500 bg-red-500/20"
                      : selectedAnswer !== null && index === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-500/20"
                      : "border-[#3f3f46] bg-[#3f3f46]/40 hover:bg-[#3f3f46]"
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {answer}
                </button>
              ))}
            </div>
            
            {showExplanation && (
              <div className="mb-6 p-4 bg-[#3f3f46]/50 rounded-lg">
                <h3 className="font-bold mb-2">Wyjaśnienie:</h3>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
            
            {showResult && (
              <div className="flex justify-center">
                <Button 
                  onClick={handleNextQuestion} 
                  add="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Następne pytanie" : "Zakończ quiz"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#27272a] p-8 rounded-lg shadow-xl border border-[#3f3f46] text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'NorseBold, sans-serif' }}>
              Quiz zakończony!
            </h2>
            <p className="text-2xl mb-6">Twój wynik: {score}/{questions.length}</p>
            
            {score === questions.length ? (
              <p className="mb-8 text-green-400">Doskonale! Jesteś mistrzem mitologii nordyckiej!</p>
            ) : score >= questions.length * 0.7 ? (
              <p className="mb-8 text-blue-400">Dobra robota! Masz solidną wiedzę o mitologii nordyckiej.</p>
            ) : (
              <p className="mb-8 text-yellow-400">Spróbuj jeszcze raz, aby lepiej poznać mitologię nordycką!</p>
            )}
            
            <Button 
              onClick={restartQuiz} 
              add="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Zagraj ponownie
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level8;