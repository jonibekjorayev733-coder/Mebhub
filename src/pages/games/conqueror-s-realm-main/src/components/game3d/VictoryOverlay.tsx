import { useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

interface VictoryOverlayProps {
  cityName: string;
  year: string;
  onComplete: () => void;
}

const VictoryOverlay = ({ cityName, year, onComplete }: VictoryOverlayProps) => {
  useEffect(() => {
    // Victory fanfare
    try {
      const ctx = new AudioContext();
      const notes = [440, 550, 660, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
        g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.2 + 0.05);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.2 + 0.5);
        osc.connect(g).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.5);
      });
    } catch {}

    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle, hsla(185, 100%, 50%, 0.15), transparent 60%)" }}
        animate={{ opacity: [0, 1, 0.6] }}
        transition={{ duration: 1.5 }}
      />

      {/* Particle burst */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold"
            style={{ left: "50%", top: "50%" }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * 200,
              y: Math.sin(angle) * 200,
              opacity: 0,
              scale: [1, 0.3],
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />
        );
      })}

      <motion.div
        className="relative z-10 text-center flex flex-col items-center gap-4"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown size={72} className="text-gold" />
        </motion.div>

        <h2
          className="font-display text-6xl font-extrabold tracking-wider"
          style={{
            background: "linear-gradient(135deg, hsl(45, 80%, 70%), hsl(45, 80%, 45%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 20px hsla(45, 80%, 55%, 0.5))",
          }}
        >
          {cityName} ZABT ETILDI!
        </h2>

        <p className="font-mono-data text-timurid tracking-[0.3em]">{year}-YIL</p>

        <motion.p
          className="font-ui text-foreground text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          🏴 Temur imperiyasi kengaymoqda!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default VictoryOverlay;
