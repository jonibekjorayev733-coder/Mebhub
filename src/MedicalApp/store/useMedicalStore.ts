import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CertificateData {
    id?: number;
    user_id: number;
    full_name: string;
    email: string;
    profile_picture?: string | null;
    total_topics: number;
    completed_topics: number;
    total_questions: number;
    correct_answers: number;
    percentage: number;
    issued_date: string;
    certificate_number: string;
    signature: string;
}

interface MedicalState {
    currentTopicId: number | null;
    currentRuleId: number | null;
    learnedRules: Record<number, boolean>; // ruleId: boolean
    testedRules: Record<number, boolean>; // ruleId: boolean
    completedTopics: Record<number, boolean>; // topicId: boolean
    topicScores: Record<number, { correct: number; total: number }>; // topicId: {correct, total}
    certificate: CertificateData | null;
    isDarkMode: boolean;

    toggleDarkMode: () => void;
    setCurrentTopic: (id: number | null) => void;
    setCurrentRule: (id: number | null) => void;
    markRuleAsLearned: (ruleId: number) => void;
    markRuleAsTested: (ruleId: number) => void;
    markTopicAsCompleted: (topicId: number, correct: number, total: number) => void;
    setCertificate: (cert: CertificateData | null) => void;
    resetProgress: () => void;
}

export const useMedicalStore = create<MedicalState>()(
    persist(
        (set) => ({
            currentTopicId: null,
            currentRuleId: null,
            learnedRules: {},
            testedRules: {},
            completedTopics: {},
            topicScores: {},
            certificate: null,
            isDarkMode: true,

            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            setCurrentTopic: (id) => set({ currentTopicId: id, currentRuleId: null }),
            setCurrentRule: (id) => set({ currentRuleId: id }),

            markRuleAsLearned: (ruleId) =>
                set((state) => ({
                    learnedRules: { ...state.learnedRules, [ruleId]: true }
                })),

            markRuleAsTested: (ruleId) =>
                set((state) => ({
                    testedRules: { ...state.testedRules, [ruleId]: true }
                })),

            markTopicAsCompleted: (topicId, correct, total) =>
                set((state) => ({
                    completedTopics: { ...state.completedTopics, [topicId]: true },
                    topicScores: { ...state.topicScores, [topicId]: { correct, total } }
                })),

            setCertificate: (cert) => set({ certificate: cert }),

            resetProgress: () => set({ learnedRules: {}, testedRules: {}, completedTopics: {}, topicScores: {}, certificate: null }),
        }),
        {
            name: 'lugat-storage',
        }
    )
);
