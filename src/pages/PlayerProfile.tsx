import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Trophy, Zap, Target, LogOut, Edit3, Award, TrendingUp, Clock, Crown } from "lucide-react";

export default function PlayerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const stats = [
    { label: "O'yinlar Qo'yilgan", value: "12", icon: Zap, color: "from-blue-600 to-cyan-600" },
    { label: "G'alabalar", value: "8", icon: Trophy, color: "from-yellow-600 to-orange-600" },
    { label: "O'rtacha Ballasi", value: "245", icon: Target, color: "from-purple-600 to-pink-600" },
  ];

  const achievements = [
    { icon: "🥇", name: "Birinchi", desc: "Birinchi o'yinni yakunlash" },
    { icon: "🎯", name: "Nishontator", desc: "100% to'g'ri javob" },
    { icon: "⚡", name: "Tezkor", desc: "30 soniyada yechish" },
    { icon: "🏆", name: "Qahramoni", desc: "Reytingda 1-o'rin" },
    { icon: "🌟", name: "Yulduzli", desc: "5 ta o'yinda g'alaba" },
    { icon: "🚀", name: "Uchqunlik", desc: "1000+ balga yetish" },
  ];

  const recentActivity = [
    { game: "Bilimli O'quvchi", time: "2 soat oldin", points: 150, status: "G'alaba" },
    { game: "So'z Qidiruv", time: "5 soat oldin", points: 200, status: "G'alaba" },
    { game: "Millioner O'yini", time: "1 kun oldin", points: 100, status: "G'alaba" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black relative overflow-hidden px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="group relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
          
          <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-900/80 rounded-3xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
            {/* Top Gradient Bar */}
            <div className="h-32 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 opacity-20" />
            
            <div className="relative px-8 pb-8 -mt-16">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Avatar */}
                <div className="relative z-10">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center border-4 border-slate-900 shadow-2xl shadow-cyan-500/30 group-hover:shadow-3xl group-hover:shadow-cyan-500/40 transition-all duration-300">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900" />
                </div>

                {/* Info */}
                <div className="flex-1 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      {user.name}
                    </h1>
                    {user.rank === 1 && <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />}
                  </div>
                  
                  <p className="text-slate-400 mb-6 text-lg">{user.email}</p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Roli</p>
                      <p className="text-lg font-bold text-cyan-300">{user.role === 'student' ? "O'quvchi" : user.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Ballar</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        {user.points || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Reytingi</p>
                      <p className="text-2xl font-bold text-purple-400">#{user.rank || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group/btn">
                    <Edit3 className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold rounded-xl border border-red-500/30 transition-all duration-300 group/btn"
                  >
                    <LogOut className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                    Chiqish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/20" />
                
                <div className="relative p-6 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-125 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/20" />
            
            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">So'ngi Faollik</h2>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-cyan-500/30 hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-between group/activity">
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover/activity:text-cyan-300 transition-colors">{activity.game}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">+{activity.points} ball</p>
                      <p className="text-sm text-green-400">{activity.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 group-hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20" />
            
            <div className="relative p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white">Level Progress</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-3xl font-bold text-purple-300 mb-2">15</p>
                  <p className="text-sm text-slate-400">Joriy Level</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Keyingi Level</span>
                      <span className="text-purple-300">75%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-purple-600 to-pink-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/30 mt-4">
                <p className="text-xs text-slate-500 text-center">1,250 ball kerak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 group-hover:border-yellow-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-yellow-500/20" />
          
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Erishlari</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="group/badge relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl group-hover/badge:from-yellow-600/40 group-hover/badge:to-orange-600/40 transition-all duration-300" />
                  
                  <div className="relative p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 hover:border-yellow-500/50 transition-all duration-300 text-center group-hover/badge:scale-110 transform">
                    <p className="text-3xl mb-2 group-hover/badge:animate-bounce">{achievement.icon}</p>
                    <p className="text-xs font-bold text-white mb-1">{achievement.name}</p>
                    <p className="text-xs text-slate-400">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
