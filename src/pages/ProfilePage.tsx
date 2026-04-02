import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Camera, Save, X, Mail, User as UserIcon, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
    onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
    const { user, logout, setUser, token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                email: user.email || '',
            });
            setPreviewImage(user.profile_picture || user.avatar || null);
        }
    }, [user]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            let authToken = token;
            if (!authToken) {
                authToken = localStorage.getItem('auth_token');
            }
            
            if (!authToken) {
                alert('Iltimos, avval kirish qiling');
                setIsSaving(false);
                if (onBack) onBack();
                return;
            }

            const updateData = {
                full_name: formData.full_name,
                profile_picture: previewImage
            };

            const { getAPIBaseURL } = await import('../utils/authService');
            const response = await fetch(`${getAPIBaseURL()}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                // Ensure preview image is updated
                setPreviewImage(updatedUser.profile_picture || updatedUser.avatar || previewImage);
                localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                setIsEditing(false);
                alert('Profil muvaffaqiyatli yangilandi!');
            } else {
                alert('Profil yangilanishida xato');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Profil yangilanishida xato');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        if (onBack) {
            onBack();
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewImage(user?.profile_picture || user?.avatar || null);
        setFormData({
            full_name: user?.full_name || '',
            email: user?.email || '',
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                        Iltimos, kirish qiling
                    </h2>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="bg-[#ff6b00] hover:bg-[#ff8c00] text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                            Orqaga qaytish
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const displayImage = previewImage || user.avatar || user.profile_picture;
    const initials = user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-surface)] py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-8"
                >
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-[var(--glass-bg)] rounded-lg transition border border-[var(--glass-border)]"
                        >
                            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
                        </button>
                    )}
                    <h1 className="text-3xl font-black uppercase tracking-tight italic text-[var(--text-primary)]">
                        Profil
                    </h1>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card-ultra border border-[var(--glass-border)] rounded-2xl overflow-hidden"
                >
                    {/* Background Header */}
                    <div className="h-32 bg-gradient-to-r from-[#ff6b00] to-[#ff8c00]" />

                    {/* Profile Content */}
                    <div className="px-6 pb-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center -mt-20 mb-6">
                            <div className="relative">
                                {displayImage ? (
                                    <img
                                        src={displayImage}
                                        alt={user.full_name}
                                        className="w-32 h-32 rounded-full border-4 border-[var(--bg-primary)] object-cover shadow-xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-[var(--bg-primary)] bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] flex items-center justify-center shadow-xl">
                                        <span className="text-4xl font-black text-white">
                                            {initials}
                                        </span>
                                    </div>
                                )}

                                {isEditing && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-2 right-2 bg-[#ff6b00] hover:bg-[#ff8c00] text-white p-2 rounded-full shadow-lg transition"
                                    >
                                        <Camera size={20} />
                                    </button>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 flex items-center gap-2 bg-[#ff6b00]/10 hover:bg-[#ff6b00]/20 text-[#ff6b00] px-4 py-2 rounded-lg transition border border-[#ff6b00]/30 font-bold"
                                >
                                    <Edit2 size={16} />
                                    O'ZGARTIRISH
                                </button>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 mb-8">
                            {/* Full Name */}
                            <div>
                                <label className="block text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mb-2">
                                    <div className="flex items-center gap-2">
                                        <UserIcon size={14} />
                                        TO'LIQ ISM
                                    </div>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[#ff6b00] transition"
                                        placeholder="To'liq ismingizni kiriting"
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-[var(--text-primary)]">
                                        {user.full_name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mb-2">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} />
                                        EMAIL
                                    </div>
                                </label>
                                <p className="text-lg font-bold text-[var(--text-primary)]">
                                    {user.email}
                                </p>
                                <p className="text-[var(--text-muted)] text-xs mt-1">
                                    O'zgartirib bo'lmaydi
                                </p>
                            </div>

                            {/* User ID */}
                            <div>
                                <label className="block text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mb-2">
                                    User ID
                                </label>
                                <p className="text-lg font-bold text-[var(--text-primary)]">
                                    #{user.id}
                                </p>
                            </div>

                            {/* Account Status */}
                            <div className="pt-4 border-t border-[var(--glass-border)]">
                                <p className="text-[var(--text-muted)] text-sm font-bold uppercase tracking-widest mb-2">
                                    HISOBI HOLATI
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <p className="text-[var(--text-primary)] font-bold">
                                        Faol
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        {isSaving ? 'SAQLANMOQDA...' : 'SAQLASH'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                                    >
                                        <X size={18} />
                                        BEKOR QILISH
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-500 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} />
                                    CHIQISH
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                >
                    <p className="text-blue-500 text-sm leading-relaxed">
                        <strong>💡 Maslahat:</strong> Profil rasmingizni o'zgartirish uchun "O'ZGARTIRISH" tugmasini bosing va rasm tanlang. 
                        To'liq ismingizni yangilashingiz mumkin.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
