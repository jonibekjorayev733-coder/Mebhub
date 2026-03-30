import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Stats {
  total_topics: number;
  total_items: number;
  total_questions: number;
  total_users: number;
}

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title-md font-bold text-white">
          Bosh sahifa
        </h1>
        <p className="text-theme-sm text-gray-400">
          Medical Hub admin paneli
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {/* Mavzular Card */}
            <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5h2v14H3V5zm4 0h2v14H7V5zm4 0h2v14h-2V5zm4 0h2v14h-2V5z" fill="currentColor" className="text-white"/>
                </svg>
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-theme-sm text-gray-400">
                    Mavzular
                  </span>
                  <h4 className="mt-2 font-bold text-white text-title-sm">
                    {stats.total_topics}
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-500/20 text-success-400 text-theme-xs font-medium">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v10m0 0l3-3m-3 3L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  12.5%
                </div>
              </div>
            </div>

            {/* O'rganish */}
            <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm0 12h14v2H5v-2z" fill="currentColor" className="text-white"/>
                </svg>
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-theme-sm text-gray-400">
                    O'rganish
                  </span>
                  <h4 className="mt-2 font-bold text-white text-title-sm">
                    {stats.total_items}
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-500/20 text-error-400 text-theme-xs font-medium">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 15V5m0 0L5 8m3-3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  8.2%
                </div>
              </div>
            </div>

            {/* Savollar */}
            <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" fill="currentColor" className="text-white"/>
                </svg>
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-theme-sm text-gray-400">
                    Savollar
                  </span>
                  <h4 className="mt-2 font-bold text-white text-title-sm">
                    {stats.total_questions}
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-500/20 text-success-400 text-theme-xs font-medium">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v10m0 0l3-3m-3 3L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  15.1%
                </div>
              </div>
            </div>

            {/* Foydalanuvchilar */}
            <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 md:p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" className="text-white"/>
                </svg>
              </div>
              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-theme-sm text-gray-400">
                    Foydalanuvchilar
                  </span>
                  <h4 className="mt-2 font-bold text-white text-title-sm">
                    {stats.total_users}
                  </h4>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning-500/20 text-warning-400 text-theme-xs font-medium">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 15V5m0 0L5 8m3-3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  3.4%
                </div>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 md:p-6 lg:col-span-6">
              <h2 className="mb-6 font-bold text-white text-title-sm">
                Tez havolalar
              </h2>
              <div className="space-y-3">
                <a href="/admin/topics" className="flex items-center justify-between p-4 rounded-xl border border-gray-800 hover:border-brand-500/50 hover:bg-brand-500/10 transition-all">
                  <span className="text-theme-sm font-medium text-gray-300">Mavzularni boshqarish</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15l7.5-7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"/>
                  </svg>
                </a>
                <a href="/admin/learning" className="flex items-center justify-between p-4 rounded-xl border border-gray-800 hover:border-brand-500/50 hover:bg-brand-500/10 transition-all">
                  <span className="text-theme-sm font-medium text-gray-300">O'rganish materiallari</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15l7.5-7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"/>
                  </svg>
                </a>
                <a href="/admin/questions" className="flex items-center justify-between p-4 rounded-xl border border-gray-800 hover:border-brand-500/50 hover:bg-brand-500/10 transition-all">
                  <span className="text-theme-sm font-medium text-gray-300">Savollarni boshqarish</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15l7.5-7.5-7.5-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Latest Activity */}
            <div className="rounded-2xl border border-gray-800 bg-gray-800/50 p-5 md:p-6 lg:col-span-6">
              <h2 className="mb-6 font-bold text-white text-title-sm">
                Oxirgi Faoliyat
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1v10m0 0l3-3m-3 3L5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success-400"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-theme-sm font-medium text-white">Admin panel tayyorlandi</p>
                    <p className="text-theme-xs text-gray-400 mt-1">Medical Hub admin paneli to'liq ishga tushdi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" className="text-brand-400"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-theme-sm font-medium text-white">Sidebar integratsiyasi</p>
                    <p className="text-theme-xs text-gray-400 mt-1">TailAdmin dizayni qo'llandi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-gray-800 last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-warning-500/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4v6m0 2v0.01M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-warning-400"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-theme-sm font-medium text-white">Authenticatsiya</p>
                    <p className="text-theme-xs text-gray-400 mt-1">JWT tokens bilan himoya qilingan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
