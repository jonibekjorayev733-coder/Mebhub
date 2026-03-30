import React, { useState } from 'react';
import { Book, GraduationCap, Mail, Phone, MapPin, X, Moon, Sun, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMedicalStore } from '../store/useMedicalStore';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
    onStart?: () => void;
    hideHeaderFooter?: boolean;
}

export const MainLayout: React.FC<LayoutProps> = ({ children, onStart, hideHeaderFooter }) => {
    const { isDarkMode } = useMedicalStore();

    return (
        <div className={`pro-ultra-container selection:bg-[#ff6b00]/30 selection:text-white overflow-x-hidden ${!isDarkMode ? 'light-mode' : ''}`}>
            {/* Background Orbs */}
            <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[var(--accent-primary)]/5 rounded-full blur-[120px] pointer-events-none animate-magnetic" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-[var(--accent-secondary)]/5 rounded-full blur-[100px] pointer-events-none animate-ether" />

            {!hideHeaderFooter && <Header onStart={onStart} />}
            <main className={`relative z-10 w-full overflow-x-hidden ${hideHeaderFooter ? '' : 'pt-20 md:pt-28'}`}>
                {children}
            </main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

const Header: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDarkMode, toggleDarkMode } = useMedicalStore();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (onStart) {
            onStart();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const scrollToTopics = () => {
        if (onStart) {
            onStart();
        } else {
            const el = document.getElementById('topics');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 flex justify-center">
            <nav className="max-w-7xl w-full glass-card-ultra !rounded-2xl md:!rounded-3xl px-6 md:px-10 py-3 md:py-4 flex items-center justify-between border-[var(--glass-border)] bg-[var(--bg-surface)] backdrop-blur-3xl shadow-[0_20px_50px_var(--glass-shadow)]">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogoClick}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[var(--accent-primary)] rounded-lg md:rounded-xl flex items-center justify-center font-black text-[var(--btn-text)] group-hover:rotate-12 transition-transform shadow-[0_0_20px_var(--glass-shadow)]">
                        L
                    </div>
                    <span className="font-display font-black text-sm md:text-xl tracking-tighter uppercase italic leading-tight">
                        Lotin tili va <br className="md:hidden" /> <span className="text-[var(--accent-primary)]">tibbiy terminologiya</span>
                    </span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <HeaderLink href="#home">ASOSIY</HeaderLink>
                    <HeaderLink href="#topics">DARSLAR</HeaderLink>
                    <HeaderLink href="#features">METODIKA</HeaderLink>
                    <HeaderLink href="#about">LOYIHA</HeaderLink>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[#ff6b00]"
                        title={isDarkMode ? "Yorug' rejim" : "Qorong'u rejim"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-xs font-semibold text-white/70 truncate max-w-[150px]">{user.email}</span>
                            </div>
                            {(user as any).is_admin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="hidden md:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2.5 rounded-xl text-[10px] tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                >
                                    ⚙️ ADMIN
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2.5 rounded-xl text-[10px] tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)]"
                            >
                                <LogOut size={16} />
                                CHIQISH
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black px-6 py-2.5 rounded-xl text-[10px] tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)]"
                        >
                            KIRISH
                        </button>
                    )}

                    <button
                        onClick={scrollToTopics}
                        className="hidden md:block bg-[var(--btn-primary)] text-[var(--btn-text)] font-black px-6 py-2.5 rounded-xl text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,107,0,0.2)]"
                    >
                        BOSHLASH
                    </button>

                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : (
                            <div className="space-y-1.5">
                                <div className="w-6 h-0.5 bg-white"></div>
                                <div className="w-6 h-0.5 bg-[#ff6b00]"></div>
                            </div>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[60] flex flex-col items-center justify-center lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-10 right-10 p-4 border border-white/10 rounded-full"
                    >
                        <X size={32} className="text-[#ff6b00]" />
                    </button>
                    <div className="flex flex-col items-center gap-10">
                        <MobileLink onClick={() => setIsMenuOpen(false)} href="#home">ASOSIY</MobileLink>
                        <MobileLink onClick={scrollToTopics} href="#topics">DARSLAR</MobileLink>
                        <MobileLink onClick={() => setIsMenuOpen(false)} href="#about">LOYIHA</MobileLink>
                        <MobileLink onClick={() => setIsMenuOpen(false)} href="#features">METODIKA</MobileLink>

                        <div className="flex flex-col items-center gap-4 mt-4">
                            <span className="text-[10px] font-black tracking-[0.3em] text-[#ff6b00] uppercase opacity-60">REJIMNI TANLANG</span>
                            <button
                                onClick={toggleDarkMode}
                                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff6b00] hover:bg-white/10 transition-all"
                            >
                                {isDarkMode ? <Sun size={32} /> : <Moon size={32} />}
                            </button>
                        </div>

                        {user ? (
                            <div className="flex flex-col items-center gap-4 mt-4">
                                <div className="text-center">
                                    <p className="text-xs text-white/50 mb-2">HISOBGA KIRGAN</p>
                                    <p className="text-sm font-semibold text-white">{user.email}</p>
                                </div>
                                {(user as any).is_admin && (
                                    <button
                                        onClick={() => {
                                            navigate('/admin');
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all w-full justify-center"
                                    >
                                        ⚙️ ADMIN PANEL
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all w-full justify-center"
                                >
                                    <LogOut size={24} />
                                    CHIQISH
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black px-12 py-5 rounded-2xl text-lg uppercase tracking-widest transition-all w-full"
                            >
                                HISOBGA KIRISH
                            </button>
                        )}

                        <button
                            onClick={scrollToTopics}
                            className="bg-[var(--btn-primary)] text-[var(--btn-text)] font-black px-12 py-5 rounded-2xl text-lg mt-4 uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_var(--glass-shadow)]"
                        >
                            HOZIROQ BOSHLASH
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

const MobileLink: React.FC<{ href: string; children: React.ReactNode; onClick: () => void }> = ({ href, children, onClick }) => (
    <a
        href={href}
        onClick={onClick}
        className="text-3xl font-black text-white hover:text-[#ff6b00] transition-colors tracking-tighter uppercase italic"
    >
        {children}
    </a>
)

const HeaderLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a
        href={href}
        className="text-[11px] font-black text-white/60 hover:text-[#ff6b00] transition-all tracking-[0.2em] uppercase relative group"
    >
        {children}
        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#ff6b00] group-hover:w-full transition-all duration-300" />
    </a>
);

const Footer: React.FC = () => {
    return (
        <footer className="mt-40 border-t border-white/5 bg-[var(--bg-dark)] pt-32 pb-12 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ff6b00]/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-32 relative z-10">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#ff6b00] rounded-xl flex items-center justify-center font-black text-black">
                            L
                        </div>
                        <span className="font-display font-black text-2xl tracking-tighter uppercase italic">
                            LOTIN TILI VA TIBBIY TERMINOLOGIYA
                        </span>
                    </div>
                    <p className="text-text-muted leading-relaxed mb-10 font-medium text-lg">
                        Lotin tilini o'rganish endi juda oddiy va qiziqarli. Zamonaviy metodika asosida terminlarni tez yod oling.
                    </p>
                    <div className="flex gap-5">
                        {[Book, GraduationCap, Mail, Phone].map((Icon, idx) => (
                            <div key={idx} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-[#ff6b00] hover:text-black transition-all cursor-pointer group shadow-xl">
                                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-display font-black text-xs uppercase mb-10 tracking-[0.3em] text-[var(--accent-primary)]">
                        PLATFORMA
                    </h4>
                    <ul className="space-y-5">
                        <FooterLink>Barcha Darslar</FooterLink>
                        <FooterLink>Interaktiv Mashqlar</FooterLink>
                        <FooterLink>Terminologiya</FooterLink>
                        <FooterLink>Reyting</FooterLink>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display font-black text-xs uppercase mb-10 tracking-[0.3em] text-[var(--accent-primary)]">
                        ALOQA
                    </h4>
                    <ul className="space-y-6 text-text-muted font-medium text-lg">
                        <li className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                            <Mail size={20} className="text-[#ff6b00]" />
                            <span>info@lugat-pro.uz</span>
                        </li>
                        <li className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                            <Phone size={20} className="text-[#ff6b00]" />
                            <span>+998 90 222-33-44</span>
                        </li>
                        <li className="flex items-center gap-4 group cursor-pointer hover:text-white transition-colors">
                            <MapPin size={20} className="text-[#ff6b00]" />
                            <span>Toshkent, O'zbekiston</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-display font-black text-xs uppercase mb-10 tracking-[0.3em] text-[var(--accent-primary)]">
                        TAYYORGARLIK
                    </h4>
                    <p className="text-text-muted mb-8 font-medium">Yangi darslardan xabardor bo'ling!</p>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Email manzilingiz"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-[#ff6b00] transition-all group-hover:bg-white/[0.08]"
                        />
                        <button className="absolute right-3 top-3 bottom-3 bg-[var(--btn-primary)] text-[var(--btn-text)] px-4 rounded-xl font-black text-[10px] uppercase">
                            OK
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-text-muted font-black uppercase tracking-[0.3em]">
                <span className="opacity-50">&copy; 2026 LOTIN TILI VA TIBBIY TERMINOLOGIYA. BARCHA HUQUQLAR HIMOYALANGAN.</span>
                <div className="flex gap-10">
                    <span className="hover:text-[#ff6b00] cursor-pointer transition-colors">Maxfiylik</span>
                    <span className="hover:text-[#ff6b00] cursor-pointer transition-colors">Shartlar</span>
                </div>
            </div>
        </footer >
    );
};

const FooterLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li>
        <a href="#" className="text-text-muted hover:text-[#ff6b00] transition-colors uppercase text-sm font-semibold tracking-wider">
            {children}
        </a>
    </li>
);
