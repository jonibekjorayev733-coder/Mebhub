import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle } from "lucide-react";
import BattleSequence from "./BattleSequence";
import DefeatSequence from "./DefeatSequence";
import { battleMap, questionBattleMap } from "./battleData";
import { useGame } from "@/contexts/GameContext";

interface Question {
  id: number;
  title: string;
  question: string;
  options: { key: string; label: string }[];
  correctKey: string;
  rewards: { gold: number; troops: number; food: number; faith: number };
  penalties: { troops: number; food: number };
}

const questions: Question[] = [
  {
    id: 1,
    title: "TEST: CONQUER BAGHDAD",
    question: "QAYSI JANG AMIR TEMUR TOMONIDAN TURKIYA SULTONI BOYAZID I GA QARSHI G'ALABA QOZONILGAN?",
    options: [
      { key: "A", label: "Terek daryosi jangi" },
      { key: "B", label: "Anqara jangi" },
      { key: "C", label: "Kondurcha jangi" },
      { key: "D", label: "Dehli jangi" },
    ],
    correctKey: "B",
    rewards: { gold: 10000, troops: 500, food: 300, faith: 10 },
    penalties: { troops: 300, food: 200 },
  },
  {
    id: 2,
    title: "TEST: SAMARQAND MUDOFAASI",
    question: "AMIR TEMUR QAYSI YILDA SAMARQANDNI O'Z POYTAXTI SIFATIDA TANLAGAN?",
    options: [
      { key: "A", label: "1370-yil" },
      { key: "B", label: "1380-yil" },
      { key: "C", label: "1365-yil" },
      { key: "D", label: "1390-yil" },
    ],
    correctKey: "A",
    rewards: { gold: 5000, troops: 300, food: 200, faith: 15 },
    penalties: { troops: 200, food: 150 },
  },
  {
    id: 3,
    title: "TEST: DEHLI YURISHI",
    question: "AMIR TEMUR HINDISTONGA QAYSI YILDA YURISH QILGAN?",
    options: [
      { key: "A", label: "1395-yil" },
      { key: "B", label: "1398-yil" },
      { key: "C", label: "1402-yil" },
      { key: "D", label: "1388-yil" },
    ],
    correctKey: "B",
    rewards: { gold: 15000, troops: 800, food: 500, faith: 20 },
    penalties: { troops: 350, food: 250 },
  },
  {
    id: 4,
    title: "TEST: OLTIN O'RDA",
    question: "AMIR TEMUR OLTIN O'RDA XONI TO'XTAMISHNI QAYSI JANGDA MAG'LUB QILGAN?",
    options: [
      { key: "A", label: "Anqara jangi" },
      { key: "B", label: "Dehli jangi" },
      { key: "C", label: "Kondurcha jangi" },
      { key: "D", label: "Aleppo jangi" },
    ],
    correctKey: "C",
    rewards: { gold: 8000, troops: 400, food: 250, faith: 12 },
    penalties: { troops: 250, food: 180 },
  },
  {
    id: 5,
    title: "TEST: IMPERIYA QURILISHI",
    question: "TEMUR IMPERIYASINING ENG KENG HUDUDLARI QAYSI MINTAQALARNI QO'Z TUTGAN?",
    options: [
      { key: "A", label: "Faqat Movarounnahr" },
      { key: "B", label: "Markaziy Osiyo va Eron" },
      { key: "C", label: "Turkiyadan Hindistongacha" },
      { key: "D", label: "Faqat Xuroson" },
    ],
    correctKey: "C",
    rewards: { gold: 12000, troops: 600, food: 400, faith: 25 },
    penalties: { troops: 300, food: 200 },
  },
];

type AnswerState = "idle" | "correct" | "wrong";

interface QuizPanelProps {
  onCityConquered?: (cityKey: string) => void;
}

