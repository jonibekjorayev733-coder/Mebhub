

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import ProductManagement from '../ProductManagement/ProductManagement';
import CategoryManagement from '../CategoryManagement/CategoryManagement';
import UserManagement from '../UserManagement/UserManagement';
import Orderpage from '../Orderpage/Orderpage'

import './AdminPanel.css'; 

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'users':
        return <UserManagement />;
      case 'order':
        return <Orderpage/>;  
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="content">
        <div className="content-inner">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
