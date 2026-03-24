import { Coins, Sword, HandHelping, Wheat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

const AnimatedNumber = ({ value, color }: { value: number; color: string }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={value}
      className={`text-foreground ${color}`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value.toLocaleString()}
    </motion.span>
  </AnimatePresence>
);

const ResourceBar = () => {
  const { resources } = useGame();

  return (
    <div className="glass-panel px-4 py-2 flex items-center gap-6">
      <div className="flex items-center gap-2 font-mono-data text-sm">
        <Coins size={14} className="text-gold" />
        <AnimatedNumber value={resources.gold} color="" />
      </div>
      <div className="flex items-center gap-2 font-mono-data text-sm">
        <Sword size={14} className="text-timurid" />
        <AnimatedNumber value={resources.troops} color="" />
      </div>
      <div className="flex items-center gap-2 font-mono-data text-sm">
        <Wheat size={14} className="text-secondary" />
        <AnimatedNumber value={resources.food} color={resources.food <= 0 ? "text-destructive" : ""} />
      </div>
      <div className="flex items-center gap-2 font-mono-data text-sm">
        <HandHelping size={14} className="text-muted-foreground" />
        <AnimatedNumber value={resources.faith} color="" />
      </div>
    </div>
  );
};

export default ResourceBar;
