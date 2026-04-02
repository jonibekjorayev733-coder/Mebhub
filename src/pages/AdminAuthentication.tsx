import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, User, Trash2, Plus, Shield, AlertCircle } from "lucide-react";
import ConfirmModal from "../Components/ConfirmModal";

interface AuthUser {
  id: number;
  email: string;
  full_name?: string;
  is_admin: boolean;
  created_at?: string;
}

const AdminAuthentication: React.FC = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ type: string; id?: number } | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUsers();

    const interval = setInterval(() => {
      fetchUsers();
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const { getAPIBaseURL } = await import('../utils/authService');
      const response = await fetch(`${getAPIBaseURL()}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setMessage(null);
      } else if (response.status === 401) {
        setMessage({ type: "error", text: "Sessiya tugagan. Qayta login qiling." });
        logout();
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Email va parol talab qilinadi!" });
      return;
    }

    try {
      const { getAPIBaseURL } = await import('../utils/authService');
      const response = await fetch(`${getAPIBaseURL()}/admin/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ email: "", password: "", full_name: "" });
        setShowForm(false);
        setMessage({ type: "success", text: `✅ Admin "${data.email}" muvaffaqiyatli qo'shildi!` });
        setTimeout(() => setMessage(null), 3000);
        fetchUsers();
      } else if (response.status === 401) {
        setMessage({ type: "error", text: "Sessiya tugagan. Qayta login qiling." });
        logout();
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: `❌ Xato: ${error.detail}` });
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      setMessage({ type: "error", text: "Admin qo'shishda xato bo'ldi" });
    }
  };

  const handleMakeAdmin = async (userId: number) => {
    if (!token || !window.confirm("Bu foydalanuvchini adminlikka ko'tarmoqchisiz?")) return;

    try {
      const { getAPIBaseURL } = await import('../utils/authService');
      const response = await fetch(`${getAPIBaseURL()}/admin/users/${userId}/make-admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: "success", text: `✅ "${data.email}" adminlikka ko'tarildi!` });
        setTimeout(() => setMessage(null), 3000);
        fetchUsers();
      } else if (response.status === 401) {
        setMessage({ type: "error", text: "Sessiya tugagan. Qayta login qiling." });
        logout();
      }
    } catch (error) {
      console.error("Error making admin:", error);
      setMessage({ type: "error", text: "Admin qo'shishda xato bo'ldi" });
    }
  };

  const handleRemoveAdmin = async (userId: number) => {
    if (!token || !window.confirm("Bu foydalanuvchini adminlikdan olib tashlamoqchisiz?")) return;

    try {
      const { getAPIBaseURL } = await import('../utils/authService');
      const response = await fetch(`${getAPIBaseURL()}/admin/users/${userId}/remove-admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: "success", text: `✅ "${data.email}" adminlikdan olib tashlandi!` });
        setTimeout(() => setMessage(null), 3000);
        fetchUsers();
      } else if (response.status === 401) {
        setMessage({ type: "error", text: "Sessiya tugagan. Qayta login qiling." });
        logout();
      }
    } catch (error) {
      console.error("Error removing admin:", error);
      setMessage({ type: "error", text: "Admin olib tashlashda xato bo'ldi" });
    }
  };

  const handleDeleteUser = (id: number) => {
    setConfirmModal({ type: "deleteUser", id });
  };

  const confirmDeleteUser = async (id: number) => {
    if (!token) return;

    try {
      const { getAPIBaseURL } = await import('../utils/authService');
      const response = await fetch(`${getAPIBaseURL()}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "✅ Foydalanuvchi o'chirildi!" });
        setTimeout(() => setMessage(null), 3000);
        fetchUsers();
        setConfirmModal(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({ type: "error", text: "Foydalanuvchi o'chirishda xato bo'ldi" });
    }
  };

  const handleLogout = () => {
    setConfirmModal({ type: "logout" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            🔐 Authentication
          </h1>
          <p className="text-gray-400">
            Foydalanuvchilar va admin huquqlarini boshqarish
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Yangi Admin
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-300"
              : "bg-red-500/10 border-red-500/50 text-red-300"
          } flex items-center gap-2 animate-pulse`}
        >
          {message.type === "success" ? (
            <AlertCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          {message.text}
        </div>
      )}

      {/* Add Admin Form */}
      {showForm && (
        <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Yangi Admin Qo'shish</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-white mb-2 font-semibold">📧 Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none placeholder-gray-600"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 font-semibold">🔑 Parol</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none placeholder-gray-600"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2 font-semibold">👤 To'liq Ismi</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none placeholder-gray-600"
                placeholder="Admin Ismi"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                ✅ Qo'shish
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
              >
                ❌ Bekor Qilish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8 overflow-x-auto">
        <h2 className="text-2xl font-bold text-white mb-6">👥 Tizimidagi Foydalanuvchilar ({users.length})</h2>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500/30 border-t-brand-500"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Hali foydalanuvchi mavjud emas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">📧 Email</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">👤 To'liq Ismi</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">🔐 Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">⚙️ Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-200"
                  >
                    <td className="py-4 px-4 text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </td>
                    <td className="py-4 px-4 text-gray-300">{user.full_name || "-"}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${
                          user.is_admin
                            ? "bg-brand-500/20 text-brand-300 border border-brand-500/50"
                            : "bg-gray-700/50 text-gray-300 border border-gray-600/50"
                        }`}
                      >
                        {user.is_admin ? (
                          <>
                            <Shield className="w-4 h-4" />
                            🔐 Admin
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4" />
                            👤 User
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      {!user.is_admin && (
                        <button
                          onClick={() => handleMakeAdmin(user.id)}
                          className="px-4 py-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all font-semibold flex items-center gap-2"
                          title="Admin qil"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Qil
                        </button>
                      )}
                      {user.is_admin && (
                        <button
                          onClick={() => handleRemoveAdmin(user.id)}
                          className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-all font-semibold flex items-center gap-2"
                          title="Adminlikdan olib tash"
                        >
                          <Shield className="w-4 h-4" />
                          Admin Olib Tash
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-brand-400" />
            <h3 className="text-xl font-bold text-white">🛡️ Himoya Sozlamalari</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              JWT Token-based authentication
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Password hashing (bcrypt)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Role-based access control (RBAC)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Secure API endpoints
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Real-time user status updates
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-brand-400" />
            <h3 className="text-xl font-bold text-white">📊 Statlar</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">Jami Foydalanuvchi:</span>
              <span className="text-2xl font-bold text-white">{users.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-800">
              <span className="text-gray-400">🔐 Admin:</span>
              <span className="text-2xl font-bold text-brand-400">{users.filter((u) => u.is_admin).length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">👤 Oddiy Foydalanuvchi:</span>
              <span className="text-2xl font-bold text-yellow-400">{users.filter((u) => !u.is_admin).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-semibold border border-red-500/30 transition-all"
        >
          Chiqish
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmModal}
        title={
          confirmModal?.type === "deleteUser"
            ? "Foydalanuvchini o'chirish"
            : "Chiqish"
        }
        message={
          confirmModal?.type === "deleteUser"
            ? "Siz bu foydalanuvchini o'chirmoqchisiz? Bu amalni qaytara olmaysiz!"
            : "Buday tizimdan chiqmoqchisiz?"
        }
        confirmText={confirmModal?.type === "logout" ? "Chiqish" : "O'chirish"}
        confirmVariant={confirmModal?.type === "logout" ? "warning" : "danger"}
        onCancel={() => setConfirmModal(null)}
        onConfirm={() => {
          if (confirmModal?.type === "deleteUser" && confirmModal.id) {
            confirmDeleteUser(confirmModal.id);
          } else if (confirmModal?.type === "logout") {
            logout();
          }
        }}
      />
    </div>
  );
};

export default AdminAuthentication;
