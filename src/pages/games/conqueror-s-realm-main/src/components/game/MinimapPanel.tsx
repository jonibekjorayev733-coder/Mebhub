import minimapImg from "@/assets/minimap.png";

const MinimapPanel = () => {
  return (
    <div className="glass-panel p-1 w-[180px]">
      <div className="font-display text-[10px] font-bold tracking-widest gold-text uppercase px-2 py-1">
        XARITA QATLAMLARI
      </div>
      <div className="rounded-lg overflow-hidden border border-border">
        <img src={minimapImg} alt="Minimap" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default MinimapPanel;
