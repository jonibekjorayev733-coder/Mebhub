import { Coins, Sword, HandHelping, Target, MapPin, Crown } from "lucide-react";
import temurPortrait from "@/assets/temur-portrait.png";

const CharacterPanel = () => {
  return (
    <div className="glass-panel w-[200px] p-3 flex flex-col gap-3">
      {/* Portrait */}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
          <img src={temurPortrait} alt="Temur" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-display text-sm font-bold text-foreground">TEMUR</div>
          <div className="flex gap-2 mt-1">
            <Crown size={14} className="text-gold" />
            <Crown size={14} className="text-gold" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-1 text-xs font-mono-data">
        <div className="flex items-center gap-1">
          <Coins size={12} className="text-gold" />
          <span className="text-foreground">20</span>
        </div>
        <div className="flex items-center gap-1">
          <Sword size={12} className="text-timurid" />
          <span className="text-foreground">195</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-destructive">❤</span>
          <span className="text-foreground">33</span>
        </div>
        <div className="flex items-center gap-1">
          <HandHelping size={12} className="text-secondary" />
          <span className="text-foreground">12</span>
        </div>
        <div className="flex items-center gap-1 col-span-2">
          <Crown size={12} className="text-gold" />
          <span className="text-foreground">30</span>
        </div>
      </div>

      {/* Resources bottom */}
      <div className="flex items-center gap-3 text-xs font-mono-data border-t border-border pt-2 mt-1">
        <div className="flex items-center gap-1">
          <Coins size={11} className="text-gold" />
          <span>78</span>
        </div>
        <div className="flex items-center gap-1">
          <Sword size={11} className="text-timurid" />
          <span>190</span>
        </div>
        <div className="flex items-center gap-1">
          <HandHelping size={11} className="text-secondary" />
          <span>25</span>
        </div>
        <div className="flex items-center gap-1">
          <Crown size={11} className="text-gold" />
          <span>150</span>
        </div>
      </div>

      {/* Missions */}
      <div className="border-t border-border pt-2">
        <div className="font-display text-xs font-bold tracking-widest gold-text uppercase mb-2">
          MISIONLAR
        </div>
        <div className="flex flex-col gap-1.5 text-xs font-ui text-muted-foreground">
          <div className="flex items-center gap-2">
            <Target size={12} className="text-timurid" />
            <span>Samarqand kitsfiega</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-gold" />
            <span>Kirradsimsu lismengi</span>
          </div>
          <div className="flex items-center gap-2">
            <Sword size={12} className="text-secondary" />
            <span>Karakliana enangi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPanel;
