
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import './TeacherPanel_clean.css';

const API_BASE = 'http://127.0.0.1:8000';

// [voice:/uploads/voice/xxx.webm] formatidagi xabarni aniqlash
const isVoiceMessage = (msg: string) => /^\[voice:(.+)\]$/.test(msg);
const getVoiceUrl = (msg: string) => {
    const match = msg.match(/^\[voice:(.+)\]$/);
    return match ? `${API_BASE}${match[1]}` : '';
};

// [file:URL|filename|size|content_type] formatidagi xabarni aniqlash
const isFileMessage = (msg: string) => /^\[file:(.+?)\|(.+?)\|(.+?)\|(.+?)\]$/.test(msg);
const parseFileMessage = (msg: string) => {
    const match = msg.match(/^\[file:(.+?)\|(.+?)\|(.+?)\|(.+?)\]$/);
    if (!match) return null;
    return {
        url: `${API_BASE}${match[1]}`,
        name: match[2],
        size: parseInt(match[3]),
        contentType: match[4],
    };
};
const isVideoType = (ct: string) => ct.startsWith('video/');
const isImageType = (ct: string) => ct.startsWith('image/');

interface Student {
    id: number;
    username: string;
    email: string;
    unread_count: number;
    last_message: string | null;
    last_message_time: string | null;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    is_read: number;
    timestamp: string;
    sender_name: string;
    receiver_name: string;
}

interface LocalMessage extends Message {
    _isLocal?: boolean;
    _isSending?: boolean;
}

// Yuborilgan vaqtni mahalliy vaqtda ko'rsatish (HH:mm)
const formatTime = (timestamp: string): string => {
    try {
        const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(timestamp) ? timestamp : timestamp.replace(/\.\d+$/, '') + 'Z';
        const date = new Date(iso);
        if (isNaN(date.getTime())) return '00:00';
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
        return '00:00';
    }
};

// Sana bo'laydigan divider uchun (masalan "12 February")
const formatDateDivider = (timestamp: string): string => {
    try {
        const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(timestamp) ? timestamp : timestamp.replace(/\.\d+$/, '') + 'Z';
        const date = new Date(iso);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    } catch {
        return '';
    }
};

// Emoji ro'yxati (sticker/emoji yuborish uchun)
const EMOJI_LIST = ['😀', '😊', '👍', '❤️', '😂', '😍', '🎉', '🔥', '👋', '🙏', '😎', '🤔', '😢', '😡', '👏', '💪', '✅', '❌', '📎', '🎤'];

