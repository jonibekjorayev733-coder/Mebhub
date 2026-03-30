import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MedicalState {
    currentTopicId: number | null;
    currentRuleId: number | null;
    learnedRules: Record<number, boolean>; // ruleId: boolean
    testedRules: Record<number, boolean>; // ruleId: boolean
    isDarkMode: boolean;

    toggleDarkMode: () => void;
    setCurrentTopic: (id: number | null) => void;
    setCurrentRule: (id: number | null) => void;
    markRuleAsLearned: (ruleId: number) => void;
    markRuleAsTested: (ruleId: number) => void;
    resetProgress: () => void;
}

export const useMedicalStore = create<MedicalState>()(
    persist(
        (set) => ({
            currentTopicId: null,
            currentRuleId: null,
            learnedRules: {},
            testedRules: {},
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

            resetProgress: () => set({ learnedRules: {}, testedRules: {} }),
        }),
        {
            name: 'lugat-storage',
        }
    )
);
