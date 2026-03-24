import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GameProLayout from '@/components/games/GameProLayout';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
}

const HISTORY_QUESTIONS: Question[] = [
  // Easy
  {
    id: 1,
    question: "O'zbekiston qaysi sanadagi mustaqillik gun i?",
    options: ["1990", "1991", "1992", "1993"],
    correct: 1,
    explanation: "1 sentabr 1991 yili O'zbekiston mustaqil davlat bo'ldi",
    difficulty: "Oson"
  },
  {
    id: 2,
    question: "O'zbekistonning birinchi prezidenti kim?",
    options: ["Qahhor Abdullayev", "Islam Karimov", "Shavkat Mirziyoyev", "Zulfiqor Ali Bhutto"],
    correct: 1,
    explanation: "Islam Karimov 1991-2016 yillari O'zbekistonning prezidenti bo'ldi",
    difficulty: "Oson"
  },
  {
    id: 3,
    question: "Samarqand qaysi davlatda joylashgan?",
    options: ["Tojikiston", "O'zbekiston", "Qirg'iziston", "Turkmaniston"],
    correct: 1,
    explanation: "Samarqand O'zbekistonning eng qadimiy shaharlaridan biri",
    difficulty: 'Oson'
  },
  {
    id: 4,
    question: "Bibi-Xonum masxidi qaysi shaharida?",
    options: ["Buxoro", "Xiva", "Samarqand", "Tashkent"],
    correct: 2,
    explanation: "Bibi-Xonum masxidi Samarqandda joylashgan",
    difficulty: "Oson"
  },
  {
    id: 5,
    question: "Amir Temur qaysi asrda yashagan?",
    options: ["13-asr", "14-asr", "15-asr", "16-asr"],
    correct: 1,
    explanation: "Amir Temur 14-asrda (1336-1405) yashagan",
    difficulty: "Oson"
  },
  
  // Medium
  {
    id: 6,
    question: "Khotani yoli qaysi taraflarda savdo o'tkazadi?",
    options: ["Xitoy-Ruminiya", "Hindiston-Rim", "Xitoy-Rim", "Hindiston-Rim"],
    correct: 2,
    explanation: "Khotani yoli Xitoy va Rimni birlashtirgan juda muhim savdo yo'li",
    difficulty: "O'rta"
  },
  {
    id: 7,
    question: "Turkiston qaysi davlatning birinchi poytaxti edi?",
    options: ["Tojikiston", "Qirg'iziston", "O'zbekiston", "Turkmaniston"],
    correct: 2,
    explanation: "Turkiston O'zbekistonning 1992-1997 yillari poytaxti bo'ldi",
    difficulty: "O'rta"
  },
  {
    id: 8,
    question: "Xiva xoqimligi qaysi asrda ta'sis etilgan?",
    options: ["15-asr", "16-asr", "17-asr", "18-asr"],
    correct: 2,
    explanation: "Xiva xoqimligi 17-asrda ta'sis etilgan",
    difficulty: "O'rta"
  },
  {
    id: 9,
    question: "Buxoro amirligi qayda joylashgan?",
    options: ["Uzbekistan markaziida", "Uzbekistan sharqida", "Uzbekistan gharbida", "Uzbekistan shimolida"],
    correct: 0,
    explanation: "Buxoro amirligi O'zbekistonning markaziy qismida joylashgan",
    difficulty: "O'rta"
  },
  {
    id: 10,
    question: "Amir Temurning poytaxti qaysi shahar edi?",
    options: ["Buxoro", "Samarqand", "Xiva", "Tashkent"],
    correct: 1,
    explanation: "Amir Temur Samarqandni poytaxti qildi",
    difficulty: "O'rta"
  },

  // Hard
  {
    id: 11,
    question: "Qorasmiylar davlati nechchi asrda mavjud bo'lgan?",
    options: ["10-11-asr", "11-12-asr", "12-13-asr", "13-14-asr"],
    correct: 2,
    explanation: "Qorasmiylar davlati 12-13-asrlarda turli xalqlarni birlashtirib hukm qilgan",
    difficulty: "Qiyin"
  },
  {
    id: 12,
    question: "Tojikiston va Uzbekiston qaysi sonda ajralgan?",
    options: ["1921", "1924", "1929", "1936"],
    correct: 1,
    explanation: "Tojikiston va Uzbekiston 1924 yilda ajralib, alohida sovetlar bo'ldi",
    difficulty: "Qiyin"
  },
  {
    id: 13,
    question: "Khotani yoli eng ko'p ishlatilib necha asr davom etgan?",
    options: ["500 yil", "1000 yil", "1500 yil", "2000 yil"],
    correct: 2,
    explanation: "Khotani yoli 1500 yildan ortiq vaqt davom etgan",
    difficulty: "Qiyin"
  }
];

interface GameState {
  currentQuestion: number;
  score: number;
  totalQuestions: number;
  gameStarted: boolean;
  gameEnded: boolean;
  selectedAnswer: number | null;
  answered: boolean;
  difficulty: 'Oson' | "O'rta" | 'Qiyin';
}

