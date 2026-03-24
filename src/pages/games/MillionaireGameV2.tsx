import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Home } from "lucide-react";
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

const PRIZE_LEVELS = [
  { level: 1, amount: 100 }, { level: 2, amount: 500 }, { level: 3, amount: 1000 }, { level: 4, amount: 5000 },
  { level: 5, amount: 10000 }, { level: 6, amount: 25000 }, { level: 7, amount: 50000 }, { level: 8, amount: 100000 },
  { level: 9, amount: 500000 }, { level: 10, amount: 1000000 },
];

const MOCK_QUESTIONS: Question[] = [
  { id: 1, q: "Dunyoning eng katta davlat?", opts: ["Rossiya", "Kanada", "AQSh", "Australiya"], correct: 0, difficulty: "Oson", explanation: "Rossiya dunyoning eng katta davlatdir", points: 100 },
];

export default function MillionaireGameV2() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/games/questions/millionaire?difficulty=Oson")
      .then((r) => r.json())
      .then((data) => setQuestions(Array.isArray(data) && data.length ? data.slice(0, 10) : MOCK_QUESTIONS))
      .catch(() => setQuestions(MOCK_QUESTIONS))
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === questions[currentLevel]?.correct) setTotalWinnings(PRIZE_LEVELS[currentLevel].amount);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentLevel]?.correct) {
      if (currentLevel + 1 < questions.length) {
        setCurrentLevel((p) => p + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else setGameOver(true);
    } else setGameOver(true);
  };

  if (loading) {
    return (
      <GameProLayout accentColor="amber">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full border-2 border-white/20 border-t-amber-400/80 w-16 h-16" />
          <p className="absolute mt-28 text-white/60 font-semibold">Yuklanmoqda...</p>
        </div>
      </GameProLayout>
    );
  }

  if (gameOver) {
    return (
      <GameProLayout accentColor="amber">
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="game-pro-card p-12 max-w-md text-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-7xl mb-6" style={{ filter: "drop-shadow(0 0 40px rgba(251,191,36,0.5))" }}>💰</motion.div>
            <h2 className="game-pro-title text-4xl mb-2">{currentLevel === questions.length ? "MILYONCHI BOLING!" : "O'YIN TUGADI"}</h2>
            <p className="text-3xl font-bold text-white mb-2">Jami: <span className="text-amber-400" style={{ textShadow: "0 0 30px rgba(251,191,36,0.5)" }}>{totalWinnings.toLocaleString()}</span> so'm</p>
            {currentLevel > 0 && currentLevel < questions.length && <p className="text-white/70 mb-8">{currentLevel} savollada to'g'ri javob berdingiz!</p>}
            <div className="space-y-3">
              <Button onClick={() => { setCurrentLevel(0); setTotalWinnings(0); setSelectedAnswer(null); setAnswered(false); setGameOver(false); }} className="game-pro-btn w-full py-4 rounded-xl">Qayta O'ynash</Button>
              <Button onClick={() => navigate("/games")} variant="outline" className="w-full py-4 rounded-xl border-white/20 text-white hover:bg-white/10">O'yinlar Sahifasiga</Button>
            </div>
          </motion.div>
        </div>
      </GameProLayout>
    );
  }

  const question = questions[currentLevel];
  const currentPrize = PRIZE_LEVELS[currentLevel];
  const progress = ((currentLevel + 1) / questions.length) * 100;

  return (
    <GameProLayout accentColor="amber">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2 order-2 lg:order-1">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Yutuqlar</h3>
            <div className="space-y-2">
              {PRIZE_LEVELS.map((prize, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className={`game-pro-card p-3 rounded-xl transition-all ${idx === currentLevel ? "border-amber-500/50 scale-105" : ""}`} style={idx === currentLevel ? { boxShadow: "0 0 30px rgba(251,191,36,0.2)" } : idx < currentLevel ? { borderColor: "rgba(52,211,153,0.3)" } : {}}>
                  <p className="text-xs font-bold text-white/60">Savol {prize.level}</p>
                  <p className={`text-sm font-bold ${idx === currentLevel ? "text-amber-400" : idx < currentLevel ? "text-emerald-400" : "text-white/40"}`}>{prize.amount.toLocaleString()} so'm</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
            <div className="game-pro-card p-4">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} style={{ boxShadow: "0 0 20px rgba(251,191,36,0.5)" }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80 font-semibold flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Savol {currentLevel + 1}/{questions.length}</span>
                <span className="text-xl font-bold text-amber-400" style={{ textShadow: "0 0 20px rgba(251,191,36,0.4)" }}>{currentPrize.amount.toLocaleString()} so'm</span>
              </div>
            </div>

            <motion.div key={currentLevel} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="game-pro-card p-8">
              <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">{question.q}</h2>

              <div className="space-y-3 mb-8">
                {question.opts.map((opt, idx) => {
                  const isCorrect = idx === question.correct;
                  const isSelected = selectedAnswer === idx;
                  const showCorrect = answered && isCorrect;
                  const showWrong = answered && isSelected && !isCorrect;
                  return (
                    <motion.button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} whileHover={!answered ? { scale: 1.02 } : {}} whileTap={!answered ? { scale: 0.98 } : {}} className={`w-full p-4 rounded-2xl font-semibold text-left transition-all duration-300 border-2 flex items-center gap-3 ${showCorrect ? "bg-emerald-500/30 border-emerald-400 text-white shadow-lg" : showWrong ? "bg-red-500/20 border-red-400/60 text-red-200" : !answered && isSelected ? "bg-amber-500/20 border-amber-400/60 text-white" : !answered ? "bg-white/5 border-white/10 text-white hover:border-amber-500/50 hover:bg-white/10" : "bg-white/5 border-white/5 text-white/60"}`} style={showCorrect ? { boxShadow: "0 0 30px rgba(52,211,153,0.3)" } : {}}>
                      <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">{String.fromCharCode(65 + idx)}</span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {answered && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
                  <p className="text-sm text-white/80"><span className="font-bold text-amber-400">💡 Tushuntirish:</span> {question.explanation}</p>
                </motion.div>
              )}

              {answered && (
                <Button onClick={handleNext} className="game-pro-btn w-full py-4 rounded-xl">
                  {currentLevel + 1 >= questions.length ? "TUGALLASH" : "KEYINGI"}
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
      </div>
    </GameProLayout>
  );
}
