import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LandingPage } from './sections/LandingPage';
import { TopicHub } from './pages/TopicHub';
import { LearningMode } from './pages/LearningMode';
import { TestMode } from './pages/TestMode';
import { topics } from './data/mockData';
import { MainLayout } from './components/MainLayout';

interface DatabaseTopic {
    id: number;
    name: string;
    description: string;
}

type View = 'LANDING' | 'TOPIC_HUB' | 'LEARN' | 'TEST';

export const MedicalApp: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [view, setView] = useState<View>('LANDING');
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [selectedTopicName, setSelectedTopicName] = useState<string>('');
    const [databaseTopics, setDatabaseTopics] = useState<DatabaseTopic[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch topics from database
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch('/learning/topics');
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
                            onExit={() => setView('TOPIC_HUB')}
                        />
                    </div>
                );
            default:
                return <LandingPage onSelectTopic={handleSelectTopic} topics={databaseTopics} loading={loading} />;
        }
    };

    return (
        <MainLayout onStart={handleHome} hideHeaderFooter={view === 'LEARN' || view === 'TEST'}>
            {renderView()}
        </MainLayout>
    );
};

export default MedicalApp;
