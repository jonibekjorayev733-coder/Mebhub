import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

const NotificationPanel = () => {
  const { notifications, dismissNotification } = useGame();

  // Show last 4 notifications
  const visible = notifications.slice(-4);

  return (
    <div className="fixed left-4 bottom-24 z-[60] flex flex-col gap-2 w-[340px]">
      <AnimatePresence>
        {visible.map((n) => (
          <motion.div
            key={n.id}
            className={`glass-panel p-3 flex items-start gap-2 border ${
              n.type === "victory"
                ? "border-confirm/40"
                : n.type === "defeat"
                ? "border-destructive/40"
                : n.type === "warning"
                ? "border-gold/40"
                : "border-border"
            }`}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <p className="font-ui text-xs text-foreground flex-1 leading-relaxed">
              {n.message}
            </p>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
