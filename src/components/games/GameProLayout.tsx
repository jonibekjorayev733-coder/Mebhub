import { ReactNode } from "react";

const GAME_PRO_STYLES = `
  @keyframes gameProFloat {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    33% { transform: translate(10px, -15px) scale(1.05); opacity: 0.8; }
    66% { transform: translate(-5px, 10px) scale(0.95); opacity: 0.7; }
  }
  @keyframes gameProPulse {
    0%, 100% { box-shadow: 0 0 40px -10px rgba(255,255,255,0.08), 0 0 80px -20px rgba(255,255,255,0.04); }
    50% { box-shadow: 0 0 60px -10px rgba(255,255,255,0.12), 0 0 100px -20px rgba(255,255,255,0.06); }
  }
  @keyframes gameProShine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes gameProGrid {
    0% { opacity: 0.3; }
    50% { opacity: 0.5; }
    100% { opacity: 0.3; }
  }
  .game-pro-bg {
    background: #050508;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
  }
  .game-pro-bg::before {
    content: "";
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,255,255,0.04) 0%, transparent 50%),
      radial-gradient(ellipse 60% 80% at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 50%),
      radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
  .game-pro-bg::after {
    content: "";
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
    animation: gameProGrid 8s ease-in-out infinite;
  }
  .game-pro-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: gameProFloat 15s ease-in-out infinite;
  }
  .game-pro-card {
    position: relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 1.5rem;
    backdrop-filter: blur(24px);
    box-shadow: 
      inset 0 1px 0 0 rgba(255,255,255,0.06),
      0 0 40px -10px rgba(255,255,255,0.06),
      0 25px 50px -12px rgba(0,0,0,0.5);
    animation: gameProPulse 4s ease-in-out infinite;
  }
  .game-pro-card::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .game-pro-card:hover {
    border-color: rgba(255,255,255,0.12);
    box-shadow: 
      inset 0 1px 0 0 rgba(255,255,255,0.1),
      0 0 60px -10px rgba(255,255,255,0.1),
      0 30px 60px -15px rgba(0,0,0,0.6);
  }
  .game-pro-btn {
    position: relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%);
    border: 1px solid rgba(255,255,255,0.15);
    color: white;
    font-weight: 700;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 0 30px -5px rgba(255,255,255,0.1);
  }
  .game-pro-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%);
    background-size: 200% 100%;
    animation: gameProShine 3s ease-in-out infinite;
  }
  .game-pro-btn:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.1) 100%);
    border-color: rgba(255,255,255,0.25);
    transform: translateY(-2px);
    box-shadow: 0 0 50px -5px rgba(255,255,255,0.2);
  }
  .game-pro-title {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900;
    background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 80px rgba(255,255,255,0.3);
  }
`;

interface GameProLayoutProps {
  children: ReactNode;
  accentColor?: "white" | "amber" | "emerald" | "cyan" | "purple";
}

export default function GameProLayout({ children, accentColor = "white" }: GameProLayoutProps) {
  const orbColors = {
    white: "bg-white/8",
    amber: "bg-amber-500/10",
    emerald: "bg-emerald-500/10",
    cyan: "bg-cyan-500/10",
    purple: "bg-purple-500/10",
  };
  const color = orbColors[accentColor];

  return (
    <div className="game-pro-bg">
      <style>{GAME_PRO_STYLES}</style>
      <div className={`game-pro-orb w-[400px] h-[400px] top-[10%] left-[5%] ${color}`} style={{ animationDelay: "0s" }} />
      <div className={`game-pro-orb w-[500px] h-[500px] bottom-[10%] right-[5%] ${color}`} style={{ animationDelay: "-5s" }} />
      <div className={`game-pro-orb w-[300px] h-[300px] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 ${color}`} style={{ animationDelay: "-10s" }} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export { GAME_PRO_STYLES };
