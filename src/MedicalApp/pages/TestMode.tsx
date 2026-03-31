import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Award, Trophy } from 'lucide-react';
import { NeonButton } from '../components/UIElements';
import { useMedicalStore, CertificateData } from '../store/useMedicalStore';
import { useAuth } from '../../context/AuthContext';

interface TestQuestion {
    id: number;
    topic_id: number;
    question_text: string;
    correct_answer: string;
    options: string[];
    difficulty?: string;
}

interface TestModeProps {
    topicId: number;
    topicName: string;
    onExit: (showCertificate?: boolean) => void;
}

export const TestMode: React.FC<TestModeProps> = ({ topicId, topicName, onExit }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [allQuestions, setAllQuestions] = useState<TestQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalTopics, setTotalTopics] = useState(0);

    const { markRuleAsTested, markTopicAsCompleted, completedTopics, setCertificate, certificate } = useMedicalStore();
    const { user } = useAuth();

    // Fetch test questions from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [questionsRes, topicsRes] = await Promise.all([
                    fetch(`/learning/topics/${topicId}/questions`),
                    fetch('/learning/topics')
                ]);
                
                if (!questionsRes.ok) throw new Error('Failed to fetch test questions');
                const questionsData = await questionsRes.json();
                setAllQuestions(questionsData);
                
                if (topicsRes.ok) {
                    const topicsData = await topicsRes.json();
                    setTotalTopics(topicsData.length);
                }
                
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [topicId]);

    // Randomly pick 8 questions from the pool
    const questions = useMemo(() => {
        const pool = [...allQuestions];
        const shuffled = pool.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }, [allQuestions]);

    if (loading) {
        return (
            <div className="w-full min-h-screen sm:min-h-[600px] px-3 sm:px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
                <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full mb-3 sm:mb-4" />
                <p className="text-[var(--text-muted)] font-bold text-sm sm:text-base text-center">Testlar yuklanyapti...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen sm:min-h-[600px] px-3 sm:px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
                <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 uppercase italic text-red-500 text-center">Xato</h2>
                <p className="text-[var(--text-muted)] mb-6 sm:mb-8 text-xs sm:text-sm opacity-70 text-center">{error}</p>
                <NeonButton onClick={onExit}>ORQAGA QAYTISH</NeonButton>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="w-full min-h-screen sm:min-h-[600px] px-3 sm:px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
                <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 uppercase italic text-center">Testlar hali tayyorlanmoqda</h2>
                <p className="text-[var(--text-muted)] mb-6 sm:mb-8 text-xs sm:text-sm opacity-70 text-center">Ushbu yo'nalish bo'yicha testlar yaqin orada kiritiladi.</p>
                <NeonButton onClick={onExit}>ORQAGA QAYTISH</NeonButton>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (index: number) => {
        if (isAnswerChecked) return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (selectedOption === null) return;

        setIsAnswerChecked(true);
        const chosenOption = currentQuestion.options[selectedOption];
        if (chosenOption === currentQuestion.correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswerChecked(false);
        } else {
            // Mark the topic as completed with scores
            markRuleAsTested(topicId);
            markTopicAsCompleted(topicId, score, questions.length);
            
            // Check if this was the last topic
            // completedTopics will be updated in next render, so we calculate based on current state
            const allCompletedTopics = { ...completedTopics, [topicId]: true };
            const completedCount = Object.keys(allCompletedTopics).length;
            
            console.log(`[TEST] Topic ${topicId} test completed. Score: ${score}/${questions.length}`);
            console.log(`[CHECK] Completed topics: ${completedCount}/${totalTopics}`, allCompletedTopics);
            console.log(`[DEBUG] User: ${user?.id}, Total: ${totalTopics}, Valid: ${user && totalTopics > 0}`);
            
            // If all topics are completed, generate certificate
            // We check completedCount === totalTopics, ensuring totalTopics is loaded (> 0)
            const shouldGenerateCert = completedCount === totalTopics && user && totalTopics > 0;
            
            if (shouldGenerateCert) {
                console.log('[CERT] Triggering certificate generation...');
                
                // Use setTimeout to ensure state updates are processed
                setTimeout(async () => {
                    try {
                        const storeState = useMedicalStore.getState();
                        console.log('[STORE] Current topicScores:', storeState.topicScores);
                        
                        // Calculate total scores across all topics
                        let totalCorrect = 0;
                        let totalQuestions = 0;
                        
                        // Sum all completed topic scores
                        Object.entries(storeState.topicScores).forEach(([tId, scores]) => {
                            totalCorrect += scores.correct;
                            totalQuestions += scores.total;
                            console.log(`  Topic ${tId}: ${scores.correct}/${scores.total}`);
                        });
                        
                        const percentage = totalQuestions > 0 
                            ? Math.round((totalCorrect / totalQuestions) * 100)
                            : 0;
                        
                        console.log(`[STATS] Total: ${totalCorrect}/${totalQuestions} = ${percentage}%`);
                        
                        const certData = {
                            user_id: user.id,
                            full_name: user.full_name || 'User',
                            email: user.email,
                            profile_picture: user.avatar || user.profile_picture,
                            total_topics: totalTopics,
                            completed_topics: completedCount,
                            total_questions: totalQuestions,
                            correct_answers: totalCorrect
                        };
                        
                        console.log('[API] Sending:', certData);
                        
                        const response = await fetch('/certificate/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(certData)
                        });
                        
                        if (response.ok) {
                            const cert = await response.json();
                            setCertificate(cert);
                            console.log('[SUCCESS] Certificate created:', cert);
                        } else {
                            const errText = await response.text();
                            console.error('[ERROR] Status:', response.status, errText);
                        }
                    } catch (err) {
                        console.error('[EXCEPTION]', err);
                    }
                }, 50);
            } else {
                const reasons = [];
                if (completedCount !== totalTopics) reasons.push(`count ${completedCount} !== ${totalTopics}`);
                if (!user) reasons.push('no user');
                if (totalTopics === 0) reasons.push('topics not loaded (0)');
                console.log(`[NO CERT] ${reasons.join(', ')}`);
            }
            
            setShowResults(true);
        }
    };

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        
        return (
            <div className="w-full px-3 sm:px-4 pt-8 sm:pt-12 pb-16 sm:pb-24 text-center">
                {certificate && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-[var(--accent-primary)]/10 border border-green-500/20 rounded-xl"
                    >
                        <p className="text-xs sm:text-sm font-bold text-green-500 uppercase tracking-widest mb-2">🎉 TEBRIKLAYMIZ! 🎉</p>
                        <p className="text-[var(--text-muted)] text-[11px] sm:text-xs mb-2 sm:mb-4">
                            Siz barcha mavzularning testlarini yechib sertifikatni qo'ldingiz!
                        </p>
                    </motion.div>
                )}
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_var(--glass-shadow)] mb-4 sm:mb-6">
                        {percentage >= 70 ? <Trophy size={32} className="sm:w-10 sm:h-10 text-[var(--btn-text)]" /> : <Award size={32} className="sm:w-10 sm:h-10 text-[var(--btn-text)]" />}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-1 sm:mb-2 italic text-[var(--text-primary)]">
                        {percentage}%
                    </h2>
                    <p className="text-[var(--text-muted)] text-[11px] sm:text-xs font-medium px-2">
                        {percentage >= 70
                            ? "Ajoyib natija! Siz bilasiz."
                            : "Yana urinib ko'ring."}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <div className="glass-card-ultra p-3 sm:p-4 border border-[var(--glass-border)] !rounded-lg sm:!rounded-xl bg-[var(--bg-surface)]">
                        <div className="text-[var(--text-muted)] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest mb-1 sm:mb-2">To'g'ri</div>
                        <div className="text-lg sm:text-xl font-bold text-green-500">{score}</div>
                    </div>
                    <div className="glass-card-ultra p-3 sm:p-4 border border-[var(--glass-border)] !rounded-lg sm:!rounded-xl bg-[var(--bg-surface)]">
                        <div className="text-[var(--text-muted)] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest mb-1 sm:mb-2">Xato</div>
                        <div className="text-lg sm:text-xl font-bold text-red-500">{questions.length - score}</div>
                    </div>
                </div>

                {certificate ? (
                    <div className="flex flex-col gap-2 sm:gap-3 max-w-sm mx-auto">
                        <NeonButton onClick={() => onExit(true)} className="w-full text-[10px] sm:text-xs py-2.5 sm:py-3">
                            Sertifikatni ko'rish
                        </NeonButton>
                        <button
                            onClick={() => onExit()}
                            className="w-full text-[10px] sm:text-xs py-2.5 sm:py-3 px-4 border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors rounded-lg text-[var(--text-muted)] font-bold uppercase tracking-widest"
                        >
                            Bosqichlar
                        </button>
                    </div>
                ) : (
                    <NeonButton onClick={onExit} className="w-full max-w-sm mx-auto text-[10px] sm:text-xs py-2.5 sm:py-3">Bosqichlar</NeonButton>
                )}
            </div>
        );
    }

    return (
        <div className="w-full px-3 sm:px-4 pt-4 sm:pt-6 pb-24 sm:pb-24">
            <header className="flex justify-between items-center mb-6 sm:mb-8 gap-2 flex-wrap">
                <button
                    onClick={onExit}
                    className="flex items-center gap-1.5 bg-[var(--glass-bg)] hover:bg-[var(--accent-primary)] hover:text-[var(--btn-text)] px-2 sm:px-3 py-1.5 rounded-lg transition-all border border-[var(--glass-border)] text-[7px] sm:text-[8px] font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={10} className="sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Chiq</span>
                </button>
                <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="text-[7px] sm:text-[8px] font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-1 opacity-60">Test</div>
                    <div className="text-[var(--text-primary)] font-bold text-[11px] sm:text-sm mb-2 italic truncate px-2">
                        {topicName}
                    </div>
                    <div className="h-0.5 w-8 sm:w-12 bg-[var(--accent-primary)] rounded-full" />
                    <div className="flex gap-0.5 sm:gap-1 mt-2 flex-wrap justify-center">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-0.5 rounded-full transition-all duration-500 ${i === currentQuestionIndex ? 'bg-[var(--accent-primary)] w-3 sm:w-4' :
                                    i < currentQuestionIndex ? 'bg-[var(--accent-primary)]/30 w-1.5 sm:w-2' : 'bg-[var(--glass-border)] w-1.5 sm:w-2'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="hidden sm:block w-12"></div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-4 sm:mb-6">
                        <div className="text-[var(--accent-primary)] font-bold italic text-[7px] sm:text-[8px] uppercase tracking-widest mb-1 sm:mb-2 opacity-70">SAVOL {currentQuestionIndex + 1}/{questions.length}</div>
                        <h2 className="text-sm sm:text-lg md:text-xl font-bold leading-snug uppercase tracking-tight italic text-[var(--text-primary)]">
                            {currentQuestion.question_text}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-4 sm:mb-6">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrect = isAnswerChecked && option === currentQuestion.correct_answer;
                            const isWrong = isAnswerChecked && isSelected && option !== currentQuestion.correct_answer;

                            let borderClass = "border-[var(--glass-border)]/10";
                            let bgClass = "bg-[var(--glass-bg)]/5";
                            let icon = null;

                            if (isCorrect) {
                                borderClass = "border-green-500 shadow-[0_5px_15px_rgba(34,197,94,0.1)]";
                                bgClass = "bg-green-500/5";
                                icon = <CheckCircle2 size={16} className="text-green-500" />;
                            } else if (isWrong) {
                                borderClass = "border-red-500 shadow-[0_5px_15px_rgba(239,68,68,0.1)]";
                                bgClass = "bg-red-500/5";
                                icon = <XCircle size={16} className="text-red-500" />;
                            } else if (isSelected) {
                                borderClass = "border-[var(--accent-primary)] shadow-[0_8px_20px_var(--glass-shadow)] -translate-y-0.5";
                                bgClass = "bg-[var(--accent-primary)]/5";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isAnswerChecked}
                                    className={`w-full text-left p-2.5 sm:p-3 md:p-4 rounded-lg border transition-all duration-300 flex items-center justify-between group ${borderClass} ${bgClass}`}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className={`w-6 sm:w-7 h-6 sm:h-7 rounded-lg flex items-center justify-center font-bold text-[9px] sm:text-[10px] transition-all border border-[var(--glass-border)] flex-shrink-0 ${isSelected ? 'bg-[var(--accent-primary)] text-[var(--btn-text)]' : 'bg-[var(--glass-bg)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className={`text-[11px] sm:text-sm font-medium transition-colors truncate ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>
                                            {option}
                                        </span>
                                    </div>
                                    {icon && <div className="ml-2 flex-shrink-0">{icon}</div>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3">
                        {!isAnswerChecked ? (
                            <NeonButton
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null}
                                className={`w-full py-2.5 sm:py-3 text-[10px] sm:text-xs ${selectedOption === null ? 'opacity-50' : ''}`}
                            >
                                TEKSHIRISH
                            </NeonButton>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-2 sm:gap-3"
                            >
                                <div className={`p-2 sm:p-2.5 rounded-lg border text-center font-bold uppercase tracking-widest text-[7px] sm:text-[8px] ${currentQuestion.options[selectedOption!] === currentQuestion.correct_answer
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}>
                                    {currentQuestion.options[selectedOption!] === currentQuestion.correct_answer
                                        ? "To'g'ri!"
                                        : "Xato"}
                                </div>
                                <NeonButton
                                    onClick={handleNextQuestion}
                                    className="w-full py-2.5 sm:py-3 text-[10px] sm:text-xs"
                                    variant="secondary"
                                >
                                    {currentQuestionIndex + 1 < questions.length ? "KEYINGI" : "NATIJA"} <ChevronRight className="ml-1 inline" size={10} />
                                </NeonButton>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
