import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminPanel.css';
import { MedicalSidebarProvider, useMedicalSidebar } from '../context/MedicalSidebarContext';

interface User {
  id: string;
  email: string;
  created_at?: string;
  is_admin?: boolean;
}

interface Stats {
  total_topics: number;
  total_items: number;
  total_questions: number;
  total_users: number;
}

interface Topic {
  name: string;
  description: string;
  order: number;
}

interface LearningItem {
  topic_id: number;
  uzbek_term: string;
  latin_term: string;
  definition: string;
  image_url?: string;
  order: number;
}

interface Question {
  topic_id: number;
  question: string;
  options: string[];
  correct_answer: number;
  order: number;
}

interface AdminUser {
  id: string;
  email: string;
  password?: string;
  is_admin: boolean;
}

export interface AdminPanelProps {
  onLogout: () => void;
}

// Medical Admin Sidebar Component
const MedicalAdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, setIsHovered, toggleMobileSidebar, setActiveItem, activeItem } = useMedicalSidebar();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'users', label: 'Foydalanuvchilar', icon: '👥', path: '/admin' },
    { id: 'profile', label: 'Profil', icon: '👤', path: '/admin' },
    { id: 'support', label: 'Tizkam Tiket', icon: '🎫', path: '/admin' },
    { id: 'auth', label: 'Autentifikatsiya', icon: '🔐', path: '/admin' },
  ];

  const handleMenuClick = (id: string) => {
    setActiveItem(id);
    if (isMobileOpen) {
      toggleMobileSidebar();
    }
  };

  return (
    <aside
      className={`medical-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-header">
        <div className={`logo ${isExpanded ? '' : 'collapsed'}`}>
          <span className="logo-icon">📚</span>
          {isExpanded && <span className="logo-text">MedAdmin</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {isExpanded && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <span>🚪</span>
          {isExpanded && <span>Chiqish</span>}
        </button>
      </div>
    </aside>
  );
};

// Medical Admin Header Component
const MedicalAdminHeader: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const { toggleSidebar, toggleMobileSidebar } = useMedicalSidebar();
  const location = useLocation();

  const getTitle = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') || 'dashboard';
    const titles: { [key: string]: string } = {
      dashboard: '📊 Dashboard',
      users: '👥 Foydalanuvchilar',
      profile: '👤 Mening Profil',
      support: '🎫 Tizkam Tiketlari',
      auth: '🔐 Autentifikatsiya'
    };
    return titles[tab] || '📊 Dashboard';
  };

  return (
    <header className="medical-admin-header">
      <div className="header-left">
        <button
          className="sidebar-toggle-mobile"
          onClick={toggleMobileSidebar}
        >
          ☰
        </button>
        <h1 className="page-title">{getTitle()}</h1>
      </div>
      <div className="header-right">
        <button
          className="sidebar-toggle-desktop"
          onClick={toggleSidebar}
          title="Sidebar"
        >
          ⟨
        </button>
        {currentUser && <span className="user-email">{currentUser.email}</span>}
      </div>
    </header>
  );
};

// Main Admin Panel Content Component
const AdminPanelContent: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveItem, activeItem } = useMedicalSidebar();
  
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'dashboard';

  const [stats, setStats] = useState<Stats>({
    total_topics: 0,
    total_items: 0,
    total_questions: 0,
    total_users: 0
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [newUser, setNewUser] = useState({ email: '', password: '', is_admin: false });
  const [newTopic, setNewTopic] = useState<Topic>({ name: '', description: '', order: 0 });
  const [newItem, setNewItem] = useState<LearningItem>({
    topic_id: 1,
    uzbek_term: '',
    latin_term: '',
    definition: '',
    order: 0
  });
  const [newQuestion, setNewQuestion] = useState<Question>({
    topic_id: 1,
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    order: 0
  });

  // Load stats and user data
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    fetchStats(token);
    fetchUsers(token);
    setActiveItem(tab);
  }, [tab, setActiveItem]);

  const fetchStats = async (token: string | null) => {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/admin/stats', { headers });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const fetchUsers = async (token: string | null) => {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/users', { headers });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Users error:', error);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/admin/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(newTopic)
      });

      if (response.ok) {
        setMessage('✓ Mavzu muvaffaqiyatli qo\'shildi!');
        setNewTopic({ name: '', description: '', order: 0 });
        setTimeout(() => setMessage(''), 3000);
        fetchStats(token);
      } else {
        setMessage('❌ Xato: Mavzu qo\'shilmadi');
      }
    } catch (error) {
      setMessage('❌ Xato: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/admin/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        setMessage('✓ O\'rganish materiali qo\'shildi!');
        setNewItem({
          topic_id: 1,
          uzbek_term: '',
          latin_term: '',
          definition: '',
          order: 0
        });
        setTimeout(() => setMessage(''), 3000);
        fetchStats(token);
      } else {
        setMessage('❌ Xato: Qo\'shilmadi');
      }
    } catch (error) {
      setMessage('❌ Xato: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(newQuestion)
      });

      if (response.ok) {
        setMessage('✓ Test savoli qo\'shildi!');
        setNewQuestion({
          topic_id: 1,
          question: '',
          options: ['', '', '', ''],
          correct_answer: 0,
          order: 0
        });
        setTimeout(() => setMessage(''), 3000);
        fetchStats(token);
      } else {
        setMessage('❌ Xato: Qo\'shilmadi');
      }
    } catch (error) {
      setMessage('❌ Xato: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setMessage('✓ Yangi foydalanuvchi qo\'shildi!');
        setNewUser({ email: '', password: '', is_admin: false });
        setTimeout(() => setMessage(''), 3000);
        fetchUsers(token);
      } else {
        const error = await response.json();
        setMessage('❌ Xato: ' + (error.detail || 'Qo\'shilmadi'));
      }
    } catch (error) {
      setMessage('❌ Xato: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    onLogout();
    navigate('/');
  };

  return (
    <main className="admin-main-content">
      <MedicalAdminHeader currentUser={currentUser} />
      
      <div className="admin-main-content">
        {message && (
          <div className={`alert ${message.includes('✓') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div className="tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon topics">📚</div>
                <div className="stat-info">
                  <h3>Mavzular</h3>
                  <p className="stat-number">{stats.total_topics}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon items">🧠</div>
                <div className="stat-info">
                  <h3>O'rganish Materiali</h3>
                  <p className="stat-number">{stats.total_items}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon questions">❓</div>
                <div className="stat-info">
                  <h3>Test Savollari</h3>
                  <p className="stat-number">{stats.total_questions}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon users">👥</div>
                <div className="stat-info">
                  <h3>Foydalanuvchilar</h3>
                  <p className="stat-number">{stats.total_users}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-forms">
              <div className="form-section">
                <h2>📚 Yangi Mavzu Qo'shish</h2>
                <form onSubmit={handleAddTopic}>
                  <input
                    type="text"
                    placeholder="Mavzu nomi"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Tavsiflash"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Tartib raqami"
                    value={newTopic.order}
                    onChange={(e) => setNewTopic({ ...newTopic, order: parseInt(e.target.value) || 0 })}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Qo\'shilmoqda...' : '➕ Qo\'shish'}
                  </button>
                </form>
              </div>

              <div className="form-section">
                <h2>🧠 O'rganish Materiali Qo'shish</h2>
                <form onSubmit={handleAddItem}>
                  <input
                    type="number"
                    placeholder="Mavzu ID"
                    value={newItem.topic_id}
                    onChange={(e) => setNewItem({ ...newItem, topic_id: parseInt(e.target.value) || 1 })}
                  />
                  <input
                    type="text"
                    placeholder="O'zbek termo"
                    value={newItem.uzbek_term}
                    onChange={(e) => setNewItem({ ...newItem, uzbek_term: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Latin termo"
                    value={newItem.latin_term}
                    onChange={(e) => setNewItem({ ...newItem, latin_term: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Ta'rif"
                    value={newItem.definition}
                    onChange={(e) => setNewItem({ ...newItem, definition: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Tartib raqami"
                    value={newItem.order}
                    onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Qo\'shilmoqda...' : '➕ Qo\'shish'}
                  </button>
                </form>
              </div>

              <div className="form-section">
                <h2>❓ Test Savoli Qo'shish</h2>
                <form onSubmit={handleAddQuestion}>
                  <input
                    type="number"
                    placeholder="Mavzu ID"
                    value={newQuestion.topic_id}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic_id: parseInt(e.target.value) || 1 })}
                  />
                  <textarea
                    placeholder="Savol"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    required
                  />
                  {newQuestion.options.map((option, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Variant ${idx + 1}`}
                      value={option}
                      onChange={(e) => {
                        const opts = [...newQuestion.options];
                        opts[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: opts });
                      }}
                      required
                    />
                  ))}
                  <input
                    type="number"
                    placeholder="To'g'ri javob indeksi (0-3)"
                    min="0"
                    max="3"
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: parseInt(e.target.value) || 0 })}
                  />
                  <input
                    type="number"
                    placeholder="Tartib raqami"
                    value={newQuestion.order}
                    onChange={(e) => setNewQuestion({ ...newQuestion, order: parseInt(e.target.value) || 0 })}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? 'Qo\'shilmoqda...' : '➕ Qo\'shish'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>➕ Yangi Foydalanuvchi Qo'shish</h2>
              <form onSubmit={handleAddUser}>
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Parol"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newUser.is_admin}
                    onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                  />
                  <span>Admin huquqi</span>
                </label>
                <button type="submit" disabled={loading}>
                  {loading ? 'Qo\'shilmoqda...' : '➕ Qo\'shish'}
                </button>
              </form>
            </div>

            <div className="users-list">
              <h2>Mavjud Foydalanuvchilar</h2>
              {users.length > 0 ? (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Admin</th>
                      <th>ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.is_admin ? '✓ Ha' : '✗ Yo\'q'}</td>
                        <td>{user.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Foydalanuvchilar topilmadi</p>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="tab-content">
            <div className="profile-card">
              <div className="profile-avatar">👤</div>
              <div className="profile-info">
                <h2>{currentUser?.email}</h2>
                <p>Admin Huquqi: {currentUser && (currentUser as any).is_admin ? '✓ Ha' : '✗ Yo\'q'}</p>
                <p className="profile-id">ID: {currentUser?.id}</p>
                {currentUser?.created_at && (
                  <p className="profile-date">Ro'yhatdan O'tgan: {new Date(currentUser.created_at).toLocaleDateString('uz-UZ')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {tab === 'support' && (
          <div className="tab-content">
            <div className="support-info">
              <h2>🎫 Tizkam Tiketlari</h2>
              <p>Hozirgi vaqtda tiketlar mavjud emas.</p>
              <p className="support-contact">Agar muammo bo'lsa, quyidagi manzilga murojaat qiling:</p>
              <p className="support-email">📧 support@medical.uz</p>
            </div>
          </div>
        )}

        {/* Authentication Tab */}
        {tab === 'auth' && (
          <div className="tab-content">
            <div className="auth-info">
              <h2>🔐 Autentifikatsiya Sozlamalari</h2>
              <div className="auth-section">
                <h3>Hozirgi Sessiya</h3>
                <p>✓ Siz admin sifatida tizimga kirgansiz</p>
                <p className="auth-token">Token saqlanigan: localStorage</p>
              </div>
              <div className="auth-section">
                <h3>Xavfsizlik Sozlamalari</h3>
                <p>Barcha API so'rovlar JWT token bilan himoyalangan</p>
                <p>Admin paneli faqat /admin/stats, /admin/topics, /admin/items, /admin/questions endpoint lari bilan ishlaydi</p>
              </div>
              <button className="logout-btn large" onClick={handleLogout}>
                🚪 Tizimdan Chiqish
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

// Main Admin Panel Component
const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {

  return (
    <MedicalSidebarProvider>
      <div className="medical-admin-layout">
        <MedicalAdminSidebar />
        <AdminPanelContent onLogout={onLogout} />
      </div>
    </MedicalSidebarProvider>
  );
};

export default AdminPanel;
