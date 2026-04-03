import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Play, RotateCcw, Target } from 'lucide-react';
import { getAPIBaseURL } from '@/utils/authService';
import { useMedicalStore } from '../store/useMedicalStore';
import { NeonButton } from '../components/UIElements';

interface LearningItem {
    id: number;
    latin_term: string;
    uzbek_term: string;
    description: string;
}

interface TopicHubProps {
    topicId: number;
    topicName: string;
    onBack: () => void;
    onStartRule: (topicId: number, topicName: string, mode: 'learn' | 'test') => void;
}

export const TopicHub: React.FC<TopicHubProps> = ({
    topicId,
    topicName,
    onBack,
    onStartRule
}) => {
    const { learnedRules, testedRules } = useMedicalStore();
    const [items, setItems] = useState<LearningItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${getAPIBaseURL()}/learning/topics/${topicId}/items`);
                if (!response.ok) throw new Error('Failed to fetch items');
                const data = await response.json();
                setItems(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [topicId]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 pt-8 pb-24 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full mx-auto mb-4" />
                <p className="text-[var(--text-muted)] font-bold">Mavzular yuklanyapti...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 pt-8 pb-24 text-center">
                <h2 className="text-xl font-black mb-4 text-red-500">Xato</h2>
                <p className="text-[var(--text-muted)] mb-6">{error}</p>
                <NeonButton onClick={onBack}>ORQAGA QAYTISH</NeonButton>
            </div>
        );
    }

    const isLearned = learnedRules[topicId];
    const isTested = testedRules[topicId];

    return (
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-24 relative">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="p-2 bg-[var(--glass-bg)] hover:bg-[var(--accent-primary)] hover:text-[var(--btn-text)] rounded-lg transition-all border border-[var(--glass-border)]"
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">{topicName}</h1>
                    <p className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-[0.3em] mt-0.5">O'quv kursi • {items.length} dars</p>
                </div>
            </header>

            <div className="space-y-3">
                {/* Single card for learning/testing this topic */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`glass-card-ultra p-4 flex flex-col md:flex-row items-center justify-between gap-4 border !rounded-2xl transition-all ${isLearned ? 'border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/4' : 'border-[var(--glass-border)]'
                        }`}
                >
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border transition-all ${isLearned
                            ? 'bg-[var(--accent-primary)] text-[var(--btn-text)] border-[var(--accent-primary)]'
                            : 'bg-[var(--glass-bg)] text-[var(--text-muted)] border-[var(--glass-border)]'
                            }`}>
                            {isLearned ? <CheckCircle2 size={18} /> : '1'}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-tight mb-0.5">{topicName}</h3>
                            <p className="text-[var(--text-muted)] text-[11px] font-medium leading-relaxed max-w-sm">
                                {items.length} ta o'rganish elementi • O'rganish va testni o'tish
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                        {isLearned && (
                            <button
                                onClick={() => onStartRule(topicId, topicName, 'learn')}
                                className="w-full md:w-auto p-2 flex items-center justify-center gap-1 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-lg transition-all border border-transparent hover:border-[var(--accent-primary)]/20"
                                title="Qayta o'rganish"
                            >
                                <RotateCcw size={14} />
                                <span className="md:hidden font-bold uppercase text-[8px] tracking-wider">Qayta</span>
                            </button>
                        )}

                        <button
                            onClick={() => onStartRule(topicId, topicName, isLearned ? 'test' : 'learn')}
                            className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-bold text-[9px] tracking-[0.15em] uppercase transition-all shadow-lg ${isLearned
                                ? 'bg-[var(--text-primary)] text-[var(--bg-dark)] hover:bg-[var(--accent-primary)] hover:text-[var(--btn-text)]'
                                : 'bg-[var(--accent-primary)] text-[var(--btn-text)] shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:-translate-y-0.5'
                                }`}
                        >
                            {isLearned ? (
                                <>
                                    <Target size={13} />
                                    <span>Test</span>
                                </>
                            ) : (
                                <>
                                    <Play size={12} fill="currentColor" />
                                    <span>Boshlash</span>
                                </>
                            )}
                        </button>
                    </div>

                    {isTested && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-black px-3 py-0.5 rounded-full text-[7px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 border border-[var(--bg-dark)]">
                            <CheckCircle2 size={8} />
                            Ok
                        </div>
                    )}
                </motion.div>
            </div>
            <div className="mt-12 p-8 border-2 border-dashed border-[var(--glass-border)] rounded-3xl text-center opacity-40">
                <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.5em]">Yangi bosqichlar tez kunda...</p>
            </div>
        </div>
    );
};
