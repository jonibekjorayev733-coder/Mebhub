import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GameScene from "@/components/game3d/GameScene";
import GameHUD from "@/components/game3d/GameHUD";
import QuizOverlay from "@/components/game3d/QuizOverlay";
import VictoryOverlay from "@/components/game3d/VictoryOverlay";
import { initialCities, initialArmies, quizQuestions } from "@/components/game3d/gameData";
import type { City, Army, BattleEvent } from "@/components/game3d/types";

interface Notification {
  id: string;
  message: string;
  type: string;
}

const Index = () => {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [armies, setArmies] = useState<Army[]>(initialArmies);
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [activeBattle, setActiveBattle] = useState<BattleEvent | null>(null);
  const [siegeCity, setSiegeCity] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizCityId, setQuizCityId] = useState<string | null>(null);

  // Victory state
  const [victoryCity, setVictoryCity] = useState<City | null>(null);

  // Resources
  const [resources, setResources] = useState({
    gold: 5000,
    troops: 65000,
    food: 800,
    faith: 50,
  });

  const addNotification = useCallback((message: string, type: string) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Food consumption timer
  useEffect(() => {
    const timer = setInterval(() => {
      setResources((prev) => {
        if (prev.food <= 0 && prev.troops > 0) {
          const loss = Math.min(500, prev.troops);
          addNotification(`⚠ Ochlik! ${loss} askar halok bo'ldi!`, "warning");
          return { ...prev, troops: Math.max(0, prev.troops - loss) };
        }
        return { ...prev, food: Math.max(0, prev.food - 5) };
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [addNotification]);

  // Enemy AI patrol
  useEffect(() => {
    const timer = setInterval(() => {
      setArmies((prev) =>
        prev.map((army) => {
          if (army.faction !== "enemy" || army.inBattle || !army.patrolRoute) return army;
          const nextIdx = ((army.patrolIndex || 0) + 1) % army.patrolRoute.length;
          return {
            ...army,
            targetPosition: army.patrolRoute[nextIdx],
            patrolIndex: nextIdx,
          };
        })
      );
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Army movement - smooth update positions
  useEffect(() => {
    const timer = setInterval(() => {
      setArmies((prev) =>
        prev.map((army) => {
          if (!army.targetPosition || army.inBattle) return army;
          const dx = army.targetPosition[0] - army.position[0];
          const dz = army.targetPosition[2] - army.position[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 0.5) {
            return { ...army, position: army.targetPosition, targetPosition: null };
          }
          const step = Math.min(army.speed * 5, dist);
          return {
            ...army,
            position: [
              army.position[0] + (dx / dist) * step,
              0,
              army.position[2] + (dz / dist) * step,
            ],
          };
        })
      );
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Collision detection - check if timurid army is near enemy city
  useEffect(() => {
    const timer = setInterval(() => {
      if (quizActive || victoryCity) return;

      const timuridArmies = armies.filter((a) => a.faction === "timurid" && !a.inBattle);
      const unconqueredCities = cities.filter((c) => !c.conquered);

      for (const army of timuridArmies) {
        for (const city of unconqueredCities) {
          const dx = army.position[0] - city.position[0];
          const dz = army.position[2] - city.position[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 4) {
            // Trigger quiz for this city
            setQuizCityId(city.id);
            setQuizActive(true);
            setCameraTarget(city.position);
            setSiegeCity(city.id);
            addNotification(`⚔ ${city.name} muhosarasi boshlanmoqda!`, "info");
            return;
          }
        }
      }

      // Check army vs army collision
      for (const tArmy of timuridArmies) {
        const enemyArmies = armies.filter((a) => a.faction === "enemy" && !a.inBattle);
        for (const eArmy of enemyArmies) {
          const dx = tArmy.position[0] - eArmy.position[0];
          const dz = tArmy.position[2] - eArmy.position[2];
          if (Math.sqrt(dx * dx + dz * dz) < 3) {
            // Start battle
            setActiveBattle({
              attackerId: tArmy.id,
              defenderId: eArmy.id,
              position: tArmy.position as [number, number, number],
              phase: "fighting",
            });
            setArmies((prev) =>
              prev.map((a) =>
                a.id === tArmy.id || a.id === eArmy.id
                  ? { ...a, inBattle: true, targetPosition: null }
                  : a
              )
            );
            addNotification("⚔ Dushman qo'shini bilan jang boshlandi!", "info");

            // Resolve after 3 seconds
            setTimeout(() => {
              setArmies((prev) =>
                prev
                  .map((a) => {
                    if (a.id === tArmy.id) {
                      return { ...a, inBattle: false, health: Math.max(20, a.health - 25), troops: Math.max(1000, a.troops - 5000) };
                    }
                    return a;
                  })
                  .filter((a) => a.id !== eArmy.id) // Remove defeated enemy
              );
              setActiveBattle(null);
              setResources((r) => ({ ...r, gold: r.gold + 2000 }));
              addNotification(`⚔ Dushman qo'shini mag'lub bo'ldi! +2000 oltin`, "victory");
            }, 3000);
            return;
          }
        }
      }
    }, 500);
    return () => clearInterval(timer);
  }, [armies, cities, quizActive, victoryCity, addNotification]);

  const handleCityClick = useCallback((city: City) => {
    if (city.conquered) {
      addNotification(`${city.name} - Temur imperiyasi hududi`, "info");
      return;
    }
    setCameraTarget(city.position);
    // If we have a selected army, send it there
    if (selectedArmyId) {
      const army = armies.find((a) => a.id === selectedArmyId);
      if (army && army.faction === "timurid") {
        setArmies((prev) =>
          prev.map((a) =>
            a.id === selectedArmyId ? { ...a, targetPosition: city.position } : a
          )
        );
        addNotification(`Qo'shin ${city.name} tomon yo'lga chiqdi!`, "info");
      }
    }
  }, [selectedArmyId, armies, addNotification]);

  const handleArmyClick = useCallback((army: Army) => {
    if (army.faction === "timurid") {
      setArmies((prev) =>
        prev.map((a) => ({ ...a, selected: a.id === army.id }))
      );
      setSelectedArmyId(army.id);
      setCameraTarget(army.position as [number, number, number]);
    } else {
      addNotification(`Dushman: ${army.troops.toLocaleString()} askar, ${army.type}`, "info");
    }
  }, [addNotification]);

  const handleGroundClick = useCallback((point: [number, number, number]) => {
    if (selectedArmyId) {
      const army = armies.find((a) => a.id === selectedArmyId);
      if (army && army.faction === "timurid") {
        setArmies((prev) =>
          prev.map((a) =>
            a.id === selectedArmyId ? { ...a, targetPosition: point } : a
          )
        );
      }
    }
  }, [selectedArmyId, armies]);

  const handleDeselectArmy = useCallback(() => {
    setArmies((prev) => prev.map((a) => ({ ...a, selected: false })));
    setSelectedArmyId(null);
  }, []);

  const handleQuizResult = useCallback((correct: boolean) => {
    const cityId = quizCityId;
    if (!cityId) return;
    const city = cities.find((c) => c.id === cityId);

    if (correct) {
      // Conquer the city
      setCities((prev) =>
        prev.map((c) =>
          c.id === cityId ? { ...c, conquered: true, faction: "timurid" } : c
        )
      );
      setResources((r) => ({
        gold: r.gold + 10000,
        troops: r.troops + 5000,
        food: r.food + 300,
        faith: r.faith + 10,
      }));
      if (city) setVictoryCity(city);
    } else {
      // Penalty
      setResources((r) => ({
        ...r,
        troops: Math.max(0, r.troops - 5000),
        food: Math.max(0, r.food - 200),
      }));
      addNotification(`💀 Xato taktika! 5000 askar halok bo'ldi!`, "defeat");
    }

    setQuizActive(false);
    setQuizCityId(null);
    setSiegeCity(null);
  }, [quizCityId, cities, addNotification]);

  const handleVictoryComplete = useCallback(() => {
    setVictoryCity(null);
  }, []);

  const selectedArmy = armies.find((a) => a.id === selectedArmyId) || null;
  const conqueredCount = cities.filter((c) => c.conquered).length;

  const quiz = quizCityId ? quizQuestions[quizCityId] : null;
  const quizCity = quizCityId ? cities.find((c) => c.id === quizCityId) : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <GameScene
        cities={cities}
        armies={armies}
        selectedArmyId={selectedArmyId}
        activeBattle={activeBattle}
        siegeCity={siegeCity}
        onCityClick={handleCityClick}
        onArmyClick={handleArmyClick}
        onGroundClick={handleGroundClick}
        cameraTarget={cameraTarget}
      />

      {/* HUD Overlay */}
      <GameHUD
        resources={resources}
        selectedArmy={selectedArmy}
        conqueredCount={conqueredCount}
        totalCities={cities.length}
        onDeselectArmy={handleDeselectArmy}
        notifications={notifications}
        onDismissNotification={(id) => setNotifications((p) => p.filter((n) => n.id !== id))}
      />

      {/* Quiz Overlay */}
      <AnimatePresence>
        {quizActive && quiz && quizCity && (
          <QuizOverlay
            cityName={quizCity.name}
            year={quizCity.year}
            question={quiz.question}
            options={quiz.options}
            correctKey={quiz.correctKey}
            battleName={quiz.battleName}
            onResult={handleQuizResult}
          />
        )}
      </AnimatePresence>

      {/* Victory Overlay */}
      <AnimatePresence>
        {victoryCity && (
          <VictoryOverlay
            cityName={victoryCity.name}
            year={victoryCity.year}
            onComplete={handleVictoryComplete}
          />
        )}
      </AnimatePresence>

      {/* Game Over */}
      {resources.troops <= 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90">
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="font-display text-6xl font-extrabold text-destructive">
              IMPERIYA QULAB TUSHDI!
            </h2>
            <p className="font-ui text-lg text-muted-foreground">
              Barcha askarlar halok bo'ldi. O'yin tugadi.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-md bg-confirm text-foreground font-ui font-bold uppercase tracking-wider"
            >
              QAYTA BOSHLASH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
