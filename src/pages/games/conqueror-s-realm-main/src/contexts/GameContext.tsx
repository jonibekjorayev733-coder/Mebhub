import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

export interface GameResources {
  gold: number;
  troops: number;
  food: number;
  faith: number;
}

export interface Notification {
  id: string;
  message: string;
  type: "victory" | "defeat" | "warning" | "info";
  timestamp: number;
}

interface GameState {
  resources: GameResources;
  conqueredCities: string[];
  notifications: Notification[];
  isGameOver: boolean;
}

interface GameContextType extends GameState {
  addResources: (rewards: Partial<GameResources>) => void;
  subtractResources: (penalties: Partial<GameResources>) => void;
  conquerCity: (cityKey: string) => void;
  addNotification: (message: string, type: Notification["type"]) => void;
  dismissNotification: (id: string) => void;
  resetGame: () => void;
}

const initialResources: GameResources = {
  gold: 2000,
  troops: 1395,
  food: 800,
  faith: 50,
};

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [resources, setResources] = useState<GameResources>(initialResources);
  const [conqueredCities, setConqueredCities] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const foodTimerRef = useRef<number>();

  // Food consumption: troops die when food is 0
  useEffect(() => {
    foodTimerRef.current = window.setInterval(() => {
      setResources((prev) => {
        if (prev.food <= 0 && prev.troops > 0) {
          const troopLoss = Math.min(50, prev.troops);
          if (troopLoss > 0) {
            setNotifications((n) => [
              ...n,
              {
                id: crypto.randomUUID(),
                message: `⚠ Ochlik! ${troopLoss} askar halok bo'ldi!`,
                type: "warning",
                timestamp: Date.now(),
              },
            ]);
          }
          const newTroops = Math.max(0, prev.troops - troopLoss);
          if (newTroops <= 0) setIsGameOver(true);
          return { ...prev, troops: newTroops };
        }
        // Consume food over time
        if (prev.food > 0) {
          return { ...prev, food: Math.max(0, prev.food - 5) };
        }
        return prev;
      });
    }, 10000);

    return () => clearInterval(foodTimerRef.current);
  }, []);

  const addResources = useCallback((rewards: Partial<GameResources>) => {
    setResources((prev) => ({
      gold: prev.gold + (rewards.gold || 0),
      troops: prev.troops + (rewards.troops || 0),
      food: prev.food + (rewards.food || 0),
      faith: prev.faith + (rewards.faith || 0),
    }));
  }, []);

  const subtractResources = useCallback((penalties: Partial<GameResources>) => {
    setResources((prev) => ({
      gold: Math.max(0, prev.gold - (penalties.gold || 0)),
      troops: Math.max(0, prev.troops - (penalties.troops || 0)),
      food: Math.max(0, prev.food - (penalties.food || 0)),
      faith: Math.max(0, prev.faith - (penalties.faith || 0)),
    }));
  }, []);

  const conquerCity = useCallback((cityKey: string) => {
    setConqueredCities((prev) => [...new Set([...prev, cityKey])]);
  }, []);

  const addNotification = useCallback((message: string, type: Notification["type"]) => {
    setNotifications((prev) => [
      ...prev,
      { id: crypto.randomUUID(), message, type, timestamp: Date.now() },
    ]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const resetGame = useCallback(() => {
    setResources(initialResources);
    setConqueredCities([]);
    setNotifications([]);
    setIsGameOver(false);
  }, []);

  return (
    <GameContext.Provider
      value={{
        resources,
        conqueredCities,
        notifications,
        isGameOver,
        addResources,
        subtractResources,
        conquerCity,
        addNotification,
        dismissNotification,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
