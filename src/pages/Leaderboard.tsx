import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Flame, Star } from "lucide-react";

interface LeaderboardPlayer {
  rank: number;
  name: string;
  score: number;
  games: number;
  avatar: string;
}

const topPlayers: LeaderboardPlayer[] = [
  { rank: 1, name: "Ali Karimov", score: 5230, games: 45, avatar: "👨‍🎓" },
  { rank: 2, name: "Dilnoza Xolmirzayeva", score: 4890, games: 42, avatar: "👩‍🎓" },
  { rank: 3, name: "Javohir Akmalov", score: 4650, games: 38, avatar: "👨‍🎓" },
  { rank: 4, name: "Mushtariy Abdullayeva", score: 4320, games: 35, avatar: "👩‍🎓" },
  { rank: 5, name: "Oybek Rahimov", score: 4100, games: 33, avatar: "👨‍🎓" },
  { rank: 6, name: "Shaxnoza Iskandarova", score: 3890, games: 30, avatar: "👩‍🎓" },
  { rank: 7, name: "Mirjalol Shodmonov", score: 3650, games: 28, avatar: "👨‍🎓" },
  { rank: 8, name: "Nodira Xudoyberdiyeva", score: 3420, games: 26, avatar: "👩‍🎓" },
  { rank: 9, name: "Rustam Hasanov", score: 3210, games: 24, avatar: "👨‍🎓" },
  { rank: 10, name: "Gulnora Abdullayeva", score: 2980, games: 22, avatar: "👩‍🎓" },
];

export default function Leaderboard() {
  const topThree = topPlayers.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border border-yellow-500/30 mb-6">
            <Flame className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">TOP O'YINCHILAR</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-black text-white mb-4">
            Reytingi <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Toplamasi</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Eng yaxshi o'yinchilarni ko'ring va ularga qo'shiling. Har qanday o'yinda qatnashing va ko'proq ball topladon!
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="group">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl border border-slate-600 p-8 h-full hover:border-slate-400 transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="inline-block relative">
                    <div className="text-6xl mb-2">{topThree[1].avatar}</div>
                    <div className="absolute -top-2 -right-2 bg-slate-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      <Medal className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{topThree[1].name}</h3>
                    <p className="text-slate-400 text-sm">{topThree[1].games} o'yin</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-slate-300 text-sm">Ballar</p>
                    <p className="text-2xl font-black text-slate-200">{topThree[1].score.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Center & Larger) */}
          {topThree[0] && (
            <div className="group md:order-2">
              <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-3xl border-2 border-yellow-400 p-8 h-full hover:shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 transform md:scale-110 md:-mt-8">
                <div className="text-center space-y-4">
                  <div className="inline-block relative">
                    <div className="text-7xl mb-2 animate-bounce">{topThree[0].avatar}</div>
                    <div className="absolute -top-4 -right-4 bg-yellow-300 text-black font-bold w-12 h-12 rounded-full flex items-center justify-center text-lg animate-pulse">
                      <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{topThree[0].name}</h3>
                    <p className="text-yellow-300 text-sm font-semibold">{topThree[0].games} o'yin</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/50 to-orange-500/50 rounded-lg p-4 border border-yellow-400/30">
                    <p className="text-yellow-200 text-sm font-semibold">Yuqori Ball</p>
                    <p className="text-3xl font-black text-yellow-300">{topThree[0].score.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="group">
              <div className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 rounded-2xl border border-orange-400/30 p-8 h-full hover:border-orange-400 transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="inline-block relative">
                    <div className="text-6xl mb-2">{topThree[2].avatar}</div>
                    <div className="absolute -top-2 -right-2 bg-orange-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      🥉
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{topThree[2].name}</h3>
                    <p className="text-slate-400 text-sm">{topThree[2].games} o'yin</p>
                  </div>
                  <div className="bg-orange-700/30 rounded-lg p-3 border border-orange-400/20">
                    <p className="text-slate-300 text-sm">Ballar</p>
                    <p className="text-2xl font-black text-orange-300">{topThree[2].score.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full Rankings Table */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Medal className="w-6 h-6 text-yellow-400" />
              <div>
                <CardTitle className="text-white text-2xl">Butun Reytingi</CardTitle>
                <CardDescription className="text-slate-400">10 ta eng yaxshi o'yinchi</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPlayers.map((player) => (
                <div
                  key={player.rank}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600/50 hover:border-yellow-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-yellow-500/20"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 font-bold text-white text-sm">
                      {player.rank}
                    </div>
                    <span className="text-2xl">{player.avatar}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white group-hover:text-yellow-300 transition-colors">{player.name}</p>
                      <p className="text-slate-400 text-sm">{player.games} o'yinda qatnashgan</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {player.rank <= 3 && (
                      <div className="flex items-center gap-2">
                        <Medal className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-yellow-400">TOP</span>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-xl font-black text-yellow-400">{player.score.toLocaleString()}</p>
                      <p className="text-slate-400 text-xs">ball</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
