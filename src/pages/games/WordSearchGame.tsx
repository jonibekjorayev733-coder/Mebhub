import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, User, Users, Trophy, RotateCcw, Home, Star, Volume2 } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  id: number;
  q: string;
  opts: string[];
  correct: number;
  difficulty: string;
  explanation: string;
  points: number;
}

type Phase = "setup" | "playing" | "results";

const GAME_STYLES = `
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .game-bg {
    background: linear-gradient(135deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%);
    background-size: 400% 400%;
    animation: gradientShift 10s ease infinite;
  }
  .game-grid {
    background-image: 
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 50px 50px;
  }
`;

const MOCK_QUESTIONS: Question[] = [
  { id: 1, q: "AMAKL so'zidan qaysi harfni olib tashlash kerak?", opts: ["A", "M", "K", "L"], correct: 1, difficulty: "Oson", explanation: "AMAKL → AKAL (to'g'ri so'z)", points: 10 },
  { id: 2, q: "MKIRTOB harflaridan to'g'ri so'z yasang", opts: ["KORIT", "KITOB", "Mkitob", "TURK"], correct: 1, difficulty: "O'rta", explanation: "MKIRTOB → KITOB", points: 10 },
  { id: 3, q: "ORADYA so'zini to'g'ri qo'yib yozing", opts: ["ORAD", "ORDA", "AROD", "ROAD"], correct: 1, difficulty: "Oson", explanation: "ORADYA → ORDA", points: 10 },
  { id: 4, q: "DAYNM harflaridan to'g'ri so'z yasang", opts: ["MANYD", "MANNY", "MANDA", "MADYN"], correct: 2, difficulty: "O'rta", explanation: "DAYNM → MANDA", points: 10 },
  { id: 5, q: "MALSOQ qaysi so'zning to'g'ri yozuvi?", opts: ["QOSLA", "SOQLAM", "QOLMAS", "MALQO"], correct: 1, difficulty: "Qiyin", explanation: "MALSOQ → SOQLAM", points: 15 },
  { id: 6, q: "TUFIRB harflarini qayta joylashtiring", opts: ["TURBI", "FRITU", "FRUIT", "BURIT"], correct: 2, difficulty: "Oson", explanation: "TUFIRB → FRUIT", points: 10 },
  { id: 7, q: "Qaysi so'z to'g'ri yozilgan?", opts: ["DUXSOM", "MOZHDU", "UXDUM", "MAXDUM"], correct: 1, difficulty: "Oson", explanation: "MOZHDU — Mожду (orasida)", points: 10 },
  { id: 8, q: "KITOB so'zini aralashtirib yozing", opts: ["TIKOB", "BOTIK", "OKTIB", "BOKTI"], correct: 0, difficulty: "O'rta", explanation: "Harflar aralash", points: 10 },
  { id: 9, q: "XONA so'zidan bir harf qo'shib yangi so'z", opts: ["XONAD", "XONAK", "XOZNA", "EXONA"], correct: 3, difficulty: "O'rta", explanation: "E + XONA = EXONA", points: 10 },
  { id: 10, q: "UQITUVCHI so'zida nechta unli bor?", opts: ["3", "4", "5", "6"], correct: 2, difficulty: "Oson", explanation: "U, I, U, I — 4 ta unli", points: 10 },
];

