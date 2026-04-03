import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { topics as mockTopics } from '../data/mockData';
import { getAPIBaseURL } from '@/utils/authService';
import { NeonButton } from '../components/UIElements';
import { useMedicalStore } from '../store/useMedicalStore';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

interface DatabaseTopic {
    id: number;
    name: string;
    description: string;
}

interface HomePageProps {
    onSelectTopic: (id: number) => void;
    isEmbedded?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTopic, isEmbedded = false }) => {
    const { testedRules } = useMedicalStore();
    const [topics, setTopics] = useState<DatabaseTopic[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch topics from database
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${getAPIBaseURL()}/learning/topics`);
                if (response.ok) {
                    const data = await response.json();
                    setTopics(data);
                } else {
                    // Fallback to mock data if API fails
                    setTopics(mockTopics as any);
                }
            } catch (err) {
                console.error('Failed to fetch topics:', err);
                setTopics(mockTopics as any);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const completedCount = Object.keys(testedRules).length;
    const totalTopics = topics.length;

    return (
        <div className={`max-w-7xl mx-auto px-6 ${!isEmbedded ? 'pt-32 pb-20' : ''}`}>
            {!isEmbedded && (
                <header className="mb-20 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#ff6b00] font-bold tracking-[0.4em] text-xs uppercase mb-6 block"
                    >
                        O'QUV DARSTURI
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter italic"
                    >
                        Lotin tili va <br /> tibbiy terminologiya
                    </motion.h1>
                </header>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 px-6 glass-card-ultra py-6 !rounded-2xl border-white/5 bg-white/5 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#ff6b00]/30 text-black transform -rotate-3">
                        L
                    </div>
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-tight">Yo'nalishlar</h2>
                        <p className="text-[var(--text-muted)] font-medium tracking-widest uppercase text-[8px] opacity-60">Tanlang va boshlang</p>
                    </div>
                </div>
                <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 px-5 py-2.5 rounded-lg text-[var(--accent-primary)] font-bold tracking-[0.15em] uppercase text-[8px] shadow-inner">
                    {completedCount} / {totalTopics} OK
                </div>
            </div>

            {/* Topics Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full mx-auto mb-4" />
                    <p className="text-[var(--text-muted)] font-bold">Mavzular yuklanyapti...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                    {topics.map((topic, index) => {
                        const isCompleted = testedRules[topic.id];
                        return (
                        <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectTopic(topic.id)}
                            className={`h-full flex flex-col justify-between group !p-5 glass-card-ultra cursor-pointer transition-all relative ${
                                isCompleted 
                                    ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/4 hover:scale-[1.02]' 
                                    : 'border-[var(--glass-border)] bg-[var(--bg-surface)] hover:scale-[1.02]'
                            }`}
                        >
                            {/* Completion Badge */}
                            {isCompleted && (
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-[var(--bg-primary)] animate-pulse">
                                    <CheckCircle2 size={16} className="text-white" />
                                </div>
                            )}
                            
                            <div className="relative">
                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl mb-5 transition-all border ${
                                    isCompleted
                                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                        : 'bg-[var(--accent-primary)]/5 text-[var(--accent-primary)] border-[var(--glass-border)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--btn-text)]'
                                } font-bold`}>
                                    {isCompleted ? <CheckCircle2 size={20} /> : String.fromCharCode(65 + (index % 26))}
                                </div>
                                <h3 className="text-lg font-bold mb-2 uppercase tracking-tight text-[var(--text-primary)]">
                                    {topic.name}
                                </h3>
                                <p className="text-[var(--text-muted)] leading-relaxed font-medium mb-5 text-[11px]">
                                    {topic.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)] opacity-60 group-hover:opacity-100 transition-all">
                                <div className="text-[8px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">
                                    {isCompleted ? '✓ TAMOM' : 'O\'RGA'}
                                </div>
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                                    isCompleted
                                        ? 'border-green-500/50 bg-green-500/10 text-green-500'
                                        : 'border-[var(--glass-border)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--btn-text)]'
                                }`}>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                        );
                    })}
                </div>
            )}
        </div >
    );
};
