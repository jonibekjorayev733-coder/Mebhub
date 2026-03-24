import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cavalrySilhouette from "@/assets/cavalry-silhouette.png";
import timuridFlag from "@/assets/timurid-flag.png";
import { type BattleData } from "./battleData";

interface BattleSequenceProps {
  battle: BattleData;
  onComplete: () => void;
}

// Arrow particles for the battle scene
const ArrowParticle = ({ delay, startX, startY }: { delay: number; startX: number; startY: number }) => (
  <motion.div
    className="absolute w-[2px] h-6 bg-gold origin-bottom"
    style={{ left: `${startX}%`, top: `${startY}%`, rotate: "30deg" }}
    initial={{ opacity: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      x: [0, 200, 400],
      y: [0, -60, 20],
    }}
    transition={{ duration: 1.2, delay, ease: "easeOut" }}
  />
);

// Dust cloud particle
const DustCloud = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute bottom-[15%] rounded-full"
    style={{
      left: `${x}%`,
      width: size,
      height: size * 0.6,
      background: "radial-gradient(ellipse, hsla(35, 30%, 50%, 0.4), transparent)",
    }}
    initial={{ opacity: 0, scale: 0.3 }}
    animate={{ opacity: [0, 0.6, 0.3, 0], scale: [0.3, 1.5, 2], x: [0, 40, 80] }}
    transition={{ duration: 2, delay, ease: "easeOut" }}
  />
);

// Spark/ember particle
const Spark = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gold"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      scale: [0, 1.5, 0.5],
      y: [0, -40 - Math.random() * 60],
      x: [0, (Math.random() - 0.5) * 40],
    }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
  />
);

