import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Award, Trophy } from 'lucide-react';
import { NeonButton } from '../components/UIElements';
import { useMedicalStore } from '../store/useMedicalStore';

interface TestQuestion {
    id: number;
    topic_id: number;
    question_text: string;
    correct_answer: string;
    options: string[];
    difficulty: string;
}

interface TestModeProps {
    topicId: number;
    topicName: string;
    onExit: () => void;
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

    // Fetch test questions from API
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/learning/topics/${topicId}/questions`);
                if (!response.ok) throw new Error('Failed to fetch test questions');
                const data = await response.json();
                setAllQuestions(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [topicId]);

    // Randomly pick 8 questions from the pool
    const questions = useMemo(() => {
        const pool = [...allQuestions];
        const shuffled = pool.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 8);
    }, [allQuestions]);

    const { markRuleAsTested } = useMedicalStore();

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin w-12 h-12 border-4 border-[var(--accent-primary)]/20 border-t-[var(--accent-primary)] rounded-full mx-auto mb-4" />
                <p className="text-[var(--text-muted)] font-bold">Testlar yuklanyapti...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-black mb-4 uppercase italic text-red-500">Xato</h2>
                <p className="text-[var(--text-muted)] mb-8 text-sm md:text-base opacity-70">{error}</p>
                <NeonButton onClick={onExit}>ORQAGA QAYTISH</NeonButton>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-black mb-4 uppercase italic">Testlar hali tayyorlanmoqda</h2>
                <p className="text-[var(--text-muted)] mb-8 text-sm md:text-base opacity-70">Ushbu yo'nalish bo'yicha testlar yaqin orada kiritiladi.</p>
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
        if (chosenOption === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswerChecked(false);
        } else {
            markRuleAsTested(topicId);
            setShowResults(true);
        }
    };

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="max-w-2xl mx-auto px-6 pt-12 pb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <div className="w-20 h-20 bg-[var(--accent-primary)] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_var(--glass-shadow)] mb-6">
                        {percentage >= 70 ? <Trophy size={40} className="text-[var(--btn-text)]" /> : <Award size={40} className="text-[var(--btn-text)]" />}
                    </div>
                    <h2 className="text-3xl font-bold uppercase tracking-tight mb-2 italic text-[var(--text-primary)]">
                        {percentage}%
                    </h2>
                    <p className="text-[var(--text-muted)] text-xs font-medium">
                        {percentage >= 70
                            ? "Ajoyib natija! Siz bilasiz."
                            : "Yana urinib ko'ring."}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="glass-card-ultra p-3 border border-[var(--glass-border)] !rounded-lg bg-[var(--bg-surface)]">
                        <div className="text-[var(--text-muted)] text-[8px] font-bold uppercase tracking-widest mb-1">To'g'ri</div>
                        <div className="text-xl font-bold text-green-500">{score}</div>
                    </div>
                    <div className="glass-card-ultra p-3 border border-[var(--glass-border)] !rounded-lg bg-[var(--bg-surface)]">
                        <div className="text-[var(--text-muted)] text-[8px] font-bold uppercase tracking-widest mb-1">Xato</div>
                        <div className="text-xl font-bold text-red-500">{questions.length - score}</div>
                    </div>
                </div>

                <NeonButton onClick={onExit} className="w-full text-xs py-2.5">Bosqichlar</NeonButton>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-24 md:pt-10">
            <header className="flex justify-between items-center mb-8 px-2 gap-2">
                <button
                    onClick={onExit}
                    className="flex items-center gap-1.5 bg-[var(--glass-bg)] hover:bg-[var(--accent-primary)] hover:text-[var(--btn-text)] px-3 py-1.5 rounded-lg transition-all border border-[var(--glass-border)] text-[8px] font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={12} />
                    <span>Chiq</span>
                </button>
                <div className="flex flex-col items-center flex-1">
                    <div className="text-[8px] font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-1 opacity-60">Test</div>
                    <div className="text-[var(--text-primary)] font-bold text-sm mb-1.5 italic">
                        {topicName}
                    </div>
                    <div className="h-0.5 w-12 bg-[var(--accent-primary)] rounded-full mx-auto" />
                    <div className="flex gap-1 mt-2">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-0.5 w-2 md:w-3 rounded-full transition-all duration-500 ${i === currentQuestionIndex ? 'bg-[var(--accent-primary)] !w-4' :
                                    i < currentQuestionIndex ? 'bg-[var(--accent-primary)]/30' : 'bg-[var(--glass-border)]'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="hidden md:block w-12"></div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-6">
                        <div className="text-[var(--accent-primary)] font-bold italic text-[8px] uppercase tracking-widest mb-2">SAVOL {currentQuestionIndex + 1}/{questions.length}</div>
                        <h2 className="text-lg md:text-xl font-bold leading-snug uppercase tracking-tight italic text-[var(--text-primary)]">
                            {currentQuestion.question_text}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mb-6">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrect = isAnswerChecked && option === currentQuestion.correctAnswer;
                            const isWrong = isAnswerChecked && isSelected && option !== currentQuestion.correctAnswer;

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
                                    className={`w-full text-left p-3 md:p-4 rounded-lg border transition-all duration-300 flex items-center justify-between group ${borderClass} ${bgClass}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all border border-[var(--glass-border)] ${isSelected ? 'bg-[var(--accent-primary)] text-[var(--btn-text)]' : 'bg-[var(--glass-bg)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className={`text-xs md:text-sm font-medium transition-colors ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>
                                            {option}
                                        </span>
                                    </div>
                                    {icon}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-2">
                        {!isAnswerChecked ? (
                            <NeonButton
                                onClick={handleCheckAnswer}
                                disabled={selectedOption === null}
                                className={`w-full py-2.5 text-xs ${selectedOption === null ? 'opacity-50' : ''}`}
                            >
                                TEKSHIRISH
                            </NeonButton>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-3"
                            >
                                <div className={`p-2.5 rounded-lg border text-center font-bold uppercase tracking-widest text-[8px] ${currentQuestion.options[selectedOption!] === currentQuestion.correctAnswer
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                    }`}>
                                    {currentQuestion.options[selectedOption!] === currentQuestion.correctAnswer
                                        ? "To'g'ri!"
                                        : "Xato"}
                                </div>
                                <NeonButton
                                    onClick={handleNextQuestion}
                                    className="w-full py-2.5 text-xs"
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
