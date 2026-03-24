import { ArrowRight, Hammer, ScrollText } from "lucide-react";

interface ActionBarProps {
  onDiplomacy?: () => void;
}

const actions = [
  { icon: ArrowRight, label: "Move", actionKey: "move" },
  { icon: Hammer, label: "Build", actionKey: "build" },
  { icon: ScrollText, label: "Diplomacy", actionKey: "diplomacy" },
];

const ActionBar = ({ onDiplomacy }: ActionBarProps) => {
  const handleClick = (actionKey: string) => {
    if (actionKey === "diplomacy") onDiplomacy?.();
  };

  return (
    <div className="flex items-center gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => handleClick(action.actionKey)}
          className="glass-panel flex flex-col items-center gap-1 px-5 py-3 hover:scale-110 transition-transform duration-200"
          style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)" }}
        >
          <action.icon size={22} className="text-timurid" />
          <span className="text-[10px] font-ui font-semibold text-foreground tracking-wider uppercase">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ActionBar;
