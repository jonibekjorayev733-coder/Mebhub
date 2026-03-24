import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "O'zbekiston mustaqillik kuniga qanday nom berilgan?",
    options: ["Mustaqillik kunida", "Azodlik kunida", "Ozodlik kunida", "Erkinlik kunida"],
    correct: 0
  },
  {
    id: 2,
    question: "Tashkent shahar qaysi davlatda joylashgan?",
    options: ["Tojikiston", "O'zbekiston", "Qirg'iziston", "Turkmaniston"],
    correct: 1
  },
  {
    id: 3,
    question: "Samarqand shahar nechta asrdan beri mavjud?",
    options: ["1 asrdan", "3 asrdan", "5 asrdan", "8 asrdan"],
    correct: 2
  },
  {
    id: 4,
    question: "Amir Temur qaysi davlatni tuzgan?",
    options: ["Misrni", "Fors i", "Timuridlar imperiyasini", "Xitoyni"],
    correct: 2
  },
  {
    id: 5,
    question: "Buxoro qaysi davlatning eng qadimiy shaharlaridan biri?",
    options: ["Tojikiston", "O'zbekiston", "Afg'oniston", "Qirg'iziston"],
    correct: 1
  }
];

const SAND_TIMER_DURATION = 30; // 30 soniya

interface GameState {
  phase: 'menu' | 'playing' | 'gameover';
  timeRemaining: number;
  score: number;
  questionIndex: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
}

