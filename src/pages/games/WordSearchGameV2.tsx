import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Sparkles, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GameProLayout from "@/components/games/GameProLayout";

interface Question {
  id: number;
  q: string;
  opts: string[];
  correct: number;
  difficulty: string;
  explanation: string;
  points: number;
}

const MOCK_QUESTIONS: Question[] = [
  { id: 1, q: "AMAKL so'zidan qaysi harfni olib tashlash kerak?", opts: ["A", "M", "K", "L"], correct: 1, difficulty: "Oson", explanation: "AMAKL → AKAL", points: 10 },
  { id: 2, q: "MKIRTOB harflaridan to'g'ri so'z yasang", opts: ["KORIT", "KITOB", "Mkitob", "TURK"], correct: 1, difficulty: "O'rta", explanation: "MKIRTOB → KITOB", points: 10 },
];

export default function WordSearchGameV2() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/games/questions/word-search?difficulty=Oson")
      .then((r) => r.json())
      .then((data) => setQuestions(Array.isArray(data) && data.length ? data.slice(0, 10) : MOCK_QUESTIONS))
      .catch(() => setQuestions(MOCK_QUESTIONS))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === questions[currentQuestion]?.correct) setScore((s) => s + (questions[currentQuestion]?.points || 10));
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((p) => p + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else setGameOver(true);
  };

  if (loading) {
    return (
      <GameProLayout accentColor="emerald">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full border-2 border-white/20 border-t-white/60 w-16 h-16" />
          <p className="absolute mt-28 text-white/60 font-semibold">Yuklanmoqda...</p>
        </div>
      </GameProLayout>
    );
  }

  if (!questions.length) {
    return (
      <GameProLayout accentColor="white">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="game-pro-card p-10 max-w-md text-center">
            <p className="text-red-400 mb-6 text-lg">❌ Savollarni yuklab bo'lmadi</p>
            <Button onClick={() => window.location.reload()} className="game-pro-btn w-full py-4 rounded-xl">Qayta urinish</Button>
          </div>
        </div>
      </GameProLayout>
    );
  }

  if (gameOver) {
    return (
      <GameProLayout accentColor="emerald">
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="game-pro-card p-12 max-w-md text-center">
            <div className="text-7xl mb-6" style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.3))" }}>🎯</div>
            <h2 className="game-pro-title text-4xl mb-2">O'YIN TUGADI!</h2>
            <p className="text-2xl font-bold text-white mb-8">Jami Ball: <span className="text-emerald-400" style={{ textShadow: "0 0 30px rgba(52,211,153,0.5)" }}>{score}</span></p>
            <div className="space-y-3">
              <Button onClick={() => { setCurrentQuestion(0); setScore(0); setSelectedAnswer(null); setAnswered(false); setGameOver(false); }} className="game-pro-btn w-full py-4 rounded-xl">Qayta O'ynash</Button>
              <Button onClick={() => navigate("/games")} variant="outline" className="w-full py-4 rounded-xl border-white/20 text-white hover:bg-white/10">O'yinlar Sahifasiga</Button>
            </div>
          </motion.div>
        </div>
      </GameProLayout>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <GameProLayout accentColor="emerald">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="game-pro-card p-4 border-white/10">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} style={{ boxShadow: "0 0 20px rgba(52,211,153,0.5)" }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 font-semibold flex items-center gap-2"><Search className="w-5 h-5 text-emerald-400" /> Savol {currentQuestion + 1}/{questions.length}</span>
              <span className="text-xl font-bold text-emerald-400" style={{ textShadow: "0 0 20px rgba(52,211,153,0.4)" }}>{score} <span className="text-white/50 text-sm">ball</span></span>
            </div>
          </div>

          <motion.div key={currentQuestion} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="game-pro-card p-8">
            <div className="border-l-4 border-emerald-500/60 bg-emerald-500/5 p-6 rounded-r-2xl mb-8">
              <h2 className="text-2xl font-bold text-white leading-relaxed">{question.q}</h2>
            </div>

            <div className="space-y-3 mb-8">
              {question.opts.map((opt, idx) => {
                const isCorrect = idx === question.correct;
                const isSelected = selectedAnswer === idx;
                const showCorrect = answered && isCorrect;
                const showWrong = answered && isSelected && !isCorrect;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.02 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    className={`w-full p-4 rounded-2xl font-semibold text-left transition-all duration-300 border-2 ${
                      showCorrect ? "bg-emerald-500/30 border-emerald-400 text-white shadow-lg" :
                      showWrong ? "bg-red-500/20 border-red-400/60 text-red-200" :
                      !answered && isSelected ? "bg-white/15 border-white/30 text-white" :
                      !answered ? "bg-white/5 border-white/10 text-white hover:border-emerald-500/40 hover:bg-white/10" :
                      "bg-white/5 border-white/5 text-white/60"
                    }`}
                    style={showCorrect ? { boxShadow: "0 0 30px rgba(52,211,153,0.3)" } : {}}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl font-bold">{showCorrect ? "✓" : showWrong ? "✗" : String(idx + 1)}</span>
                      {opt}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {answered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
                <p className="text-sm text-white/80"><span className="font-bold text-emerald-400">💡 Tushuntirish:</span> {question.explanation}</p>
              </motion.div>
            )}

            {answered && (
              <Button onClick={handleNext} className="game-pro-btn w-full py-4 rounded-xl">
                {currentQuestion + 1 >= questions.length ? "TUGALLASH" : "KEYINGI"}
              </Button>
            )}
          </motion.div>

          <div className="flex justify-center">
            <Button onClick={() => navigate("/")} variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl">
              <Home className="mr-2 w-4 h-4" /> Bosh sahifa
            </Button>
          </div>
        </div>
      </div>
    </GameProLayout>
  );
}