export default function WordSearchGame() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [gameMode, setGameMode] = useState<"single" | "team">("single");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [teamScores, setTeamScores] = useState({ team1: 0, team2: 0 });
  const [currentTeam, setCurrentTeam] = useState<"team1" | "team2">("team1");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/game-tests/soz_qidiruv/questions?count=10");
      if (!res.ok) throw new Error("Server xatosi");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.questions;
      if (list?.length > 0) {
        setQuestions(list.slice(0, 10).map((q: Record<string, unknown>, i: number) => ({
          id: i + 1,
          q: String(q.q || q.question || ""),
          opts: Array.isArray(q.opts) ? q.opts : Array.isArray(q.options) ? q.options : [],
          correct: Number(q.correct ?? 0),
          difficulty: String(q.difficulty || "Oson"),
          explanation: String(q.explanation || ""),
          points: 10,
        })));
      } else setQuestions(MOCK_QUESTIONS);
    } catch {
      setQuestions(MOCK_QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  const startGame = (mode: "single" | "team") => {
    setGameMode(mode);
    setPhase("playing");
    setScore(0);
    setTeamScores({ team1: 0, team2: 0 });
    setCurrentTeam("team1");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeLeft(60);
    if (questions.length > 0) setQuestionOrder([...Array(questions.length)].map((_, i) => i).sort(() => Math.random() - 0.5));
    if (questions.length === 0) loadQuestions();
  };

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    const idx = questionOrder[currentQuestion] ?? currentQuestion;
    const q = questions[idx];
    const pts = q?.points || 10;
    const correct = index === q?.correct;
    if (gameMode === "single") {
      if (correct) setScore((s) => s + pts);
    } else {
      if (correct) setTeamScores((t) => ({ ...t, [currentTeam]: t[currentTeam] + pts }));
    }
  };

  const totalQ = questionOrder.length || questions.length;
  const orderedIdx = questionOrder[currentQuestion] ?? currentQuestion;
  const q = questions[orderedIdx];
  const displayLetters = useMemo(() => {
    if (!q) return [];
    const correctWord = q?.opts?.[q?.correct ?? 0];
    const raw = correctWord ? [...String(correctWord)].filter((c) => /[A-Za-z'ЁёА-Яа-я0-9]/.test(c)) : [];
    const fromQ = q?.q?.match(/\b([A-Za-z'ЁёА-Яа-я]{4,12})\b/);
    const wordFromQ = fromQ ? fromQ[1] : null;
    const src = raw.length >= 3 ? raw : (wordFromQ ? [...wordFromQ].filter((c) => c.trim()) : []);
    const seed = ((orderedIdx ?? 0) * 31 + (q?.id ?? 0)) % 1000;
    return [...src].sort((a, b) => ((a.charCodeAt(0) || 0) * seed % 100) - ((b.charCodeAt(0) || 0) * seed % 100));
  }, [q?.id, q?.opts, q?.correct, q?.q, orderedIdx]);

  const handleNext = () => {
    if (currentQuestion < totalQ - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setTimeLeft(60);
      if (gameMode === "team") setCurrentTeam((t) => (t === "team1" ? "team2" : "team1"));
    }
  };

  const speakQuestion = () => {
    const idx = questionOrder[currentQuestion] ?? currentQuestion;
    const q = questions[idx]?.q;
    if (q) {
      const u = new SpeechSynthesisUtterance(q);
      u.lang = "uz-UZ";
      window.speechSynthesis.speak(u);
    }
  };

  const finishGame = () => setPhase("results");

  const resetGame = () => {
    setPhase("setup");
    setScore(0);
    setTeamScores({ team1: 0, team2: 0 });
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeLeft(60);
  };

  useEffect(() => {
    if (phase === "playing" && questions.length === 0 && !loading) loadQuestions();
  }, [phase, questions.length, loading]);

  useEffect(() => {
    if (phase === "playing" && questions.length > 0 && questionOrder.length === 0) {
      setQuestionOrder([...Array(questions.length)].map((_, i) => i).sort(() => Math.random() - 0.5));
    }
  }, [phase, questions.length, questionOrder.length]);

  useEffect(() => {
    if (phase === "playing" && timeLeft > 0 && !answered) {
      const t = setInterval(() => setTimeLeft((l) => l - 1), 1000);
      return () => clearInterval(t);
    }
  }, [phase, timeLeft, answered]);

  // Calculate values early so they're available even if we return early
  const orderedIdx = phase === "playing" ? (questionOrder[currentQuestion] ?? currentQuestion) : 0;
  const q = phase === "playing" ? questions[orderedIdx] : undefined;
  const isCorrect = answered && selectedAnswer === q?.correct;

  // Compute shuffled letters for display (memoized to prevent recalculation)
  const displayLetters = useMemo(() => {
    if (!q) return [];
    const correctWord = q.opts?.[q.correct ?? 0];
    const raw = correctWord ? [...correctWord].filter((c) => /[A-Za-z'ЁёА-Яа-я0-9]/.test(c)) : [];
    const fromQ = q.q?.match(/\b([A-Za-z'ЁёА-Яа-я]{4,12})\b/);
    const wordFromQ = fromQ ? fromQ[1] : null;
    const src = raw.length >= 3 ? raw : (wordFromQ ? [...wordFromQ].filter((c) => c.trim()) : []);
    const seed = ((orderedIdx ?? 0) * 31 + (q.id ?? 0)) % 1000;
    const sorted = [...src].sort((a, b) => ((a.charCodeAt(0) || 0) * seed % 100) - ((b.charCodeAt(0) || 0) * seed % 100));
    return sorted;
  }, [q, orderedIdx]);

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen game-bg flex items-center justify-center">
        <style>{GAME_STYLES}</style>
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" style={{ filter: "drop-shadow(0 0 20px rgba(6,182,212,0.6))" }} />
        <p className="ml-4 text-cyan-300 font-bold">Savollar yuklanmoqda...</p>
      </div>
    );
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen relative overflow-hidden game-bg p-6">
        <style>{GAME_STYLES}</style>
        <div className="absolute inset-0 game-grid opacity-50" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px]" />

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl rounded-3xl border-2 border-cyan-500/40 bg-black/50 p-10 max-w-2xl w-full shadow-2xl"
            style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.2)" }}
          >
            <div className="text-center mb-10">
              <div className="text-8xl mb-6" style={{ filter: "drop-shadow(0 0 30px rgba(6, 182, 212, 0.5))" }}>🔍</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 mb-2" style={{ fontFamily: "Orbitron" }}>
                SO'Z QIDIRUV
              </h1>
              <p className="text-cyan-300/80 font-semibold">Aralash harflardan to'g'ri so'zni toping</p>
            </div>

            <div className="space-y-4 mb-10">
              <button
                onClick={() => startGame("single")}
                className="w-full p-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0d9488 100%)", color: "#000", boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
              >
                <User className="w-8 h-8" />
                BIR KISHILIK — Solo Challenge
              </button>
              <button
                onClick={() => startGame("team")}
                className="w-full p-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #9333ea 0%, #c026d3 100%)", color: "#fff", boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)" }}
              >
                <Users className="w-8 h-8" />
                JAMOAVIY — Team Battle
              </button>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-white/5 p-6">
              <h3 className="text-cyan-300 font-bold text-lg mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" /> Qoidalar
              </h3>
              <ul className="space-y-2 text-cyan-100/80 font-medium">
                {["Aralash harflardan to'g'ri so'zni toping", "60 soniya vaqt", "To'g'ri javob = 10 ball", "Jamoaviy rejimda navbatma-navbat"].map((r, i) => (
                  <li key={i}><span className="text-cyan-400">✓</span> {r}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === "playing" && questions.length === 0) {
    return (
      <div className="min-h-screen game-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="min-h-screen game-bg flex items-center justify-center p-6 relative overflow-hidden">
        <style>{GAME_STYLES}</style>
        <div className="absolute inset-0 game-grid opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 backdrop-blur-xl rounded-3xl border-2 border-cyan-500/40 bg-black/50 p-10 max-w-xl w-full"
          style={{ boxShadow: "0 0 60px rgba(6, 182, 212, 0.3)" }}
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-cyan-400 mb-2" style={{ fontFamily: "Orbitron" }}>O'YIN TUGADI!</h1>
            <p className="text-cyan-300/80">Natijangiz</p>
          </div>

          {gameMode === "single" ? (
            <div className="text-center mb-8">
              <p className="text-slate-400 text-sm font-bold uppercase mb-2">Jami ball</p>
              <p className="text-7xl font-black text-cyan-400" style={{ textShadow: "0 0 40px rgba(6, 182, 212, 0.6)" }}>{score}</p>
              {score >= 80 && (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/50">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-bold">Ajoyib natija!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className={`rounded-2xl p-6 text-center border-2 ${teamScores.team1 >= teamScores.team2 ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/30" : "border-white/20 bg-white/5"}`}>
                <p className="text-cyan-400 font-bold mb-1">Jamoa 1</p>
                <p className="text-4xl font-black text-cyan-400">{teamScores.team1}</p>
              </div>
              <div className={`rounded-2xl p-6 text-center border-2 ${teamScores.team2 >= teamScores.team1 ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30" : "border-white/20 bg-white/5"}`}>
                <p className="text-purple-400 font-bold mb-1">Jamoa 2</p>
                <p className="text-4xl font-black text-purple-400">{teamScores.team2}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={resetGame} className="flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105">
              <RotateCcw className="w-5 h-5" /> Qayta O'ynash
            </button>
            <Link to="/" className="flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold bg-white/10 border border-white/20 text-white hover:scale-105">
              <Home className="w-5 h-5" /> Bosh Sahifa
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen game-bg relative overflow-hidden p-4">
      <style>{GAME_STYLES}</style>
      <div className="absolute inset-0 game-grid opacity-40" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto pt-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-black text-cyan-400 flex items-center gap-2" style={{ fontFamily: "Orbitron" }}>
            <Search className="w-8 h-8" /> SO'Z QIDIRUV
          </h1>
          <div className="flex items-center gap-4">
            <div className={`rounded-xl px-4 py-2 border-2 ${timeLeft <= 15 ? "border-red-500 bg-red-500/10" : "border-cyan-500/50 bg-black/40"}`}>
              <span className={`font-bold ${timeLeft <= 15 ? "text-red-400" : "text-cyan-400"}`}>{timeLeft}s</span>
            </div>
            <button onClick={finishGame} className="py-2 px-5 rounded-xl font-bold text-sm border-2 border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20">
              O'yinni Tugatish
            </button>
          </div>
        </div>

        {gameMode === "team" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`rounded-2xl p-4 text-center border-2 ${currentTeam === "team1" ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20" : "border-white/10 bg-white/5"}`}>
              <p className="text-sm font-bold text-cyan-400 mb-1">Jamoa 1</p>
              <p className="text-3xl font-black text-cyan-400">{teamScores.team1}</p>
            </div>
            <div className={`rounded-2xl p-4 text-center border-2 ${currentTeam === "team2" ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20" : "border-white/10 bg-white/5"}`}>
              <p className="text-sm font-bold text-purple-400 mb-1">Jamoa 2</p>
              <p className="text-3xl font-black text-purple-400">{teamScores.team2}</p>
            </div>
          </div>
        )}

        {gameMode === "single" && (
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl px-10 py-4 border-2 border-cyan-500/50 bg-black/40 text-center">
              <p className="text-sm text-cyan-300 font-bold">Ball</p>
              <p className="text-4xl font-black text-cyan-400">{score}</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Savol {currentQuestion + 1} / {totalQ}</span>
            <span>{totalQ > 0 ? Math.round(((currentQuestion + 1) / totalQ) * 100) : 0}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${totalQ > 0 ? ((currentQuestion + 1) / totalQ) * 100 : 0}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        <div className="backdrop-blur-xl rounded-2xl border-2 border-cyan-500/40 bg-black/40 p-8 mb-6" style={{ boxShadow: "0 0 40px rgba(6, 182, 212, 0.15)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex-1">{q?.q}</h2>
            <button onClick={speakQuestion} className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Aralash harflar - to'g'ri javob yoki savoldan (bir marta aralash) */}
          {displayLetters.length >= 3 && (
            <motion.div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-500/30" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-cyan-300 font-bold text-sm mb-4 flex items-center gap-2"><Search className="w-4 h-4" /> Ushbu harflardan so'z yasang:</p>
              <div className="flex gap-3 flex-wrap justify-center">
                {displayLetters.map((char, i) => (
                  <motion.span key={`${char}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * i, type: "spring", stiffness: 200 }} className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/40 to-purple-500/40 border-2 border-cyan-400/50 text-white font-black text-2xl shadow-lg" style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" }}>
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {q?.opts.map((opt, i) => {
              const sel = selectedAnswer === i;
              const cor = i === q.correct;
              let style = "border-white/20 bg-white/5 hover:border-cyan-500/40 text-white";
              if (answered) {
                if (cor) style = "border-green-500 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/30";
                else if (sel) style = "border-red-500 bg-red-500/20 text-red-300";
              } else if (sel) style = "border-cyan-500 bg-cyan-500/20 text-cyan-300";
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={answered} className={`p-4 rounded-xl font-bold text-left border-2 transition-all h-16 flex items-center ${style}`}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {answered && (
          <div className={`backdrop-blur-xl rounded-2xl border-2 p-6 mb-6 ${isCorrect ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"}`}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{isCorrect ? "✓" : "✗"}</span>
              <div>
                <p className={`font-bold text-xl mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>{isCorrect ? "To'g'ri! 🎉" : "Noto'g'ri"}</p>
                <p className="text-slate-300">{q?.explanation}</p>
                {isCorrect && <p className="text-green-400 font-bold mt-2">+{q?.points} ball</p>}
              </div>
            </div>
          </div>
        )}

        {answered && (
          <div className="flex flex-wrap gap-4 justify-center">
            {currentQuestion < totalQ - 1 ? (
              <button onClick={handleNext} className="py-4 px-12 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105">
                Keyingi Savol →
              </button>
            ) : null}
            <button onClick={finishGame} className="py-4 px-12 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105 flex items-center gap-2">
              <Trophy className="w-5 h-5" /> Natijani Ko'rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
