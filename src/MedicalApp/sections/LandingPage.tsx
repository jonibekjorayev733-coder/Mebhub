import React from 'react';
import { Hero, StatsSection, Features } from './LandingSections';
import { HomePage } from '../pages/HomePage';

interface DatabaseTopic {
    id: number;
    name: string;
    description: string;
}

interface LandingPageProps {
    onSelectTopic: (id: number) => void;
    topics?: DatabaseTopic[];
    loading?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectTopic }) => {
    return (
        <div id="home" className="space-y-12 md:space-y-16 pb-24 overflow-hidden">
            <Hero onStart={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })} />

            <StatsSection />

            <section id="topics" className="max-w-7xl mx-auto px-6 py-8 w-full scroll-mt-24">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-black mb-1.5 uppercase tracking-tighter italic">
                        Mavjud <span className="text-[#ff6b00]">yo'nalishlar</span>
                    </h2>
                    <p className="text-[#ff6b00] text-[9px] font-bold tracking-[0.3em] uppercase opacity-60">
                        O'zingizga mos bo'lgan lotin tili yo'nalishini tanlang
                    </p>
                </div>

                <HomePage onSelectTopic={onSelectTopic} isEmbedded={true} />
            </section>

            <Features />

            <section id="about" className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="relative group order-2 md:order-1">
                    <div className="absolute -inset-4 bg-[#ff6b00]/10 rounded-[30px] blur-3xl group-hover:bg-[#ff6b00]/20 transition-all duration-700" />
                    <div className="relative glass-card-ultra aspect-video md:aspect-square rounded-2xl overflow-hidden border-white/5 p-1">
                        <img
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
                            alt="Terminology Illustration"
                            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 opacity-80"
                        />
                    </div>
                </div>

                <div className="text-left order-1 md:order-2">
                    <div className="text-[#ff6b00] font-bold text-[9px] uppercase tracking-[0.3em] mb-3">
                        BIZ HAQIMIZDA
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight uppercase tracking-tighter">
                        Lotin tilini o'rganish <br />
                        <span className="neon-text-orange italic text-lg md:text-2xl">ENDI ZERIKARLI EMAS!</span>
                    </h2>
                    <p className="text-text-muted text-xs md:text-sm leading-relaxed mb-6 font-medium opacity-80">
                        Biz kitoblarni chetga surib, lotin tilini zamonaviy va vizual usulda o'rganishni taklif qilamiz. Premium dizayn va interaktivlik sizga yordam beradi.
                    </p>
                    <ul className="space-y-3">
                        {[
                            { t: "Interaktiv darslar", d: "Zerikib qolmaysiz!" },
                            { t: "Bilimingizni sinang", d: "Sodda va qiziqarli testlar." },
                            { t: "Eng muhimi", d: "Miyani charchatmaydigan darajada sodda." }
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 group">
                                <div className="w-4 h-4 rounded-full bg-[#ff6b00]/20 border border-[#ff6b00]/40 flex items-center justify-center text-[#ff6b00] text-[8px] font-black mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0">
                                    ✓
                                </div>
                                <div>
                                    <div className="text-white font-bold uppercase text-[9px] tracking-wide mb-0.5">{item.t}</div>
                                    <div className="text-text-muted text-[11px] font-medium opacity-70">{item.d}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};
