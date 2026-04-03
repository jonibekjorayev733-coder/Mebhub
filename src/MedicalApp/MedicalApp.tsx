import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAPIBaseURL } from '@/utils/authService';
import { LandingPage } from './sections/LandingPage';
import { TopicHub } from './pages/TopicHub';
import { LearningMode } from './pages/LearningMode';
import { TestMode } from './pages/TestMode';
import { CertificatePage } from './pages/CertificatePage';
import { ProfilePage } from '../pages/ProfilePage';
import { topics } from './data/mockData';
import { MainLayout } from './components/MainLayout';
import { useMedicalStore } from './store/useMedicalStore';

interface DatabaseTopic {
    id: number;
    name: string;
    description: string;
}

type View = 'LANDING' | 'TOPIC_HUB' | 'LEARN' | 'TEST' | 'CERTIFICATE' | 'PROFILE';

export const MedicalApp: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { certificate } = useMedicalStore();
    const [view, setView] = useState<View>('LANDING');
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedTopicName, setSelectedTopicName] = useState<string>('');
    const [databaseTopics, setDatabaseTopics] = useState<DatabaseTopic[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch topics from database
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch(`${getAPIBaseURL()}/learning/topics`);
                if (response.ok) {
                    const data = await response.json();
                    setDatabaseTopics(data);
                }
            } catch (err) {
                console.error('Failed to fetch topics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    // Check for certificate completion
    useEffect(() => {
        if (certificate && view === 'TEST') {
            setTimeout(() => {
                setView('CERTIFICATE');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500); // Delay to show results first
        }
    }, [certificate, view]);

    const selectedTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

    const handleSelectTopic = (id: number) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedTopicId(id);
        setView('TOPIC_HUB');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStartRule = (id: number, name: string, mode: 'learn' | 'test') => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setSelectedTopicId(id);
        setSelectedTopicName(name);
        setView(mode === 'learn' ? 'LEARN' : 'TEST');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToLanding = () => {
        setView('LANDING');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleHome = () => {
        if (view !== 'LANDING') {
            setView('LANDING');
            setTimeout(() => {
                const el = document.getElementById('topics');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById('topics');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleProfileClick = () => {
        setView('PROFILE');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderView = () => {
        switch (view) {
            case 'LANDING':
                return <LandingPage onSelectTopic={handleSelectTopic} topics={databaseTopics} loading={loading} />;
            case 'TOPIC_HUB':
                return (
                    <div className="pt-20">
                        <TopicHub
                            topicId={selectedTopicId || 1}
                            topicName={selectedTopicName}
                            onBack={handleBackToLanding}
                            onStartRule={handleStartRule}
                        />
                    </div>
                );
            case 'LEARN':
                return (
                    <div className="pt-20">
                        <LearningMode
                            topicId={selectedTopicId || 1}
                            topicName={selectedTopicName}
                            onExit={() => setView('TOPIC_HUB')}
                            onComplete={() => setView('TOPIC_HUB')}
                        />
                    </div>
                );
            case 'TEST':
                return (
                    <div className="pt-20">
                        <TestMode
                            topicId={selectedTopicId || 1}
                            topicName={selectedTopicName}
                            onExit={(showCertificate) => {
                                if (showCertificate) {
                                    setView('CERTIFICATE');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                    setView('TOPIC_HUB');
                                }
                            }}
                        />
                    </div>
                );
            case 'CERTIFICATE':
                return (
                    <div className="pt-20">
                        <CertificatePage onHome={handleBackToLanding} />
                    </div>
                );
            case 'PROFILE':
                return <ProfilePage />;
            default:
                return <LandingPage onSelectTopic={handleSelectTopic} topics={databaseTopics} loading={loading} />;
        }
    };

    return (
        <MainLayout onStart={handleHome} onProfile={handleProfileClick} hideHeaderFooter={view === 'LEARN' || view === 'TEST'}>
            {renderView()}
        </MainLayout>
    );
};

export default MedicalApp;
