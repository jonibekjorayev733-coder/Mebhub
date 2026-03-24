import * as THREE from "three";

export interface City {
  id: string;
  name: string;
  position: [number, number, number];
  defenseLevel: number;
  conquered: boolean;
  faction: "neutral" | "timurid" | "enemy";
  description: string;
  year: string;
}

export interface Army {
  id: string;
  faction: "timurid" | "enemy";
  position: [number, number, number];
  targetPosition: [number, number, number] | null;
  troops: number;
  type: "mixed" | "cavalry" | "infantry" | "archers";
  selected: boolean;
  health: number;
  maxHealth: number;
  speed: number;
  inBattle: boolean;
  patrolRoute?: [number, number, number][];
  patrolIndex?: number;
}

export interface BattleEvent {
  attackerId: string;
  defenderId: string;
  position: [number, number, number];
  phase: "approaching" | "fighting" | "resolved";
}

export interface GameState3D {
  cities: City[];
  armies: Army[];
  selectedArmyId: string | null;
  activeBattle: BattleEvent | null;
  cameraTarget: [number, number, number];
  quizActive: boolean;
  quizCityId: string | null;
  gamePhase: "playing" | "battle" | "quiz" | "victory" | "defeat";
}

export const TERRAIN_SIZE = 100;
export const CITY_RADIUS = 2;
