import { useEffect } from "react";
import { motion } from "framer-motion";

interface DefeatSequenceProps {
  onComplete: () => void;
  troopsLost: number;
  foodLost: number;
}

const DefeatSequence = ({ onComplete, troopsLost, foodLost }: DefeatSequenceProps) => {
  useEffect(() => {
    // Play defeat sound
    try {
      const ctx = new AudioContext();
      // Low rumble
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 1.5);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2);

      // Impact
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 8) * 0.3;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      src.connect(filter).connect(ctx.destination);
      src.start(ctx.currentTime + 0.3);
    } catch {}

    const timer = window.setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dark sepia overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, hsla(25, 40%, 8%, 0.95), hsla(0, 30%, 5%, 0.95))",
        }}
      />

      {/* Blood-red vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, hsla(0, 60%, 15%, 0.6) 100%)",
        }}
      />

      {/* Falling shields / broken weapons particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: `${10 + Math.random() * 80}%`, top: "-10%" }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0.3],
            y: [0, 300 + Math.random() * 200],
            rotate: [0, 180 + Math.random() * 360],
          }}
          transition={{ duration: 2 + Math.random(), delay: i * 0.15, ease: "easeIn" }}
        >
          {["⚔", "🛡", "💀", "🗡"][i % 4]}
        </motion.div>
      ))}

      {/* Central defeat text */}
      <motion.div
        className="relative z-10 text-center flex flex-col items-center gap-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        <motion.h2
          className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-wider"
          style={{
            background: "linear-gradient(135deg, hsl(0, 70%, 50%), hsl(25, 80%, 40%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 20px hsla(0, 70%, 40%, 0.5))",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          MAG'LUBIYAT!
        </motion.h2>

        <motion.p
          className="font-ui text-lg text-destructive"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Xato taktika!
        </motion.p>

        <motion.div
          className="flex gap-6 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="glass-panel px-4 py-2 flex items-center gap-2 border border-destructive/50">
            <span className="text-destructive font-mono-data text-lg font-bold">-{troopsLost}</span>
            <span className="font-ui text-xs text-muted-foreground">Askar</span>
          </div>
          <div className="glass-panel px-4 py-2 flex items-center gap-2 border border-destructive/50">
            <span className="text-destructive font-mono-data text-lg font-bold">-{foodLost}</span>
            <span className="font-ui text-xs text-muted-foreground">Oziq-ovqat</span>
          </div>
        </motion.div>

        <motion.p
          className="font-ui text-sm text-muted-foreground max-w-md mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ textShadow: "0 2px 10px hsla(0, 0%, 0%, 0.8)" }}
        >
          Xato taktika! {troopsLost} askar halok bo'ldi, oziq-ovqat zaxirasi kamaydi!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default DefeatSequence;
