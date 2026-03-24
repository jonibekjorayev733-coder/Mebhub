import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Filter, Sparkles, Zap, RotateCw, Users, Search as SearchIcon, DollarSign, Gem, Globe, Layers, Calculator, BarChart3, Gamepad2, BookOpen, Crown } from "lucide-react";
import { useState } from "react";

const games = [
  {
    id: 1,
    name: "Baraban Metodi",
    description: "Barabanni aylantiring va tasodifiy o'quvchini tanlang",
    category: "Tanlash",
    level: "Oddiy",
    icon: RotateCw,
    usage: "300+",
    route: "/games/baraban",
  },
  {
    id: 2,
    name: "Arqon Tortish O'yini",
    description: "Jamoaviy arqon tortish o'yinida g'alaba qozoning",
    category: "Jamoa",
    level: "Oddiy",
    icon: Users,
    usage: "600+",
    route: "/games/arqon-tortish",
  },
  {
    id: 3,
    name: "So'z Qidiruv",
    description: "Aralash harflar maydonidan so'zlarni topish o'yini",
    category: "Qidiruv",
    level: "Murakkab",
    icon: SearchIcon,
    usage: "650+",
    route: "/games/word-search",
  },
  {
    id: 4,
    name: "Millioner O'yini",
    description: "Viktorina ko'rinishidagi mashhur yutuqli savol-javob o'yini",
    category: "Viktorina",
    level: "Murakkab",
    icon: DollarSign,
    usage: "400+",
    route: "/games/millionaire",
  },
  {
    id: 5,
    name: "Bilimli O'quvchi",
    description: "Kartochkalar tanlang, testlarni yechib, puzzlelarni yeching va pul qazaning!",
    category: "Turnir",
    level: "Murakkab",
    icon: Gem,
    usage: "250+",
    route: "/games/chempion",
  },
  {
    id: 6,
    name: "Davlatni Topish",
    description: "Ekranda ko'ringan bayroq orqali davlat nomini topish",
    category: "Tarix",
    level: "Murakkab",
    icon: Globe,
    usage: "250+",
    route: "/games/davlatni-topish",
  },
  {
    id: 7,
    name: "Krossword",
    description: "Klassik krossword reboq o'yini",
    category: "Sluzhbit",
    level: "Murakkab",
    icon: Layers,
    usage: "180+",
    route: "/games/krossword",
  },
  {
    id: 8,
    name: "Shumod Oyini",
    description: "Matematik savollarga javob bering va ballaringni to'plang",
    category: "Matematika",
    level: "Oddiy",
    icon: Calculator,
    usage: "350+",
    route: "/games/shumod",
  },
  {
    id: 9,
    name: "Kattasini Top",
    description: "Ikkita raqamdan kattasini topish o'yini",
    category: "Matematika",
    level: "Oddiy",
    icon: BarChart3,
    usage: "220+",
    route: "#",
  },
  {
    id: 10,
    name: "Tarixni Bilaman",
    description: "O'zbekistonning tarix va geografiyasi bo'yicha viktorina o'yini",
    category: "Tarix",
    level: "Murakkab",
    icon: BookOpen,
    usage: "150+",
    route: "#",
  },
  {
    id: 11,
    name: "Qumsoat Topish",
    description: "5 ta bo'chkadan yashiringan qumsoatni topib, savollarga javob bering!",
    category: "Viktorina",
    level: "Oddiy",
    icon: BookOpen,
    usage: "80+",
    route: "/games/hidden-hourglass",
  },
  {
    id: 12,
    name: "Temur's Conquest",
    description: "Amir Temurning imperiyasini keyin bering va tarixiy savollariga javob bering!",
    category: "Tarix",
    level: "Murakkab",
    icon: Crown,
    usage: "50+",
    route: "/games/temur-conquest",
  },
  {
    id: 13,
    name: "Temur's Conquest - XARITA",
    description: "Interaktiv xarita bilan Temurning davlatlarini bosib oling va bayroq ko'taring!",
    category: "Tarix",
    level: "Zo'r",
    icon: Globe,
    usage: "120+",
    route: "/games/temur-conquest-v2",
  },
];

export default function Games() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hammasi");

  const categories = ["Hammasi", ...new Set(games.map((game) => game.category))];

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Hammasi" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Background — qora + oq shadow */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]" />
      <div className="fixed top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -z-10" style={{ boxShadow: "0 0 100px rgba(255,255,255,0.05)" }} />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-white/[0.03] rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 font-display" style={{ textShadow: "0 0 60px rgba(255,255,255,0.15)" }}>
              <span className="text-white">
                O'yinlar
              </span>{" "}
              Platformasi
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              10+ qiziqarli o'yinlardan birini tanlang va o'rganishning yangi dunyosiga kirish qiling
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="O'yinni qidirish..."
                className="w-full pl-12 pr-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 backdrop-blur-sm transition-all duration-300"
              />
            </div>
            <div className="hidden lg:flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400">Kategoriya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-20 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category
                    ? "bg-white/15 text-white border border-white/20 scale-105"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
                }`}
                style={selectedCategory === category ? { boxShadow: "0 0 25px -5px rgba(255,255,255,0.2), inset 0 1px 0 0 rgba(255,255,255,0.1)" } : undefined}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div key={game.id} className="group">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 h-full flex flex-col justify-between transition-all duration-500 hover:border-white/20 hover:-translate-y-1 white-glow" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06), 0 0 30px -10px rgba(255,255,255,0.05)' }}>
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300" style={{ boxShadow: "0 0 20px -5px rgba(255,255,255,0.15)" }}>
                          <game.icon className="w-6 h-6" />
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            game.level === "Oddiy"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                          }`}
                        >
                          {game.level}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors" style={{ textShadow: "0 0 20px rgba(255,255,255,0.05)" }}>{game.name}</h3>
                      <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{game.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                          {game.category}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {game.usage}
                        </span>
                      </div>
                      {game.route !== "#" ? (
                        <Link to={game.route} className="block">
                          <Button className="w-full bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 group-hover:scale-[1.02]" style={{ boxShadow: "0 0 25px -5px rgba(255,255,255,0.15)" }}>
                            O'ynash
                            <Gamepad2 className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full bg-slate-700/50 text-slate-500 rounded-xl cursor-not-allowed">
                          Tez Kuni
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-2xl text-slate-400 mb-2">Qidiruv natijasi topilmadi</p>
              <p className="text-slate-500">Boshqa qidiring yoki kategoriyani o'zgartiring</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
