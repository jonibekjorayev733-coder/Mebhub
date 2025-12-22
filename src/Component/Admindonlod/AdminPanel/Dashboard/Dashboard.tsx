import React from 'react';
import { TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Products',
      value: '1,234',
      icon: Package,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Total Users',
      value: '5,678',
      icon: Users,
      color: 'green',
      change: '+18%',
    },
    {
      title: 'Revenue',
      value: '$45,678',
      icon: DollarSign,
      color: 'purple',
      change: '+25%',
    },
    {
      title: 'Growth',
      value: '23.5%',
      icon: TrendingUp,
      color: 'red',
      change: '+8%',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-card-inner">
                <div className="stat-info">
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                  <div className="stat-change">
                    <span className="change-value">{stat.change}</span>
                    <span className="change-text">from last month</span>
                  </div>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon className="icon" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <Package className="icon-small" />
              </div>
              <div className="activity-info">
                <p className="activity-text">New product added</p>
                <p className="activity-subtext">Fresh Apples - $4.99</p>
              </div>
              <div className="activity-time">2 hours ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
