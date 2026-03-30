import React from 'react';
import { motion } from 'framer-motion';
import { Play, Shield, Globe, Award, TrendingUp, Users, BookOpen } from 'lucide-react';

import { NeonButton } from '../components/UIElements';

export const Hero: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
    return (
        <section id="home" className="pt-24 md:pt-36 pb-12 px-6 max-w-7xl mx-auto text-center relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="inline-block px-4 py-1.5 rounded-full border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 text-[var(--accent-primary)] text-[10px] font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-sm shadow-[0_4px_15px_var(--glass-shadow)]"
            >
                Professional Lotin Tili Platformasi
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-7xl font-black mb-6 leading-tight tracking-tighter uppercase italic"
            >
                LOTIN TILI VA <br />
                <span className="neon-text-orange drop-shadow-[0_0_20px_rgba(255,107,0,0.2)]">TIBBIY TERMINOLOGIYA</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-xl mx-auto text-sm md:text-lg text-[var(--text-muted)] mb-10 leading-relaxed font-medium opacity-80"
            >
                Anatomik terminlar va lotin tili grammatikasini zamonaviy, vizual va qiziqarli usulda o'rganing. Professional talabalar uchun maxsus platforma.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col md:flex-row justify-center items-center gap-4"
            >
                <NeonButton onClick={onStart} className="px-8 py-4">
                    Hoziroq boshlash <Play size={14} className="ml-2 inline" fill="currentColor" />
                </NeonButton>
                <button
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] text-[var(--text-primary)] font-black px-8 py-3.5 rounded-xl hover:bg-[var(--accent-primary)] hover:text-[var(--btn-text)] transition-all text-[10px] tracking-widest uppercase shadow-lg"
                >
                    BIZ HAQIMIZDA
                </button>
            </motion.div>
        </section>
    );
};

export const StatsSection: React.FC = () => {
    const stats = [
        { icon: <Users size={20} />, label: "Talabalar", value: "10K+" },
        { icon: <BookOpen size={20} />, label: "Terminlar", value: "2,000+" },
        { icon: <Award size={20} />, label: "Mavzular", value: "4 ta yo'nalish" },
        { icon: <TrendingUp size={20} />, label: "Natija", value: "100%" },
    ];

    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card-ultra p-6 text-center border-[var(--glass-border)] !rounded-2xl md:!rounded-3xl bg-[var(--bg-surface)]"
                    >
                        <div className="w-10 h-10 bg-[var(--accent-primary)]/10 rounded-xl flex items-center justify-center text-[var(--accent-primary)] mx-auto mb-4 border border-[var(--accent-primary)]/20 shadow-sm">
                            {stat.icon}
                        </div>
                        <div className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-[var(--text-primary)]">{stat.value}</div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-black opacity-80">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export const Features: React.FC = () => {
    const features = [
        {
            icon: <Globe size={32} />,
            title: "Ishonchli Manba",
            desc: "Bizdagi barcha ma'lumotlar eng ishonchli darsliklardan olingan."
        },
        {
            icon: <Shield size={32} />,
            title: "Sifatli Ta'lim",
            desc: "Faqat eng kerakli va tasdiqlangan bilimlarni o'rganasiz."
        },
        {
            icon: <Award size={32} />,
            title: "Sertifikat",
            desc: "Kursni tugatib, o'z bilimingizni isbotlovchi sertifikatga ega bo'ling."
        }
    ];

    return (
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-tight italic">
                    Nega aynan <span className="text-[var(--accent-primary)]">bizni tanlaysiz?</span>
                </h2>
                <p className="text-[var(--text-muted)] max-w-xl mx-auto text-base font-medium leading-relaxed">
                    Biz quruq nazariya bilan cheklanmaymiz. Lotin tili grammatikasi va tibbiy terminologiyani birgalikda, vizual metodika asosida o'rganing.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="glass-card-ultra p-8 border-[var(--glass-border)] group bg-[var(--bg-surface)] !rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/5 flex items-center justify-center text-[var(--accent-primary)] mb-8 border border-[var(--glass-border)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--btn-text)] transition-colors">
                            {f.icon}
                        </div>
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-[var(--text-primary)]">{f.title}</h3>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">
                            {f.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
