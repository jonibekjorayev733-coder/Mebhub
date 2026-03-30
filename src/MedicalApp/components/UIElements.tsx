import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick, hoverEffect = true }) => {
    return (
        <motion.div
            whileHover={hoverEffect ? { scale: 1.01, translateY: -2 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={onClick}
            className={`glass-card-ultra p-4 md:p-6 ${className} ${onClick ? 'cursor-pointer' : ''}`}
            style={{ borderWidth: '1px' }}
        >
            {children}
        </motion.div>
    );
};

interface NeonButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'locked';
    className?: string;
    disabled?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    className = "",
    disabled = false
}) => {
    const getStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-[var(--btn-primary)] text-[var(--btn-text)] shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_8px_0_0_rgba(0,0,0,0.05)] hover:-translate-y-1 active:translate-y-0';
            case 'secondary':
                return 'bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--btn-text)]';
            case 'locked':
                return 'bg-[var(--glass-bg)] text-[var(--text-muted)] cursor-not-allowed opacity-40 border border-[var(--glass-border)]';
            default:
                return '';
        }
    };

    return (
        <motion.button
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={!disabled ? onClick : undefined}
            className={`px-5 py-3 rounded-2xl font-black transition-all duration-300 text-[11px] md:text-sm tracking-[0.1em] uppercase border-2 border-[var(--glass-border)] ${getStyles()} ${className}`}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};
