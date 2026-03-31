import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useMedicalStore } from '../store/useMedicalStore';
import { NeonButton } from '../components/UIElements';

interface LearningItem {
    id: number;
    latin_term: string;
    uzbek_term: string;
    description: string;
}

interface LearningModeProps {
    topicId: number;
    topicName: string;
    onExit: () => void;
    onComplete: () => void;
}

export const LearningMode: React.FC<LearningModeProps> = ({ topicId, topicName, onExit, onComplete }) => {
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [items, setItems] = useState<LearningItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { markRuleAsLearned } = useMedicalStore();

    // Fetch learning items from API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/learning/topics/${topicId}/items`);
                if (!response.ok) throw new Error('Failed to fetch learning items');
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

    // Prevent body scroll when learning mode is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleNext = () => {
        if (currentItemIndex < items.length - 1) {
            setCurrentItemIndex(prev => prev + 1);
        } else {
            markRuleAsLearned(topicId);
            onComplete();
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] bg-[var(--bg-dark)] flex items-center justify-center p-3 sm:p-4">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full mx-auto mb-3 sm:mb-4" />
                    <p className="text-[var(--text-muted)] font-bold text-sm sm:text-base">Ma'lumotlar yuklanyapti...</p>
                </div>
            </div>
        );
    }

    if (error || items.length === 0) {
        return (
            <div className="fixed inset-0 z-[100] bg-[var(--bg-dark)] flex flex-col items-center justify-center p-3 sm:p-4">
                <div className="text-center max-w-sm">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-red-500">Xato</h2>
                    <p className="text-[var(--text-muted)] mb-4 sm:mb-6 text-xs sm:text-sm">{error || 'Dars ma\'lumotlari topilmadi'}</p>
                    <NeonButton onClick={onExit}>ORQAGA QAYTISH</NeonButton>
                </div>
            </div>
        );
    }

    const currentItem = items[currentItemIndex];
    const progress = ((currentItemIndex + 1) / items.length) * 100;

    return (
        <div className="fixed inset-0 z-[100] bg-[var(--bg-dark)] flex flex-col items-center justify-center p-4">
            {/* Background Orbs - Subtle */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--accent-primary)]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--accent-secondary)]/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl relative z-10"
            >
                <div className="glass-card-ultra !p-4 sm:!p-6 md:!p-8 relative overflow-hidden border border-[var(--glass-border)] shadow-[0_30px_60px_var(--glass-shadow)] !rounded-2xl bg-[var(--bg-surface)]">

                    {/* Visual Learning Context - Premium */}
                    {currentItem.image && (
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 sm:mb-8 md:mb-10 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl relative group ring-4 ring-[#ff6b00]/5"
                        >
                            <img
                                src={currentItem.image}
                                alt={topicName}
                                className="w-full h-auto object-cover max-h-[200px] sm:max-h-[250px] md:max-h-[280px] group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-2 sm:bottom-4 left-3 sm:left-6 flex items-center gap-2">
                                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ff6b00] animate-pulse" />
                                <span className="text-[7px] sm:text-[9px] font-black text-white/70 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Vizual Kontekst</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Compact Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-[#ff6b00] to-[#ff9d00] shadow-[0_0_10px_rgba(255,107,0,0.5)]"
                        />
                    </div>

                    {/* Compact Header */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6 gap-2">
                        <button
                            onClick={onExit}
                            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 group flex-shrink-0"
                        >
                            <ArrowLeft size={14} className="sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="text-center flex-1 min-w-0">
                            <div className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.3em] text-[var(--accent-primary)] mb-0.5 opacity-60">O'rganish</div>
                            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-tight opacity-40 italic truncate px-2">{topicName}</div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5 flex-shrink-0">
                            <span className="text-[8px] sm:text-[9px] font-bold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                                {currentItemIndex + 1} <span className="opacity-20 mx-0.5">/</span> {items.length}
                            </span>
                        </div>
                    </div>

                    {/* Content Area - Responsive Grid */}
                    <div className="min-h-[280px] sm:min-h-[350px] grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center">
                        {/* Image Section - LEFT Column */}
                        <AnimatePresence mode="wait">
                            {currentItem.image ? (
                                <motion.div
                                    key={`img-${currentItem.id}`}
                                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                    transition={{ delay: 0.1 }}
                                    className="hidden lg:flex items-center justify-center order-first"
                                >
                                    <div className="relative w-full max-w-xs rounded-2xl overflow-hidden border-2 border-white/15 shadow-lg ring-1 ring-[var(--accent-primary)]/30 hover:ring-[var(--accent-primary)]/50 transition-all duration-300">
                                        <img
                                            src={currentItem.image}
                                            alt={currentItem.uzbek_term}
                                            className="w-full h-auto object-cover aspect-square hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">
                                                {topicName}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={`placeholder-${currentItem.id}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="hidden lg:flex items-center justify-center order-first"
                                >
                                    <div className="w-full max-w-xs aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-white/3 border border-dashed border-white/15 flex items-center justify-center hover:border-white/30 transition-colors">
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">📋</div>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-wide">
                                                Tasvir Qo'shilmagan
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Dictionary Section - RIGHT Column */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentItem.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="flex flex-col justify-center space-y-4"
                            >
                                {/* Section 1: Latin Term */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0 }}
                                >
                                    <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--accent-primary)] opacity-50 mb-1.5">
                                        Lotincha
                                    </div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter italic text-[var(--text-primary)] leading-tight break-words">
                                        {currentItem.latin_term}
                                    </h1>
                                </motion.div>

                                {/* Section 2: Uzbek Translation */}
                                <motion.div
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--accent-secondary)] opacity-50 mb-1.5">
                                        O'zbekcha
                                    </div>
                                    <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--btn-text)] rounded-lg text-sm md:text-base font-bold uppercase tracking-tight shadow-md">
                                        {currentItem.uzbek_term}
                                    </div>
                                </motion.div>

                                {/* Section 3: Description */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--accent-primary)] opacity-50 mb-1.5">
                                        Ta'rifi
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/4 border border-white/10">
                                        <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium leading-relaxed">
                                            {currentItem.description}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Section 4: Medical Context Tags */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="text-[8px] font-bold uppercase tracking-[0.4em] text-[var(--accent-primary)] opacity-50 mb-1.5">
                                        Turi
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 rounded-md text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-tight">
                                            Anatomiya
                                        </span>
                                        <span className="px-2 py-1 bg-[var(--accent-secondary)]/15 border border-[var(--accent-secondary)]/40 rounded-md text-[10px] font-bold text-[var(--accent-secondary)] uppercase tracking-tight">
                                            Lotin
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Section 5: Progress */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center gap-2 pt-1"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
                                        {currentItemIndex + 1} / {items.length}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                {/* Action Button */}
                <div className="flex flex-col gap-3 mt-8">
                    <NeonButton
                        onClick={handleNext}
                        className="w-full !py-3 !rounded-lg group relative overflow-hidden shadow-[0_10px_25px_rgba(255,107,0,0.15)]"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-black">
                            {currentItemIndex < items.length - 1 ? (
                                <>
                                    <span>Keyingi</span>
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={14} />
                                    <span>Tugatish</span>
                                </>
                            )}
                        </div>
                    </NeonButton>
                    
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-[0.25em] opacity-40">
                            {currentItemIndex + 1} / {items.length}
                        </p>
                    </div>
                </div>
                </div>
            </motion.div>
        </div>
    );
};
