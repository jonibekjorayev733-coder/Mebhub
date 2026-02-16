import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout as apiLogout } from './api/taskApi';
import Header from './components/Header/Header';
import './Profile.css';

type User = { id: number; username: string; email: string };

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await apiLogout();
            localStorage.removeItem("userRole");
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (loading) return <div className="profile-loading">Loading...</div>;

    return (
        <div className="profile-page">
            <Header />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <h2>{user?.username}</h2>
                        <p>{user?.email}</p>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="label">Username</span>
                            <span className="value">{user?.username}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Email</span>
                            <span className="value">{user?.email}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Role</span>
                            <span className="value">{localStorage.getItem("userRole") || 'Student'}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="edit-btn">Edit Profile</button>
                        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
