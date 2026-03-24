import { motion, AnimatePresence } from "framer-motion";
import { Coins, Sword, Wheat, HandHelping, Shield, Map, Crown, Crosshair } from "lucide-react";
import type { City, Army } from "./types";

interface GameHUDProps {
  resources: { gold: number; troops: number; food: number; faith: number };
  selectedArmy: Army | null;
  conqueredCount: number;
  totalCities: number;
  onDeselectArmy: () => void;
  notifications: { id: string; message: string; type: string }[];
  onDismissNotification: (id: string) => void;
}

const AnimatedNumber = ({ value }: { value: number }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={value}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 8, opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {value.toLocaleString()}
    </motion.span>
  </AnimatePresence>
);

const GameHUD = ({
  resources,
  selectedArmy,
  conqueredCount,
  totalCities,
  onDeselectArmy,
  notifications,
  onDismissNotification,
}: GameHUDProps) => {
  return (
    <>
      {/* Top resource bar */}
      <div className="absolute top-4 left-4 z-20 glass-panel px-5 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2 font-mono-data text-sm">
          <Coins size={14} className="text-gold" />
          <AnimatedNumber value={resources.gold} />
        </div>
        <div className="flex items-center gap-2 font-mono-data text-sm">
          <Sword size={14} className="text-timurid" />
          <AnimatedNumber value={resources.troops} />
        </div>
        <div className="flex items-center gap-2 font-mono-data text-sm">
          <Wheat size={14} className="text-secondary" />
          <span className={resources.food <= 0 ? "text-destructive" : ""}>
            <AnimatedNumber value={resources.food} />
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono-data text-sm">
          <HandHelping size={14} className="text-muted-foreground" />
          <AnimatedNumber value={resources.faith} />
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 font-mono-data text-sm text-gold">
          <Crown size={14} />
          <span>{conqueredCount}/{totalCities}</span>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <h1
          className="font-display text-2xl font-extrabold tracking-wider uppercase"
          style={{
            background: "linear-gradient(135deg, hsl(45, 80%, 65%), hsl(45, 80%, 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 8px hsla(45, 80%, 55%, 0.3))",
          }}
        >
          AMIR TEMUR: YER SULTONI
        </h1>
      </div>

      {/* Selected army info */}
      <AnimatePresence>
        {selectedArmy && (
          <motion.div
            className="absolute bottom-4 left-4 z-20 glass-panel p-4 w-[260px]"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold gold-text uppercase tracking-wider">
                {selectedArmy.faction === "timurid" ? "TEMUR QO'SHINI" : "DUSHMAN QO'SHINI"}
              </h3>
              <button onClick={onDeselectArmy} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono-data text-xs">
              <div className="flex items-center gap-1.5">
                <Sword size={12} className="text-timurid" />
                <span>{selectedArmy.troops.toLocaleString()} askar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-gold" />
                <span>{selectedArmy.type}</span>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-destructive">❤</span>
                  <span>{selectedArmy.health}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${selectedArmy.health}%`,
                      background: selectedArmy.health > 50
                        ? "hsl(var(--confirm-green))"
                        : selectedArmy.health > 25
                        ? "hsl(var(--gold-accent))"
                        : "hsl(var(--destructive))",
                    }}
                  />
                </div>
              </div>
            </div>

            {selectedArmy.faction === "timurid" && (
              <p className="text-xs font-ui text-muted-foreground mt-3">
                <Crosshair size={10} className="inline mr-1" />
                Xaritaga bosib qo'shinni yuboring
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 max-w-[300px]">
        <AnimatePresence>
          {notifications.slice(-4).map((n) => (
            <motion.div
              key={n.id}
              className={`glass-panel px-4 py-2 text-xs font-ui border-l-2 ${
                n.type === "victory"
                  ? "border-l-timurid"
                  : n.type === "defeat"
                  ? "border-l-destructive"
                  : "border-l-gold"
              }`}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              onClick={() => onDismissNotification(n.id)}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="glass-panel px-4 py-2 font-ui text-[10px] text-muted-foreground flex items-center gap-4">
          <span>🖱 Aylantirish: Sichqoncha o'ng</span>
          <span>🔍 Kattalashtirish: Scroll</span>
          <span>⚔ Qo'shinni tanlash: Bosish</span>
          <span>📍 Yuboring: Xaritaga bosing</span>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 z-20 glass-panel p-2 w-[160px]">
        <div className="font-display text-[9px] font-bold tracking-widest gold-text uppercase px-1 mb-1">
          XARITA
        </div>
        <div className="relative w-full h-[120px] bg-muted/30 rounded-sm overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Map size={40} className="text-muted-foreground/20" />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameHUD;