const TeacherPanel: React.FC = () => {
    const navigate = useNavigate();
    const currentUserId = parseInt(localStorage.getItem("user_id") || "0");

    // State
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [editText, setEditText] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [editConfirmId, setEditConfirmId] = useState<number | null>(null);
    const [messageActionModal, setMessageActionModal] = useState<LocalMessage | null>(null);
    const [serverOffline, setServerOffline] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastMessageIdRef = useRef<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingStartRef = useRef<number>(0);

    // Fetch students list
    const fetchStudents = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/teacher/students');
            setStudents(response.data);
            setServerOffline(false);
        } catch {
            setServerOffline(true);
        }
    }, []);

    // Select student
    const handleSelectStudent = useCallback((student: Student) => {
        setSelectedStudent(student);
        setMessages([]);
        lastMessageIdRef.current = 0;
    }, []);

    // Edit message
    const handleEditMessage = async () => {
        if (!editText.trim() || editConfirmId === null) return;

        try {
            await axiosInstance.put(`/teacher/messages/${editConfirmId}`, {
                message: editText
            });

            setMessages(msgs => msgs.map(m =>
                m.id === editConfirmId ? { ...m, message: editText } : m
            ));
            setEditText('');
            setEditConfirmId(null);
        } catch (error) {
            console.error('Error editing message:', error);
            alert('Xabarni tahrirlash xatolik: ' + (error instanceof Error ? error.message : 'Noma\'lum xato'));
        }
    };

    // Delete message
    const handleDeleteMessage = async () => {
        if (deleteConfirmId === null) return;

        try {
            await axiosInstance.delete(`/teacher/messages/${deleteConfirmId}`);
            setMessages(msgs => msgs.filter(m => m.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Xabarni o\'chirish xatolik: ' + (error instanceof Error ? error.message : 'Noma\'lum xato'));
        }
    };

    // Yuborish (matn — oddiy yoki fayl/ovoz xabari)
    const sendMessageWithText = async (text: string) => {
        if (!text.trim() || !selectedStudent) return;

        const tempId = -Date.now();
        const tempMessage: LocalMessage = {
            id: tempId,
            sender_id: currentUserId,
            receiver_id: selectedStudent.id,
            message: text,
            is_read: 0,
            timestamp: new Date().toISOString(),
            sender_name: 'You',
            receiver_name: selectedStudent.username,
            _isSending: true
        };

        setMessages(prev => [...prev, tempMessage]);
        const messageToSend = text;
        setNewMessage('');

        try {
            const response = await axiosInstance.post('/teacher/send-message', {
                student_id: selectedStudent.id,
                message: messageToSend
            });

            // Response contains full message object with all fields
            const sentMessage = response.data as Message;
            setMessages(prev => prev.map(m =>
                m.id === tempId ? { ...sentMessage, _isSending: false } : m
            ));

            if (sentMessage.id) {
                lastMessageIdRef.current = Math.max(lastMessageIdRef.current, sentMessage.id);
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setServerOffline(true);
            alert('Serverga ulanish yo\'q. Iltimos backend (port 8000) ishga tushiring.');
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedStudent) return;
        await sendMessageWithText(newMessage);
    };

    // Fayl tanlanganda: serverga yuklash va URL yuborish
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedStudent) return;
        e.target.value = '';

        // 50 MB limit
        if (file.size > 50 * 1024 * 1024) {
            alert('Fayl hajmi 50 MB dan oshmasligi kerak!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await axiosInstance.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const { file_url, file_name, file_size, content_type } = uploadRes.data;
            await sendMessageWithText(`[file:${file_url}|${file_name}|${file_size}|${content_type}]`);
        } catch (err: any) {
            console.error('File upload error:', err);
            const detail = err?.response?.data?.detail || 'Fayl yuklashda xatolik!';
            alert(detail);
        }
    };

    // Ovozli xabar: yozib olish, serverga yuklash, audio URL yuborish
    const startVoiceRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];
            recorder.ondataavailable = (ev) => { if (ev.data.size) audioChunksRef.current.push(ev.data); };
            recorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                if (blob.size === 0) return;

                // Audio blobni serverga yuklash
                try {
                    const formData = new FormData();
                    formData.append('file', blob, 'voice.webm');
                    const uploadRes = await axiosInstance.post('/voice/upload/teacher', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    const voiceUrl = uploadRes.data.voice_url; // e.g. /uploads/voice/xxx.webm
                    await sendMessageWithText(`[voice:${voiceUrl}]`);
                } catch (uploadErr) {
                    console.error('Voice upload error:', uploadErr);
                    alert('Ovozli xabar yuklashda xatolik!');
                }
            };
            mediaRecorderRef.current = recorder;
            recordingStartRef.current = Date.now();
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Microphone error:', err);
            alert('Mikrofon ruxsati yo\'q yoki xatolik.');
        }
    };

    const stopVoiceRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
            setIsRecording(false);
        }
    };

    const toggleEmoji = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initial load
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "teacher") {
            navigate("/login", { replace: true });
            return;
        }
        fetchStudents();
    }, [navigate, fetchStudents]);

    // WebSocket Connection
    useEffect(() => {
        if (!selectedStudent) return;

        // Initial fetch
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get(`/teacher/messages/${selectedStudent.id}`);
                setMessages(response.data);
                if (response.data.length > 0) {
                    lastMessageIdRef.current = response.data[response.data.length - 1].id;
                }
                setServerOffline(false);
                await axiosInstance.put(`/teacher/mark-read/${selectedStudent.id}`);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        const wsUrl = `ws://127.0.0.1:8000/ws/${currentUserId}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            setServerOffline(false);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'pong') return;

                // Check if message belongs to selected selectedStudent
                if (
                    (data.sender_id === selectedStudent.id && data.receiver_id === currentUserId) ||
                    (data.sender_id === currentUserId && data.receiver_id === selectedStudent.id)
                ) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === data.id)) return prev;
                        const updated = [...prev, data as LocalMessage].sort((a, b) => a.id - b.id);
                        lastMessageIdRef.current = updated[updated.length - 1].id;
                        return updated;
                    });

                    if (data.sender_id === selectedStudent.id) {
                        axiosInstance.put(`/teacher/mark-read/${selectedStudent.id}`);
                    }
                }

                // Refresh student list to update unread counts/last message
                fetchStudents();

            } catch (err) {
                console.error("WS Error", err);
            }
        };

        socket.onclose = () => {
            // Optional: setServerOffline(true); 
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            setServerOffline(true);
        };

        return () => {
            socket.close();
        };
    }, [selectedStudent, currentUserId, fetchStudents]);

    return (
        <div className="teacher-panel">
            <div className="uv-background-wrapper">
                <div className="nebula-uv"></div>
                <div className="stars-uv"></div>
            </div>
            {serverOffline && (
                <div className="server-offline-banner">
                    ⚠ Serverga ulanish yo'q. Backend (http://127.0.0.1:8000) ishga tushiring.
                </div>
            )}
            {/* Header */}
            <div className="teacher-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Orqaga
                </button>
                <h1>👨‍🏫 O'qituvchi Paneli</h1>
            </div>

            <div className="teacher-container">
                {/* Left Sidebar - Students List */}
                <div className="students-sidebar">
                    <h2>O'quvchilar</h2>
                    <div className="students-list">
                        {students.length === 0 ? (
                            <p className="no-students">Hali xabarlar yo'q</p>
                        ) : (
                            students.map((student) => (
                                <div
                                    key={student.id}
                                    className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                                    onClick={() => handleSelectStudent(student)}
                                >
                                    <div className="student-avatar">{student.username.charAt(0).toUpperCase()}</div>
                                    <div className="student-info">
                                        <div className="student-name">{student.username}</div>
                                        <div className="student-last-msg">
                                            {student.last_message ? student.last_message.substring(0, 30) + (student.last_message.length > 30 ? '...' : '') : 'Hali xabar yo\'q'}
                                        </div>
                                    </div>
                                    {student.unread_count > 0 && (
                                        <div className="unread-badge">{student.unread_count}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel - Chat */}
                <div className="chat-panel">
                    {selectedStudent ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-user-info">
                                    <div className="chat-avatar">👤</div>
                                    <div>
                                        <div className="chat-username">{selectedStudent.username}</div>
                                        <div className="chat-email">{selectedStudent.email}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-container">
                                {messages.length === 0 ? (
                                    <div className="no-messages">
                                        <p>Hali xabar yo'q. Birinchi xabar yozishni boshlang!</p>
                                    </div>
                                ) : (
                                    (() => {
                                        let lastDate = '';
                                        return messages.map((msg) => {
                                            const dateLabel = formatDateDivider(msg.timestamp);
                                            const showDivider = dateLabel && dateLabel !== lastDate;
                                            if (showDivider) lastDate = dateLabel;
                                            return (
                                                <React.Fragment key={msg.id}>
                                                    {showDivider && (
                                                        <div className="date-divider">{dateLabel}</div>
                                                    )}
                                                    <div
                                                        className={`message ${msg.sender_id === currentUserId ? 'sent' : 'received'}`}
                                                        onClick={
                                                            msg.sender_id === currentUserId && !msg._isSending
                                                                ? () => setMessageActionModal(msg)
                                                                : undefined
                                                        }
                                                        role={msg.sender_id === currentUserId && !msg._isSending ? 'button' : undefined}
                                                        title={msg.sender_id === currentUserId && !msg._isSending ? "O'chirish yoki tahrirlash" : undefined}
                                                    >
                                                        <div className="message-content">
                                                            {isVoiceMessage(msg.message) ? (
                                                                <div className="voice-message-player">
                                                                    <span className="voice-icon">🎤</span>
                                                                    <audio controls preload="metadata" src={getVoiceUrl(msg.message)} />
                                                                </div>
                                                            ) : isFileMessage(msg.message) ? (() => {
                                                                const f = parseFileMessage(msg.message);
                                                                if (!f) return msg.message;
                                                                const sizeStr = f.size > 1024 * 1024
                                                                    ? (f.size / 1024 / 1024).toFixed(1) + ' MB'
                                                                    : (f.size / 1024).toFixed(1) + ' KB';
                                                                if (isVideoType(f.contentType)) {
                                                                    return (
                                                                        <div className="file-message-block">
                                                                            <video controls preload="metadata" src={f.url} className="chat-video" />
                                                                            <div className="file-info-row">
                                                                                <span className="file-icon">🎬</span>
                                                                                <a href={f.url} target="_blank" rel="noreferrer" className="file-link">{f.name}</a>
                                                                                <span className="file-size">{sizeStr}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                if (isImageType(f.contentType)) {
                                                                    return (
                                                                        <div className="file-message-block">
                                                                            <a href={f.url} target="_blank" rel="noreferrer">
                                                                                <img src={f.url} alt={f.name} className="chat-image" />
                                                                            </a>
                                                                            <div className="file-info-row">
                                                                                <span className="file-icon">🖼</span>
                                                                                <span className="file-link">{f.name}</span>
                                                                                <span className="file-size">{sizeStr}</span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return (
                                                                    <div className="file-message-block">
                                                                        <div className="file-info-row">
                                                                            <span className="file-icon">📄</span>
                                                                            <a href={f.url} target="_blank" rel="noreferrer" download className="file-link">{f.name}</a>
                                                                            <span className="file-size">{sizeStr}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })() : msg.message}
                                                        </div>
                                                        <div className="message-footer">
                                                            <div className="message-time">
                                                                {formatTime(msg.timestamp)}
                                                                {msg.sender_id === currentUserId && (
                                                                    <span className="read-status">
                                                                        {msg.is_read ? ' ✓✓' : msg._isSending ? ' ⏳' : ' ✓'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        });
                                    })()
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="message-form-wrap" style={{ position: 'relative' }}>
                                {showEmojiPicker && (
                                    <div className="emoji-picker-wrap">
                                        <div className="emoji-grid">
                                            {EMOJI_LIST.map((emoji, i) => (
                                                <button key={i} type="button" onClick={() => toggleEmoji(emoji)}>{emoji}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <form className="message-form" onSubmit={handleSendMessage}>
                                    <div className="tg-input-actions">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={handleFileSelect}
                                            accept="*/*"
                                        />
                                        <button type="button" className="tg-input-btn" onClick={() => fileInputRef.current?.click()} title="Fayl yuborish">📎</button>
                                        {!isRecording ? (
                                            <button type="button" className="tg-input-btn" onClick={startVoiceRecording} title="Ovozli xabar">🎤</button>
                                        ) : (
                                            <button type="button" className="tg-input-btn recording" onClick={stopVoiceRecording} title="To'xtatish">⏹</button>
                                        )}
                                        <button type="button" className="tg-input-btn" onClick={() => setShowEmojiPicker(p => !p)} title="Emoji / Sticker">😀</button>
                                    </div>
                                    <input
                                        type="text"
                                        className="message-input"
                                        placeholder="Xabar yozing..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="send-btn"
                                        disabled={!newMessage.trim()}
                                    >
                                        ➤
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <p>O'quvchini tanlang</p>
                        </div>
                    )}
                </div>
            </div >

            {/* Xabar ustiga bosilganda: O'chirish yoki Tahrirlash */}
            {
                messageActionModal !== null && (
                    <div className="modal-overlay" onClick={() => setMessageActionModal(null)}>
                        <div className="modal-content modal-content-action" onClick={(e) => e.stopPropagation()}>
                            <h2>Bu xabar uchun nima qilamiz?</h2>
                            <p className="modal-message-preview">"{messageActionModal.message}"</p>
                            <div className="modal-buttons modal-buttons-column">
                                <button
                                    type="button"
                                    className="modal-btn modal-btn-danger"
                                    onClick={() => {
                                        setDeleteConfirmId(messageActionModal.id);
                                        setMessageActionModal(null);
                                    }}
                                >
                                    🗑 O'chirish
                                </button>
                                <button
                                    type="button"
                                    className="modal-btn modal-btn-primary"
                                    onClick={() => {
                                        setEditConfirmId(messageActionModal.id);
                                        setEditText(messageActionModal.message);
                                        setMessageActionModal(null);
                                    }}
                                >
                                    ✎ Tahrirlash
                                </button>
                                <button
                                    type="button"
                                    className="modal-btn modal-btn-cancel"
                                    onClick={() => setMessageActionModal(null)}
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Confirmation Modal */}
            {
                editConfirmId !== null && (
                    <div className="modal-overlay" onClick={() => { setEditConfirmId(null); setEditText(''); }}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Xabarni tahrirlash</h2>
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="modal-textarea"
                                placeholder="Tahrirlangan xabar..."
                                autoFocus
                            />
                            <div className="modal-buttons">
                                <button
                                    onClick={handleEditMessage}
                                    className="modal-btn modal-btn-primary"
                                // Make sure disabled if needs be, but clean text is enough
                                >
                                    ✓ Saqlash
                                </button>
                                <button
                                    onClick={() => { setEditConfirmId(null); setEditText(''); }}
                                    className="modal-btn modal-btn-cancel"
                                >
                                    ✕ Bekor qilish
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                deleteConfirmId !== null && (
                    <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
                        <div className="modal-content modal-content-danger" onClick={(e) => e.stopPropagation()}>
                            <h2>Xabarni o'chirish</h2>
                            <p>Haqiqatan ham bu xabarni o'chirishni istaysizmi?</p>
                            <div className="modal-buttons">
                                <button
                                    onClick={handleDeleteMessage}
                                    className="modal-btn modal-btn-danger"
                                >
                                    🗑 O'chirish
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="modal-btn modal-btn-cancel"
                                >
                                    ✕ Bekor qilish
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TeacherPanel;
