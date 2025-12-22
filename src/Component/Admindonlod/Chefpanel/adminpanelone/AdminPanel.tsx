

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Orderpage from '../cheforder/Cheforeder'

import './AdminPanel.css'; 

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
     
      case 'order':
        return <Orderpage/>;  
      default:
        return <Orderpage/>;
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
