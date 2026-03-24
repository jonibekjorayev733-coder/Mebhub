import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Coins, AlertTriangle } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

interface State {
  name: string;
  goldTribute: number;
  rebellionChance: number;
  demanded: boolean;
}

const initialStates: State[] = [
  { name: "Xorazm", goldTribute: 500, rebellionChance: 10, demanded: false },
  { name: "Eron", goldTribute: 800, rebellionChance: 20, demanded: false },
  { name: "Shom (Suriya)", goldTribute: 600, rebellionChance: 15, demanded: false },
  { name: "Gurjiston", goldTribute: 300, rebellionChance: 25, demanded: false },
];

interface DiplomacyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiplomacyPanel = ({ isOpen, onClose }: DiplomacyPanelProps) => {
  const { addResources, subtractResources, addNotification } = useGame();
  const [states, setStates] = useState(initialStates);

  const handleDemandTribute = (index: number) => {
    const state = states[index];
    if (state.demanded) return;

    const rebellion = Math.random() * 100 < state.rebellionChance;

    if (rebellion) {
      subtractResources({ troops: 200, food: 100 });
      addNotification(
        `⚠ ${state.name} isyon ko'tardi! 200 askar va 100 oziq-ovqat yo'qotildi!`,
        "defeat"
      );
    } else {
      addResources({ gold: state.goldTribute });
      addNotification(
        `💰 ${state.name}dan ${state.goldTribute} oltin o'lja olindi!`,
        "victory"
      );
    }

    setStates((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, demanded: true, rebellionChance: Math.min(90, s.rebellionChance + 15) }
          : s
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative glass-panel w-[420px] p-6 z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold gold-text uppercase tracking-widest flex items-center gap-2">
                <Crown size={18} className="text-gold" />
                DIPLOMATIYA
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <p className="font-ui text-xs text-muted-foreground mb-4">
              Zabt etilmagan davlatlardan o'lja talab qiling. Ehtiyot bo'ling — haddan tashqari talab isyonga olib kelishi mumkin!
            </p>

            <div className="flex flex-col gap-3">
              {states.map((state, i) => (
                <div
                  key={state.name}
                  className={`glass-panel-inner p-3 flex items-center justify-between ${
                    state.demanded ? "opacity-50" : ""
                  }`}
                >
                  <div>
                    <p className="font-ui text-sm font-semibold text-foreground">{state.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs font-mono-data text-gold">
                        <Coins size={10} /> +{state.goldTribute}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-mono-data text-destructive">
                        <AlertTriangle size={10} /> {state.rebellionChance}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDemandTribute(i)}
                    disabled={state.demanded}
                    className={`px-3 py-1.5 rounded-md font-ui text-xs font-bold uppercase tracking-wider transition-all ${
                      state.demanded
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30"
                    }`}
                  >
                    {state.demanded ? "Talab qilingan" : "Talab qilish"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiplomacyPanel;