export default function QumSoatGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    phase: 'menu',
    timeRemaining: SAND_TIMER_DURATION,
    score: 0,
    questionIndex: 0,
    selectedAnswer: null,
    isAnswered: false
  });

  useEffect(() => {
    if (gameState.phase !== 'playing') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          setGameState(p => ({ ...p, phase: 'gameover' }));
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.phase]);

  const handleStartGame = () => {
    setGameState({
      phase: 'playing',
      timeRemaining: SAND_TIMER_DURATION,
      score: 0,
      questionIndex: 0,
      selectedAnswer: null,
      isAnswered: false
    });
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (gameState.isAnswered) return;
    setGameState(prev => ({
      ...prev,
      selectedAnswer: optionIndex
    }));
  };

  const handleSubmitAnswer = () => {
    if (gameState.selectedAnswer === null) return;

    const currentQuestion = QUESTIONS[gameState.questionIndex];
    const isCorrect = gameState.selectedAnswer === currentQuestion.correct;

    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      score: isCorrect ? prev.score + 10 : prev.score
    }));

    toast({
      title: isCorrect ? "✅ To'g'ri!" : "❌ Xato!",
      description: isCorrect ? "+10 ball" : "Noto'g'ri javob"
    });

    setTimeout(() => {
      if (gameState.questionIndex < QUESTIONS.length - 1) {
        setGameState(prev => ({
          ...prev,
          questionIndex: prev.questionIndex + 1,
          selectedAnswer: null,
          isAnswered: false
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          phase: 'gameover'
        }));
      }
    }, 1500);
  };

  const handleGoHome = () => {
    navigate('/games');
  };

  // MENU SCREEN
  if (gameState.phase === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center p-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-700 p-12 max-w-md shadow-2xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-yellow-900 mb-4">⏳ QUM SOAT</h1>
            <p className="text-yellow-800 text-xl mb-8 font-bold">30 soniya - 5 savol - 50 ball</p>

            <div className="mb-8 p-4 bg-yellow-200 rounded-lg border-2 border-yellow-600">
              <p className="text-yellow-900 font-bold text-sm leading-relaxed">
                ✓ Har savol = 10 ball<br/>
                ✓ 30 soniyada javob bering<br/>
                ✓ Barcha to'g'ri javoblar = JACKPOT! 🎉
              </p>
            </div>

            <Button
              onClick={handleStartGame}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-yellow-900 font-bold text-xl py-6 rounded-lg shadow-lg mb-3"
            >
              🎮 BOSHLASH
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-yellow-600 text-yellow-700 hover:bg-yellow-100"
            >
              ← Orqaga
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // PLAYING SCREEN
  if (gameState.phase === 'playing') {
    const currentQuestion = QUESTIONS[gameState.questionIndex];
    const percentage = Math.round((gameState.timeRemaining / SAND_TIMER_DURATION) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-amber-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-8">
            <div className="bg-yellow-200 border-3 border-yellow-700 rounded-lg px-6 py-3 shadow-lg">
              <p className="text-xs font-bold text-yellow-800">HISOBNI</p>
              <p className="text-3xl font-bold text-yellow-900">{gameState.score}</p>
            </div>

            <Button
              onClick={handleGoHome}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              Chiqish
            </Button>
          </div>

          {/* QUM SOAT TIMER */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-b from-yellow-400 to-yellow-600 border-4 border-yellow-700 rounded-lg p-6 shadow-2xl">
              <div className="text-5xl font-bold text-yellow-900 mb-2">⏳</div>
              <div className="text-4xl font-bold text-yellow-900 mb-4">{gameState.timeRemaining}</div>
              <div className="w-40 h-6 bg-yellow-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-300 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* SAVOL RAQAMI */}
          <div className="text-center mb-6">
            <p className="text-lg font-bold text-yellow-800">
              Savol: {gameState.questionIndex + 1} / {QUESTIONS.length}
            </p>
          </div>

          {/* SAVOL KARTI */}
          <Card className="bg-white border-4 border-yellow-700 p-8 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-900 text-center mb-8">
              {currentQuestion.question}
            </h2>

            {/* JAVOB VARIANTLARI */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={gameState.isAnswered}
                  className={`
                    w-full p-4 rounded-lg font-bold text-lg transition-all text-left
                    border-3 flex items-center gap-4
                    ${
                      gameState.selectedAnswer === index && !gameState.isAnswered
                        ? 'bg-yellow-200 border-yellow-600'
                        : gameState.isAnswered && index === currentQuestion.correct
                        ? 'bg-green-200 border-green-600'
                        : gameState.isAnswered && index === gameState.selectedAnswer
                        ? 'bg-red-200 border-red-600'
                        : 'bg-yellow-50 border-yellow-600 hover:bg-yellow-100 cursor-pointer'
                    }
                  `}
                  style={{ opacity: gameState.isAnswered && index !== gameState.selectedAnswer && index !== currentQuestion.correct ? 0.5 : 1 }}
                >
                  <span className="text-2xl font-bold w-10 h-10 flex items-center justify-center bg-yellow-700 text-white rounded-lg">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-yellow-900">{option}</span>
                </button>
              ))}
            </div>

            {/* TEKSHIRISH TUGMASI */}
            {!gameState.isAnswered ? (
              <div className="text-center">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={gameState.selectedAnswer === null}
                  className={`
                    bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700
                    text-yellow-900 font-bold text-lg px-12 py-3 rounded-lg shadow-lg
                    ${gameState.selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  ✅ Tekshirish
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-yellow-800 font-bold text-lg animate-pulse">
                  Keyingi savol...
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // GAME OVER SCREEN
  if (gameState.phase === 'gameover') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center p-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-4 border-yellow-700 p-12 max-w-md text-center shadow-2xl">
          <div className="mb-6">
            <p className="text-6xl mb-4 animate-bounce">🏆</p>
            <h1 className="text-4xl font-bold text-yellow-900">O'yin Tugadi!</h1>
          </div>

          <div className="bg-yellow-200 border-3 border-yellow-700 rounded-lg p-6 mb-8">
            <p className="text-yellow-800 text-sm font-bold mb-2">JAMI BALL</p>
            <p className="text-5xl font-bold text-yellow-900">{gameState.score}</p>
            <p className="text-yellow-800 text-sm mt-2">50 maksimum</p>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 mb-8">
            <p className="text-yellow-900 font-bold text-lg">
              {gameState.score === 50
                ? "🌟 AJOYIB! HAMMASINI TOPIBSIZ!"
                : gameState.score >= 40
                ? "😊 Zo'r natija!"
                : gameState.score >= 30
                ? "👍 Yaxshi o'yin!"
                : "💪 Yana harakat qiling!"}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleStartGame}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold py-3 rounded-lg"
            >
              🔄 Qaytadan
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-3 rounded-lg"
            >
              Orqaga
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
