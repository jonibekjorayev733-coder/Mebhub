import { X, Swords, MapPin } from "lucide-react";

const MissionsPanel = () => {
  return (
    <div className="glass-panel w-[220px] p-3 flex flex-col gap-2">
      <div className="font-display text-xs font-bold tracking-widest gold-text uppercase">
        MISIONLAR
      </div>
      <div className="flex items-center justify-between text-xs font-mono-data text-muted-foreground">
        <div className="flex items-center gap-1">
          <X size={10} />
          <span>3</span>
        </div>
        <div className="flex items-center gap-1">
          <Swords size={10} />
          <span>5</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={10} />
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default MissionsPanel;
