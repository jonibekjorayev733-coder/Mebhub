import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    total_topics: 0,
    total_items: 0,
    total_questions: 0,
    total_users: 0,
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: '', description: '', order: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', badge: undefined },
    { id: 'topics', label: 'Mavzular', icon: '📚', badge: stats.total_topics },
    { id: 'items', label: 'O\'rganish', icon: '📖', badge: stats.total_items },
    { id: 'questions', label: 'Savollar', icon: '❓', badge: stats.total_questions },
    { id: 'users', label: 'Foydalanuvchilar', icon: '👥', badge: stats.total_users },
  ];

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.name) {
      setMessage({ type: 'error', text: 'Mavzu nomi kiriting' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/admin/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTopic.name,
          description: newTopic.description,
          order: newTopic.order || 0,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Mavzu muvaffaqiyatli qo\'shildi!' });
        setNewTopic({ name: '', description: '', order: 0 });
        fetchStats();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: '❌ Xato: Mavzu qo\'shib bo\'lmadi' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Network xatosi' });
      console.error('Error adding topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        const header = document.querySelector('.medical-admin-header');
        if (!header?.contains(e.target as Node)) {
          setIsMobileOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileOpen]);

  const getPageTitle = () => {
    const item = navItems.find((i) => i.id === activeTab);
    return item ? `${item.icon} ${item.label}` : 'Dashboard';
  };

  return (
    <div className="medical-admin-layout">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`medical-sidebar ${isExpanded ? '' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''}`}
      >
        {/* Logo */}
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            {isExpanded && <span className="logo-text">Medical Hub</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setIsMobileOpen(false);
              }}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {isExpanded && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {isExpanded && <div className="user-info">👤 {user?.email}</div>}
          <button className="logout-btn" onClick={logout} title="Logout">
            {isExpanded ? '🚪 Logout' : '🚪'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Header */}
        <header className="medical-admin-header">
          <div className="header-left">
            <button className="sidebar-toggle-mobile" onClick={toggleMobileSidebar}>
              ☰
            </button>
            <button className="sidebar-toggle-desktop" onClick={toggleSidebar} title="Toggle Sidebar">
              {isExpanded ? '⟨' : '⟩'}
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <span className="user-email">{user?.email}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="tab-content">
          {/* Messages */}
          {message && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ color: '#f1f5f9', marginBottom: '24px' }}>📊 Dashboard Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Mavzular</div>
                  <div className="stat-value">{stats.total_topics}</div>
                  <div className="stat-subtext">Jami mavzular soni</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">O'rganish Elementlari</div>
                  <div className="stat-value">{stats.total_items}</div>
                  <div className="stat-subtext">Jami o'rganish materiallar</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Test Savollar</div>
                  <div className="stat-value">{stats.total_questions}</div>
                  <div className="stat-subtext">Jami savollar soni</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Foydalanuvchilar</div>
                  <div className="stat-value">{stats.total_users}</div>
                  <div className="stat-subtext">Jami foydalanuvchilar</div>
                </div>
              </div>
            </div>
          )}

          {/* Topics Tab */}
          {activeTab === 'topics' && (
            <div>
              <form onSubmit={handleAddTopic} className="form-section">
                <h2 className="form-title">📚 Yangi Mavzu Qo'shish</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Mavzu Nomi *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTopic.name}
                      onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                      placeholder="Masalan: Anatomiya asoslari"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tartib Raqami</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newTopic.order}
                      onChange={(e) => setNewTopic({ ...newTopic, order: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tavsif</label>
                  <textarea
                    className="form-textarea"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                    placeholder="Mavzu haqida qisqacha ma'lumot..."
                    rows={4}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? '⏳ Saqlanmoqda...' : '➕ Qo\'shish'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setNewTopic({ name: '', description: '', order: 0 })}
                  >
                    ↺ Tozalash
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === 'items' && (
            <div className="form-section">
              <h2 className="form-title">📖 O'rganish Elementlari</h2>
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                  🔧 O'rganish elementlarini qo'shish uchun mavzu tanlang
                </p>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="form-section">
              <h2 className="form-title">❓ Test Savollar</h2>
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                  🔧 Test savollarini qo'shish uchun mavzu tanlang
                </p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="form-section">
              <h2 className="form-title">👥 Foydalanuvchilar</h2>
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                  👥 Foydalanuvchilar ro'yxati ({stats.total_users} jami)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
}