const QuizPanel = ({ onCityConquered }: QuizPanelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>("B");
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [showDefeat, setShowDefeat] = useState(false);
  const [currentBattleKey, setCurrentBattleKey] = useState<string | null>(null);
  const [conqueredCities, setConqueredCities] = useState<{ key: string; name: string }[]>([]);

  const { addResources, subtractResources, conquerCity, addNotification } = useGame();

  const current = questions[currentIndex];

  const advanceToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswerState("idle");
    } else {
      setIsFinished(true);
    }
  }, [currentIndex]);

  const handleBattleComplete = useCallback(() => {
    setShowBattle(false);
    setCurrentBattleKey(null);
    advanceToNext();
  }, [advanceToNext]);

  const handleDefeatComplete = useCallback(() => {
    setShowDefeat(false);
    advanceToNext();
  }, [advanceToNext]);

  const handleConfirm = useCallback(() => {
    if (!selected || answerState !== "idle") return;

    const isCorrect = selected === current.correctKey;
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (isCorrect) {
        // Victory: battle animation + rewards
        const battleKey = questionBattleMap[currentIndex] || "baghdad";
        setCurrentBattleKey(battleKey);
        setShowBattle(true);

        addResources(current.rewards);
        conquerCity(battleKey);
        onCityConquered?.(battleKey);

        const battle = battleMap[battleKey];
        if (battle) {
          setConqueredCities((prev) => [...prev, { key: battleKey, name: battle.cityName }]);
          addNotification(
            `⚔ ${battle.cityName} zabt etildi! +${current.rewards.gold} oltin, +${current.rewards.troops} askar`,
            "victory"
          );
        }
      } else {
        // Defeat: defeat animation + penalties
        subtractResources({ troops: current.penalties.troops, food: current.penalties.food });
        addNotification(
          `💀 Xato taktika! ${current.penalties.troops} askar halok bo'ldi, oziq-ovqat zaxirasi kamaydi!`,
          "defeat"
        );
        setShowDefeat(true);
      }
    }, 1200);
  }, [selected, answerState, current, currentIndex, onCityConquered, addResources, subtractResources, conquerCity, addNotification]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setAnswerState("idle");
    setScore(0);
    setIsFinished(false);
    setShowBattle(false);
    setShowDefeat(false);
    setCurrentBattleKey(null);
    setConqueredCities([]);
  };

  const getOptionStyle = (key: string) => {
    if (answerState === "idle") {
      return selected === key
        ? "gold-border"
        : "border border-border hover:translate-x-1 hover:bg-muted/50";
    }
    if (key === current.correctKey) return "border border-confirm bg-confirm/10";
    if (key === selected && answerState === "wrong") return "border border-destructive bg-destructive/10";
    return "border border-border opacity-50";
  };

  return (
    <>
      {/* Battle Sequence Overlay */}
      <AnimatePresence>
        {showBattle && currentBattleKey && battleMap[currentBattleKey] && (
          <BattleSequence battle={battleMap[currentBattleKey]} onComplete={handleBattleComplete} />
        )}
      </AnimatePresence>

      {/* Defeat Sequence Overlay */}
      <AnimatePresence>
        {showDefeat && (
          <DefeatSequence
            onComplete={handleDefeatComplete}
            troopsLost={current.penalties.troops}
            foodLost={current.penalties.food}
          />
        )}
      </AnimatePresence>

      {/* Quiz Panel */}
      {!showBattle && !showDefeat && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="glass-panel w-[380px] p-5 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold tracking-widest gold-text uppercase">
              {current.title}
            </h3>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i < currentIndex ? "bg-confirm" : i === currentIndex ? "bg-gold" : "bg-muted"
                }`}
              />
            ))}
            <span className="font-mono-data text-xs text-muted-foreground ml-1">
              {score}/{questions.length}
            </span>
          </div>

          {/* Reward preview */}
          {!isFinished && (
            <div className="flex items-center gap-3 text-[10px] font-mono-data text-muted-foreground">
              <span className="text-gold">🏆 +{current.rewards.gold} oltin</span>
              <span className="text-timurid">⚔ +{current.rewards.troops} askar</span>
            </div>
          )}

          {/* Conquered badges */}
          {conqueredCities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {conqueredCities.map((c) => (
                <span
                  key={c.key}
                  className="text-[10px] font-mono-data px-2 py-0.5 rounded-sm bg-timurid/10 text-timurid border border-timurid/30"
                >
                  ⚔ {c.name}
                </span>
              ))}
            </div>
          )}

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {!isFinished ? (
                <>
                  <p className="font-ui text-sm font-medium leading-relaxed text-foreground mb-4" style={{ textWrap: "balance" }}>
                    {current.question}
                  </p>

                  <div className="flex flex-col gap-2">
                    {current.options.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => answerState === "idle" && setSelected(opt.key)}
                        disabled={answerState !== "idle"}
                        className={`glass-panel-inner flex items-center gap-3 px-4 py-3 text-left text-sm font-ui transition-all duration-150 ${getOptionStyle(opt.key)}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            answerState !== "idle" && opt.key === current.correctKey
                              ? "border-confirm"
                              : answerState === "wrong" && opt.key === selected
                              ? "border-destructive"
                              : selected === opt.key
                              ? "border-gold"
                              : "border-muted-foreground"
                          }`}
                        >
                          {answerState !== "idle" && opt.key === current.correctKey && (
                            <CheckCircle2 size={12} className="text-confirm" />
                          )}
                          {answerState === "wrong" && opt.key === selected && (
                            <XCircle size={12} className="text-destructive" />
                          )}
                          {answerState === "idle" && selected === opt.key && (
                            <span className="w-2 h-2 rounded-full bg-gold" />
                          )}
                        </span>
                        <span className="text-foreground">
                          {opt.key}) {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirm}
                    disabled={!selected || answerState !== "idle"}
                    className={`w-full py-3 mt-4 rounded-md font-ui font-bold text-sm tracking-wider uppercase transition-all duration-200 ${
                      selected && answerState === "idle"
                        ? "bg-confirm text-foreground hover:brightness-110 cursor-pointer"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    TASDIQLASH
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                    <CheckCircle2 size={48} className="text-gold" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold gold-text">
                    {score >= 4 ? "G'ALABA!" : score >= 2 ? "YAXSHI URINISH!" : "QAYTA URINIB KO'RING"}
                  </h3>
                  <p className="font-mono-data text-2xl text-foreground">{score} / {questions.length}</p>

                  {conqueredCities.length > 0 && (
                    <div className="w-full glass-panel-inner p-3 rounded-lg">
                      <p className="font-ui text-xs text-muted-foreground mb-2 uppercase tracking-wider">Zabt etilgan shaharlar:</p>
                      <div className="flex flex-wrap gap-1">
                        {conqueredCities.map((c) => (
                          <span key={c.key} className="text-xs font-mono-data px-2 py-1 rounded bg-timurid/15 text-timurid border border-timurid/30">
                            🏴 {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleRestart}
                    className="w-full py-3 mt-2 rounded-md bg-confirm text-foreground font-ui font-bold text-sm tracking-wider uppercase hover:brightness-110 transition-all duration-200"
                  >
                    QAYTA BOSHLASH
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
};

export default QuizPanel;