export default function TarixniQilishGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    totalQuestions: HISTORY_QUESTIONS.length,
    gameStarted: false,
    gameEnded: false,
    selectedAnswer: null,
    answered: false,
    difficulty: 'Oson'
  });

  const currentQuestion = HISTORY_QUESTIONS[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100;

  const handleStartGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  const handleSelectAnswer = (index: number) => {
    if (gameState.answered) return;
    
    setGameState(prev => ({ ...prev, selectedAnswer: index, answered: true }));
    
    if (index === currentQuestion.correct) {
      const points = currentQuestion.difficulty === 'Oson' ? 10 : 
                     currentQuestion.difficulty === "O'rta" ? 20 : 30;
      setGameState(prev => ({ ...prev, score: prev.score + points }));
      toast({
        title: "✅ To'g'ri javob!",
        description: currentQuestion.explanation,
        className: "bg-green-900 border-green-700"
      });
    } else {
      toast({
        title: "❌ Noto'g'ri javob",
        description: currentQuestion.explanation,
        className: "bg-red-900 border-red-700"
      });
    }
  };

  const handleNextQuestion = () => {
    if (gameState.currentQuestion < gameState.totalQuestions - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        answered: false
      }));
    } else {
      setGameState(prev => ({ ...prev, gameEnded: true }));
    }
  };

  const handlePlayAgain = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      totalQuestions: HISTORY_QUESTIONS.length,
      gameStarted: false,
      gameEnded: false,
      selectedAnswer: null,
      answered: false,
      difficulty: 'Oson'
    });
  };

  const handleGoHome = () => {
    navigate('/games');
  };

  // Main Menu
  if (!gameState.gameStarted) {
    return (
      <GameProLayout accentColor="purple">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-pro-card max-w-md w-full p-8 text-center">
            <div className="text-5xl mb-4">📜</div>
            <h1 className="text-3xl font-bold text-white mb-4">Tarixni Bilaman</h1>
            <p className="text-gray-300 mb-6">
              O'zbekistonning tarix va geografiyasi bo'yicha bilimingizni sinab ko'ring!
            </p>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-white font-semibold mb-3">O'yin haqida:</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>✓ {HISTORY_QUESTIONS.length} ta savol</li>
                <li>✓ Uch darajali qiyinchiligi</li>
                <li>✓ To'g'ri javobga pul oling!</li>
                <li>✓ Tarix va geografiya o'rganing</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleStartGame}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
              >
                🎮 O'YNASHNI BOSHLASH
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full border-purple-500 text-purple-400"
              >
                Orqaga qaytish
              </Button>
            </div>
        </div>
      </div>
      </GameProLayout>
    );
  }

  // Game Over Screen
  if (gameState.gameEnded) {
    const percentage = Math.round((gameState.score / (gameState.totalQuestions * 30)) * 100);
    const rating = percentage >= 80 ? '⭐⭐⭐' : percentage >= 60 ? '⭐⭐' : percentage >= 40 ? '⭐' : '❌';
    
    return (
      <GameProLayout accentColor="purple">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-pro-card max-w-md w-full p-8">
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">{rating}</div>
            <h2 className="text-3xl font-bold text-white mb-4">O'yin tugadi!</h2>
            
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-6">
              <p className="text-gray-200 text-sm mb-2">UMUMIY BALLLAR</p>
              <p className="text-4xl font-bold text-white">{gameState.score}</p>
              <p className="text-gray-200 text-sm mt-2">{percentage}%</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Jami savollar:</span>
                  <span className="font-semibold">{gameState.totalQuestions}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>To'g'ri javoblar:</span>
                  <span className="font-semibold">{Math.round((gameState.score / 30) * 0.7)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handlePlayAgain}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
              >
                🔄 QAYTA O'YNASH
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full border-purple-500 text-purple-400"
              >
                O'yinlar sahifasiga qaytish
              </Button>
            </div>
        </div>
      </div>
    </div>
      </GameProLayout>
    );
  }

  // Game Screen
  return (
    <GameProLayout accentColor="purple">
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-white text-2xl font-bold">📜 Tarixni Bilaman</h1>
            <div className="text-right">
              <p className="text-purple-300 font-semibold text-lg">{gameState.score} ball</p>
              <p className="text-gray-400 text-sm">{gameState.currentQuestion + 1}/{gameState.totalQuestions}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-gray-800 border-purple-500 mb-8 shadow-xl">
          <div className="p-8">
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                currentQuestion.difficulty === 'Oson' ? 'bg-green-900 text-green-300' :
                currentQuestion.difficulty === "O'rta" ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-8">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={gameState.answered}
                  className={`w-full p-4 rounded-lg font-semibold transition-all text-lg ${
                    !gameState.answered 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer hover:border-purple-400'
                      : index === currentQuestion.correct
                      ? 'bg-green-600 text-white border-2 border-green-400'
                      : index === gameState.selectedAnswer
                      ? 'bg-red-600 text-white border-2 border-red-400'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  } border-2 border-transparent`}
                >
                  <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Next Button */}
        {gameState.answered && (
          <div className="flex gap-3">
            <Button 
              onClick={handleNextQuestion}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
            >
              {gameState.currentQuestion === gameState.totalQuestions - 1 
                ? '✅ TUGALLASH' 
                : '➡️ KEYINGI'}
            </Button>
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="border-purple-500 text-purple-400"
            >
              Chiqish
            </Button>
          </div>
        )}
      </div>
    </div>
    </GameProLayout>
  );
}
