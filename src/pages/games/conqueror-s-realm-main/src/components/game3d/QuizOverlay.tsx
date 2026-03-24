import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sword, Shield } from "lucide-react";

interface QuizOverlayProps {
  cityName: string;
  year: string;
  question: string;
  options: { key: string; label: string }[];
  correctKey: string;
  battleName: string;
  onResult: (correct: boolean) => void;
}

type Phase = "intro" | "quiz" | "result";

const QuizOverlay = ({
  cityName,
  year,
  question,
  options,
  correctKey,
  battleName,
  onResult,
}: QuizOverlayProps) => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleStart = () => setPhase("quiz");

  const handleConfirm = useCallback(() => {
    if (!selected || answered) return;
    const correct = selected === correctKey;
    setIsCorrect(correct);
    setAnswered(true);
    setPhase("result");

    // Play sound
    try {
      const ctx = new AudioContext();
      if (correct) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.connect(g).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } else {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.connect(g).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      }
    } catch {}

    setTimeout(() => onResult(correct), 2000);
  }, [selected, answered, correctKey, onResult]);

  const getOptionStyle = (key: string) => {
    if (!answered) {
      return selected === key ? "gold-border" : "border border-border hover:bg-muted/50";
    }
    if (key === correctKey) return "border border-confirm bg-confirm/10";
    if (key === selected && !isCorrect) return "border border-destructive bg-destructive/10";
    return "border border-border opacity-40";
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />

      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="relative z-10 text-center flex flex-col items-center gap-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sword size={64} className="text-gold" />
            </motion.div>
            <h2
              className="font-display text-5xl font-extrabold tracking-wider"
              style={{
                background: "linear-gradient(135deg, hsl(45, 80%, 65%), hsl(45, 80%, 45%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {cityName} MUHOSARASI
            </h2>
            <p className="font-mono-data text-timurid tracking-[0.3em]">{year}-YIL</p>
            <p className="font-ui text-muted-foreground max-w-md">
              Jangga kirishdan oldin strategik savolingizga javob bering. To'g'ri javob qo'shiningizni kuchaytiradi!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-md bg-confirm text-foreground font-ui font-bold uppercase tracking-wider hover:brightness-110 transition-all"
            >
              <Shield size={16} className="inline mr-2" />
              JANGGA TAYYORLANISH
            </button>
          </motion.div>
        )}

        {/* QUIZ PHASE */}
        {phase === "quiz" && (
          <motion.div
            key="quiz"
            className="relative z-10 glass-panel w-[420px] p-6 flex flex-col gap-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold tracking-widest gold-text uppercase">
                {battleName}
              </h3>
              <span className="font-mono-data text-xs text-timurid">{year}</span>
            </div>

            <p className="font-ui text-sm font-medium text-foreground leading-relaxed">
              {question}
            </p>

            <div className="flex flex-col gap-2">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => !answered && setSelected(opt.key)}
                  disabled={answered}
                  className={`glass-panel-inner flex items-center gap-3 px-4 py-3 text-left text-sm font-ui transition-all duration-150 ${getOptionStyle(opt.key)}`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answered && opt.key === correctKey ? "border-confirm" :
                    answered && opt.key === selected && !isCorrect ? "border-destructive" :
                    selected === opt.key ? "border-gold" : "border-muted-foreground"
                  }`}>
                    {answered && opt.key === correctKey && <CheckCircle2 size={12} className="text-confirm" />}
                    {answered && opt.key === selected && !isCorrect && <XCircle size={12} className="text-destructive" />}
                    {!answered && selected === opt.key && <span className="w-2 h-2 rounded-full bg-gold" />}
                  </span>
                  <span className="text-foreground">{opt.key}) {opt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selected || answered}
              className={`w-full py-3 rounded-md font-ui font-bold text-sm tracking-wider uppercase transition-all ${
                selected && !answered
                  ? "bg-confirm text-foreground hover:brightness-110 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              TASDIQLASH
            </button>
          </motion.div>
        )}

        {/* RESULT PHASE */}
        {phase === "result" && (
          <motion.div
            key="result"
            className="relative z-10 text-center flex flex-col items-center gap-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isCorrect ? 360 : 0, scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6 }}
            >
              {isCorrect ? (
                <CheckCircle2 size={72} className="text-confirm" />
              ) : (
                <XCircle size={72} className="text-destructive" />
              )}
            </motion.div>

            <h2
              className="font-display text-5xl font-extrabold"
              style={{
                background: isCorrect
                  ? "linear-gradient(135deg, hsl(45, 80%, 65%), hsl(160, 84%, 45%))"
                  : "linear-gradient(135deg, hsl(0, 70%, 50%), hsl(25, 80%, 40%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {isCorrect ? "G'ALABA!" : "MAG'LUBIYAT!"}
            </h2>

            <p className="font-ui text-muted-foreground">
              {isCorrect
                ? `Qo'shiningiz kuchaytirildi! ${cityName} muhosarasi boshlanmoqda...`
                : "Xato taktika! Qo'shiningiz zaiflab qoldi..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizOverlay;
