import { X } from "lucide-react";

const events = [
  "Dynamic event baanmis: mamisian kaiman kamodessa.",
  "Dynamic event sishlindan 'Timur's Empire'.",
  "Dynamic event baanims baamndi.",
];

const EventsPanel = () => {
  return (
    <div className="glass-panel w-[240px] p-3 flex flex-col gap-2">
      {events.map((evt, i) => (
        <div key={i} className="flex items-start gap-2 text-xs font-ui text-muted-foreground">
          <span className="flex-1">{evt}</span>
          <button className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5">
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventsPanel;