const BattleSequence = ({ battle, onComplete }: BattleSequenceProps) => {
  const [phase, setPhase] = useState<"zoom" | "charge" | "impact" | "victory" | "flag">("zoom");
  const audioRef = useRef<{ swords?: HTMLAudioElement; cry?: HTMLAudioElement }>({});
  const timerRef = useRef<number>();

  // Generate particles
  const arrows = Array.from({ length: 12 }, (_, i) => ({
    delay: 0.8 + i * 0.15,
    startX: 10 + i * 4,
    startY: 30 + Math.random() * 20,
  }));

  const dustClouds = Array.from({ length: 8 }, (_, i) => ({
    delay: 0.3 + i * 0.2,
    x: 5 + i * 10,
    size: 60 + Math.random() * 80,
  }));

  const sparks = Array.from({ length: 20 }, (_, i) => ({
    delay: 2.0 + Math.random() * 0.5,
    x: 40 + Math.random() * 30,
    y: 40 + Math.random() * 20,
  }));

  // Generate and play audio effects using Web Audio API
  const playBattleSounds = useCallback(() => {
    try {
      const ctx = new AudioContext();

      // Sword clash - metallic noise burst
      const clashBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const clashData = clashBuffer.getChannelData(0);
      for (let i = 0; i < clashData.length; i++) {
        const t = i / ctx.sampleRate;
        clashData[i] = (Math.random() * 2 - 1) * Math.exp(-t * 15) * 0.4;
      }
      const clashSrc = ctx.createBufferSource();
      clashSrc.buffer = clashBuffer;
      const clashFilter = ctx.createBiquadFilter();
      clashFilter.type = "highpass";
      clashFilter.frequency.value = 2000;
      clashSrc.connect(clashFilter).connect(ctx.destination);
      clashSrc.start(ctx.currentTime + 2.0);

      // War horn - low frequency sweep
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 1);
      const hornGain = ctx.createGain();
      hornGain.gain.setValueAtTime(0, ctx.currentTime);
      hornGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
      hornGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      osc.connect(hornGain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);

      // Battle cry - rough noise
      const cryBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
      const cryData = cryBuffer.getChannelData(0);
      for (let i = 0; i < cryData.length; i++) {
        const t = i / ctx.sampleRate;
        cryData[i] = (Math.random() * 2 - 1) * Math.sin(t * 300) * Math.exp(-t * 3) * 0.2;
      }
      const crySrc = ctx.createBufferSource();
      crySrc.buffer = cryBuffer;
      const cryFilter = ctx.createBiquadFilter();
      cryFilter.type = "bandpass";
      cryFilter.frequency.value = 800;
      crySrc.connect(cryFilter).connect(ctx.destination);
      crySrc.start(ctx.currentTime + 1.8);

      // Impact thud
      const impactOsc = ctx.createOscillator();
      impactOsc.type = "sine";
      impactOsc.frequency.setValueAtTime(80, ctx.currentTime + 2.0);
      impactOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 2.3);
      const impactGain = ctx.createGain();
      impactGain.gain.setValueAtTime(0.3, ctx.currentTime + 2.0);
      impactGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      impactOsc.connect(impactGain).connect(ctx.destination);
      impactOsc.start(ctx.currentTime + 2.0);
      impactOsc.stop(ctx.currentTime + 2.5);

      // Victory fanfare
      const fanfare = ctx.createOscillator();
      fanfare.type = "triangle";
      fanfare.frequency.setValueAtTime(440, ctx.currentTime + 3.5);
      fanfare.frequency.setValueAtTime(550, ctx.currentTime + 3.8);
      fanfare.frequency.setValueAtTime(660, ctx.currentTime + 4.1);
      const fanfareGain = ctx.createGain();
      fanfareGain.gain.setValueAtTime(0, ctx.currentTime + 3.5);
      fanfareGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3.7);
      fanfareGain.gain.setValueAtTime(0.15, ctx.currentTime + 4.5);
      fanfareGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 5.0);
      fanfare.connect(fanfareGain).connect(ctx.destination);
      fanfare.start(ctx.currentTime + 3.5);
      fanfare.stop(ctx.currentTime + 5.0);
    } catch (e) {
      // Audio might not be available
    }
  }, []);

  useEffect(() => {
    playBattleSounds();

    // Phase timeline
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase("charge"), 600));
    timers.push(window.setTimeout(() => setPhase("impact"), 2200));
    timers.push(window.setTimeout(() => setPhase("victory"), 3200));
    timers.push(window.setTimeout(() => setPhase("flag"), 4500));
    timers.push(window.setTimeout(() => onComplete(), 6000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, playBattleSounds]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background - battlefield image with zoom */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{
            scale: phase === "zoom" ? 1.3 : phase === "impact" ? 1.05 : 1,
            opacity: 1,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src={battle.background}
            alt={battle.battleName}
            className="w-full h-full object-cover"
          />
          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-background/40" />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, hsla(160, 20%, 4%, 0.8) 100%)",
            }}
          />
        </motion.div>

        {/* Letterbox bars for cinematic feel */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-background z-10"
          initial={{ height: 0 }}
          animate={{ height: 60 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-background z-10"
          initial={{ height: 0 }}
          animate={{ height: 60 }}
          transition={{ duration: 0.4 }}
        />

        {/* Dust clouds */}
        {(phase === "charge" || phase === "impact") &&
          dustClouds.map((d, i) => <DustCloud key={`dust-${i}`} {...d} />)
        }

        {/* Flying arrows */}
        {(phase === "charge" || phase === "impact") &&
          arrows.map((a, i) => <ArrowParticle key={`arrow-${i}`} {...a} />)
        }

        {/* Cavalry charge */}
        {(phase === "charge" || phase === "impact") && (
          <motion.div
            className="absolute bottom-[10%] z-20"
            initial={{ x: "-30%", opacity: 0 }}
            animate={{
              x: phase === "impact" ? "35%" : "15%",
              opacity: 1,
            }}
            transition={{
              duration: phase === "impact" ? 0.8 : 1.5,
              ease: phase === "impact" ? [0.1, 0, 0.2, 1] : "easeOut",
            }}
          >
            <motion.img
              src={cavalrySilhouette}
              alt="Cavalry charge"
              className="h-40 md:h-56 w-auto drop-shadow-2xl"
              style={{ filter: "brightness(0.1) drop-shadow(0 0 20px hsla(185, 100%, 50%, 0.3))" }}
              animate={
                phase === "impact"
                  ? { scale: [1, 1.1, 1], filter: "brightness(0.1) drop-shadow(0 0 40px hsla(45, 80%, 55%, 0.6))" }
                  : {}
              }
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}

        {/* Impact sparks */}
        {phase === "impact" && sparks.map((s, i) => <Spark key={`spark-${i}`} {...s} />)}

        {/* Slow-motion flash on impact */}
        {phase === "impact" && (
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            style={{ background: "radial-gradient(circle at 50% 50%, hsla(45, 80%, 55%, 0.5), transparent 70%)" }}
          />
        )}

        {/* Battle text overlay */}
        <motion.div
          className="absolute inset-x-0 top-[25%] z-40 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: phase !== "zoom" ? 1 : 0, y: phase !== "zoom" ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className="font-mono-data text-sm tracking-[0.4em] text-timurid uppercase mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {battle.year}-yil
          </motion.div>
          <motion.h2
            className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-wider text-center"
            style={{
              background: "linear-gradient(135deg, hsl(45, 80%, 65%), hsl(45, 80%, 45%), hsl(45, 80%, 65%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 4px 20px hsla(45, 80%, 55%, 0.4))",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
          >
            {battle.battleName}
          </motion.h2>
        </motion.div>

        {/* Description text */}
        {(phase === "charge" || phase === "impact" || phase === "victory") && (
          <motion.p
            className="absolute bottom-[12%] inset-x-0 z-40 text-center font-ui text-sm md:text-base text-foreground px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            style={{ textShadow: "0 2px 10px hsla(0, 0%, 0%, 0.8)" }}
          >
            {battle.description}
          </motion.p>
        )}

        {/* Victory phase */}
        {phase === "victory" && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Victory radial glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, hsla(185, 100%, 50%, 0.15), transparent 60%)",
              }}
              animate={{ opacity: [0, 1, 0.6] }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="text-center z-10"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
            >
              <h3
                className="font-display text-6xl md:text-8xl font-extrabold tracking-wider"
                style={{
                  background: "linear-gradient(135deg, hsl(45, 80%, 70%), hsl(45, 80%, 45%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 30px hsla(45, 80%, 55%, 0.5))",
                }}
              >
                G'ALABA!
              </h3>
            </motion.div>
          </motion.div>
        )}

        {/* Flag phase - Timurid flag plants */}
        {phase === "flag" && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* City conquered glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 60%, hsla(185, 100%, 50%, 0.2), transparent 50%)",
              }}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
            />

            {/* Fire effect that transforms to flag */}
            <div className="relative">
              {/* Fire embers fading out */}
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: `hsl(${25 + Math.random() * 20}, 90%, ${50 + Math.random() * 20}%)`,
                      left: (Math.random() - 0.5) * 100,
                    }}
                    animate={{
                      y: [0, -40 - Math.random() * 80],
                      opacity: [1, 0],
                      scale: [1, 0.3],
                    }}
                    transition={{ duration: 1 + Math.random(), delay: i * 0.05 }}
                  />
                ))}
              </motion.div>

              {/* Timurid flag rising */}
              <motion.img
                src={timuridFlag}
                alt="Timurid Flag"
                className="h-40 md:h-56 w-auto"
                initial={{ y: 100, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                style={{ filter: "drop-shadow(0 0 20px hsla(185, 100%, 50%, 0.4))" }}
              />
            </div>

            <motion.div
              className="absolute bottom-[15%] text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="font-display text-xl gold-text tracking-wider">
                {battle.cityName} zabt etildi!
              </p>
              <p className="font-ui text-sm text-timurid mt-2 tracking-widest uppercase">
                Temur imperiyasi kengaymoqda
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BattleSequence;
