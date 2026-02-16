import React from 'react';
import Header from './components/Header/Header';
import './Settings.css';

const Settings: React.FC = () => {
    return (
        <div className="settings-page">
            <Header />
            <div className="settings-container">
                <div className="settings-card">
                    <h2>Settings</h2>
                    <p>Settings implementation coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
