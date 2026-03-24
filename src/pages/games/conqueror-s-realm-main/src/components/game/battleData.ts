import battleBaghdad from "@/assets/battle-baghdad.jpg";
import battleAnkara from "@/assets/battle-ankara.jpg";
import battleTerek from "@/assets/battle-terek.jpg";
import battleDelhi from "@/assets/battle-delhi.jpg";
import battleKondurcha from "@/assets/battle-kondurcha.jpg";

export interface BattleData {
  cityName: string;
  year: string;
  battleName: string;
  description: string;
  background: string;
}

export const battleMap: Record<string, BattleData> = {
  baghdad: {
    cityName: "Bag'dod",
    year: "1393",
    battleName: "Bag'dod muhosarasi",
    description: "Temur qo'shinlari Bag'dodga hujum boshladi! Shahar darvozalari sindirilmoqda!",
    background: battleBaghdad,
  },
  ankara: {
    cityName: "Anqara",
    year: "1402",
    battleName: "Anqara jangi",
    description: "Temur qo'shinlari Boyazid I ga qarshi g'alaba qozonmoqda!",
    background: battleAnkara,
  },
  terek: {
    cityName: "Terek",
    year: "1395",
    battleName: "Terek daryosi jangi",
    description: "Temur qo'shinlari Oltin O'rda kuchlariga qarshi Terek daryosi bo'yida jang qilmoqda!",
    background: battleTerek,
  },
  delhi: {
    cityName: "Dehli",
    year: "1398",
    battleName: "Dehli jangi",
    description: "Temur qo'shinlari Hindiston sultonligiga qarshi yurish qilmoqda!",
    background: battleDelhi,
  },
  kondurcha: {
    cityName: "Kondurcha",
    year: "1391",
    battleName: "Kondurcha jangi",
    description: "Temur qo'shinlari To'xtamish xonga qarshi g'alaba qozonmoqda!",
    background: battleKondurcha,
  },
  samarkand: {
    cityName: "Samarqand",
    year: "1370",
    battleName: "Samarqand zabt etilishi",
    description: "Temur Samarqandni o'z poytaxti sifatida tanladi!",
    background: battleBaghdad, // fallback
  },
};

// Map quiz question index to battle key
export const questionBattleMap: Record<number, string> = {
  0: "ankara",    // Q1: Ankara jangi
  1: "samarkand", // Q2: Samarqand
  2: "delhi",     // Q3: Dehli yurishi
  3: "kondurcha", // Q4: Kondurcha jangi
  4: "ankara",    // Q5: Imperiya (fallback)
};
