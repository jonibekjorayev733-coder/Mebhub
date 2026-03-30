import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BarChart3, Users, BookOpen, HelpCircle, TrendingUp } from "lucide-react";

interface Stats {
  total_topics: number;
  total_items: number;
  total_questions: number;
  total_users: number;
}

const StatCard = ({ icon: Icon, label, value, trend, trendColor }: any) => (
  <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-6 hover:border-brand-500/30 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-2xl bg-brand-500/10">
        <Icon className="w-6 h-6 text-brand-400" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
          <TrendingUp className="w-4 h-4" />
          {trend}
        </div>
      )}
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { token, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total_topics: 0,
    total_items: 0,
    total_questions: 0,
    total_users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.warn("No token available, skipping stats fetch");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/admin/stats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          setLoading(false);
        } else if (response.status === 401) {
          console.error("Unauthorized: Token invalid or user not admin");
          setLoading(false);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
        setLoading(false);
      }
    };

    // Wait for auth to fully load before fetching stats
    if (!authLoading && token) {
      fetchStats();
    } else if (!authLoading && !token) {
      setLoading(false);
    }
  }, [token, authLoading]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Bosh Sahifa
          </h1>
          <p className="text-gray-400">
            Medical Hub admin panelining umumiy ko'rinishi
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500/30 border-t-brand-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid - Dasher Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={BarChart3}
              label="Mavzular soni"
              value={stats.total_topics}
              trend="+12.5%"
              trendColor="text-green-400"
            />
            <StatCard
              icon={BookOpen}
              label="O'rganish materiallari"
              value={stats.total_items}
              trend="+8.2%"
              trendColor="text-green-400"
            />
            <StatCard
              icon={HelpCircle}
              label="Test savollar"
              value={stats.total_questions}
              trend="+15.1%"
              trendColor="text-green-400"
            />
            <StatCard
              icon={Users}
              label="Foydalanuvchilar"
              value={stats.total_users}
              trend="+3.4%"
              trendColor="text-yellow-400"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-2 rounded-3xl border border-gray-800/50 bg-gradient-to-br from-brand-500/20 via-gray-900/50 to-gray-900/50 p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl -z-10" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      👋 Xush kelibsiz!
                    </h2>
                    <p className="text-gray-300">
                      Medical Hub platformasida admin paneli tayyorlandi
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Chap panelda mavjud bo'lgan bo'limlardan foydalanib, tizimingizni boshqarishni davom ettiring.
                </p>
                <button className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Boshlayman →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Tez amallar</h3>
              <div className="space-y-3">
                <a href="/admin/topics" className="block p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all group">
                  <p className="text-white font-semibold group-hover:text-brand-400">+ Mavzu qo'shish</p>
                  <p className="text-sm text-gray-400">Yangi o'quv mavzusini yaratish</p>
                </a>
                <a href="/admin/learning" className="block p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all group">
                  <p className="text-white font-semibold group-hover:text-brand-400">+ O'rganish qo'shish</p>
                  <p className="text-sm text-gray-400">Termin va tariflarni qo'shish</p>
                </a>
                <a href="/admin/questions" className="block p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-all group">
                  <p className="text-white font-semibold group-hover:text-brand-400">+ Savol qo'shish</p>
                  <p className="text-sm text-gray-400">Test savollarini yaratish</p>
                </a>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8">
            <h3 className="text-xl font-bold text-white mb-6">📊 Tizim Holati</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-800/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-300">Database holati</p>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-white">PostgreSQL</p>
                <p className="text-sm text-gray-400 mt-2">Aktiv va ishlayapti</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-800/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-300">API serveri</p>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-white">FastAPI</p>
                <p className="text-sm text-gray-400 mt-2">Port 8000</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-800/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-300">Frontend</p>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <p className="text-2xl font-bold text-white">Vite + React</p>
                <p className="text-sm text-gray-400 mt-2">Port 5173</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
