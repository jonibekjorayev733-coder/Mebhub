import React from 'react';
import {Package, Grid3x3, Users, ImagePlus as ImagePlay, LogOut, Archive } from 'lucide-react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'order', icon: Archive, label: 'order' },

  ];
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  }
  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h1>Admin Panel</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="menu-items">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`menu-btn ${isActive ? 'active' : ''}`}
              >
                <Icon className="icon-small" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="sidebar-logout">
        <button onClick={goBack} className="menu-btn">
          <LogOut className="icon-small" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
