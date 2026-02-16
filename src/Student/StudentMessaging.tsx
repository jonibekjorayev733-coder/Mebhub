
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import "./StudentMessaging_clean.css";
import { IoAttachOutline, IoMicOutline, IoVideocamOutline, IoHappyOutline, IoSend, IoStop } from "react-icons/io5";

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

interface Teacher {
  id: number;
  username: string;
  email: string;
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

const formatMessageTime = (timestamp: string): string => {
  try {
    const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(timestamp) ? timestamp : timestamp.replace(/\.\d+$/, "") + "Z";
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "00:00";
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "00:00";
  }
};

const formatDateDivider = (timestamp: string): string => {
  try {
    const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(timestamp) ? timestamp : timestamp.replace(/\.\d+$/, "") + "Z";
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  } catch {
    return "";
  }
};

const EMOJI_LIST = ["😀", "😊", "👍", "❤️", "😂", "😍", "🎉", "🔥", "👋", "🙏", "😎", "🤔", "😢", "😡", "👏", "💪", "✅", "❌", "📎", "🎤"];

// Simple toast notification
const showToast = (message: string) => {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #667eea;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

export default function StudentMessaging() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editText, setEditText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [messageActionModal, setMessageActionModal] = useState<LocalMessage | null>(null);

  const [editConfirmId, setEditConfirmId] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isPolling, setIsPolling] = useState(false); // Used for online status
  const currentUserId = parseInt(localStorage.getItem("user_id") || "0");
  const lastMessageIdRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartRef = useRef<number>(0);

  // Video Recording Refs
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "student") {
      navigate("/login");
      return;
    }

    loadTeacher();
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time message polling
  // WebSocket Connection
  useEffect(() => {
    if (!teacher) return;

    // Initial load
    loadMessages(teacher.id);

    // Setup WebSocket
    const wsUrl = `ws://127.0.0.1:8000/ws/${currentUserId}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsPolling(true); // Used as "Online" indicator
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') return;

        // Agar xabar biz hozir gaplashayotgan o'qituvchidan bo'lsa
        if (data.sender_id === teacher.id || data.receiver_id === teacher.id) {
          setMessages(prev => {
            if (prev.some(m => m.id === data.id)) return prev;
            const updated = [...prev, data].sort((a, b) => a.id - b.id);
            lastMessageIdRef.current = updated[updated.length - 1].id;
            return updated;
          });
          // Mark as read immediately
          if (data.sender_id === teacher.id) {
            axiosInstance.put(`/students/mark-read/${teacher.id}`);
          }
        }
      } catch (err) {
        console.error("WS Message Error", err);
      }
    };

    socket.onclose = () => {
      setIsPolling(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsPolling(false);
    };

    return () => {
      socket.close();
    };
  }, [teacher, currentUserId]);

  const loadTeacher = async () => {
    try {
      // Get first teacher (or you can let user select)
      const response = await axiosInstance.get("/students/teacher");
      setTeacher(response.data);
      loadMessages(response.data.id);
    } catch (error) {
      console.error("Error loading teacher:", error);
      // If no teacher found, show message
      alert("O'qituvchi topilmadi");
    }
  };

  const loadMessages = async (teacherId: number) => {
    try {
      const response = await axiosInstance.get(`/students/messages/${teacherId}`);
      setMessages(response.data);

      // Mark messages as read
      await axiosInstance.put(`/students/mark-read/${teacherId}`);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || !teacher) return;

    const tempId = -Date.now();
    const tempMessage: LocalMessage = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: teacher.id,
      message: text,
      is_read: 0,
      timestamp: new Date().toISOString(),
      sender_name: localStorage.getItem("username") || "Student",
      receiver_name: teacher.username,
      _isLocal: true,
      _isSending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await axiosInstance.post("/students/send-message", {
        teacher_id: teacher.id,
        message: text,
      });
      const sentMessage = response.data as Message;
      setMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...sentMessage, _isLocal: false, _isSending: false } : m))
      );
      showToast("✅ Habar o'qituvchiga ketdi!");
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      showToast("❌ Habar yuborishda xatolik!");
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !teacher) return;
    await sendMessageWithText(newMessage);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !teacher) return;
    e.target.value = "";

    // 50 MB limit
    if (file.size > 50 * 1024 * 1024) {
      alert('Fayl hajmi 50 MB dan oshmasligi kerak!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axiosInstance.post('/file/upload', formData, {
        headers: { 'Content-Type': undefined },
      });
      const { file_url, file_name, file_size, content_type } = uploadRes.data;
      await sendMessageWithText(`[file:${file_url}|${file_name}|${file_size}|${content_type}]`);
    } catch (err: any) {
      console.error('File upload error:', err);
      const detail = err?.response?.data?.detail || 'Fayl yuklashda xatolik!';
      showToast(`❌ ${detail}`);
    }
  };

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
          const uploadRes = await axiosInstance.post('/voice/upload/student', formData);
          const voiceUrl = uploadRes.data.voice_url; // e.g. /uploads/voice/xxx.webm
          await sendMessageWithText(`[voice:${voiceUrl}]`);
        } catch (uploadErr) {
          console.error('Voice upload error:', uploadErr);
          showToast('❌ Ovozli xabar yuklashda xatolik!');
        }
      };
      mediaRecorderRef.current = recorder;
      recordingStartRef.current = Date.now();
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Mikrofon ruxsati yo'q yoki xatolik.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      videoStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      videoChunksRef.current = [];
      recorder.ondataavailable = (ev) => { if (ev.data.size) videoChunksRef.current.push(ev.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        if (blob.size === 0) return;

        // Video blobni serverga yuklash
        try {
          const formData = new FormData();
          formData.append('file', blob, 'video_message.webm');
          const uploadRes = await axiosInstance.post('/file/upload', formData, {
            headers: { 'Content-Type': undefined },
          });
          const { file_url, file_name, file_size, content_type } = uploadRes.data;
          await sendMessageWithText(`[file:${file_url}|${file_name}|${file_size}|${content_type}]`);
        } catch (err: any) {
          console.error('Video upload error:', err);
          showToast('❌ Video xabar yuklashda xatolik!');
        }
      };
      videoRecorderRef.current = recorder;
      recorder.start();
      setIsVideoRecording(true);
    } catch (err) {
      console.error('Camera error:', err);
      showToast('❌ Kamera ruxsati yo\'q yoki xatolik.');
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && isVideoRecording) {
      videoRecorderRef.current.stop();
      videoRecorderRef.current = null;
      setIsVideoRecording(false);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
    }
  };

  const toggleEmoji = (emoji: string) => setNewMessage(prev => prev + emoji);

  const handleEditMessage = async () => {
    if (!editText.trim() || editConfirmId === null) return;

    try {
      await axiosInstance.put(`/students/messages/${editConfirmId}`, {
        teacher_id: teacher?.id,
        message: editText
      });

      setMessages(msgs => msgs.map(m =>
        m.id === editConfirmId ? { ...m, message: editText } : m
      ));
      setEditText('');
      setEditConfirmId(null);
      showToast("✅ Habar tahrirlandi!");
    } catch (error) {
      console.error('Error editing message:', error);
      showToast('❌ Tahrirda xatolik!');
    }
  };

  const handleDeleteMessage = async () => {
    if (deleteConfirmId === null) return;

    try {
      await axiosInstance.delete(`/students/messages/${deleteConfirmId}`);
      setMessages(msgs => msgs.filter(m => m.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      showToast("✅ Habar o'chirildi!");
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('❌ O\'chirishda xatolik!');
    }
  };

  if (loading) {
    return <div className="student-messaging">Yuklanmoqda...</div>;
  }

  if (!teacher) {
    return (
      <div className="student-messaging">
        <div className="error-message">
          <h2>O'qituvchi topilmadi</h2>
          <button onClick={() => navigate("/courses")}>Orqaga</button>
        </div>
      </div>
    );
  }
  return (
    <div className="student-messaging">
      <div className="uv-background-wrapper">
        <div className="nebula-uv"></div>
        <div className="stars-uv"></div>
      </div>
      {/* Header */}
      <div className="messaging-header">
        <button className="back-btn" onClick={() => navigate("/courses")}>
          Orqaga
        </button>
        <div className="teacher-info">
          <div className="teacher-avatar">{teacher.username.charAt(0).toUpperCase()}</div>
          <div className="teacher-details">
            <h2>
              {teacher.username}
              <span style={{
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                backgroundColor: isPolling ? '#4caf50' : '#f44336',
                display: 'inline-block',
                marginLeft: '8px'
              }} title={isPolling ? "Online" : "Offline"} />
            </h2>
            <p>{teacher.email}</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Hali xabar yo'q. Birinchi xabar yozishni boshlang!</p>
          </div>
        ) : (
          (() => {
            let lastDate = "";
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
                    className={`message ${msg.sender_id === currentUserId ? "sent" : "received"}`}
                    onClick={
                      msg.sender_id === currentUserId && !msg._isSending
                        ? () => setMessageActionModal(msg)
                        : undefined
                    }
                    role={msg.sender_id === currentUserId && !msg._isSending ? 'button' : undefined}
                    title={msg.sender_id === currentUserId && !msg._isSending ? "O'chirish yoki tahrirlash" : undefined}
                    style={{ cursor: msg.sender_id === currentUserId && !msg._isSending ? 'pointer' : 'default' }}
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
                        {formatMessageTime(msg.timestamp)}
                        {msg.sender_id === currentUserId && (
                          <span className="read-status">
                            {msg.is_read ? " ✓✓" : msg._isSending ? " ⏳" : " ✓"}
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

      {/* Message Form */}
      <div className="message-form-container">
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            {EMOJI_LIST.map((emoji, i) => (
              <button key={i} type="button" className="emoji-item" onClick={() => toggleEmoji(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        )}
        <form className="message-form" onSubmit={sendMessage}>
          <div className="tg-input-actions">
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileSelect}
              accept="*/*"
            />
            <button
              type="button"
              className="tg-input-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Fayl yuborish"
            >
              <IoAttachOutline />
            </button>
            <button
              type="button"
              className="tg-input-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Emoji"
            >
              <IoHappyOutline />
            </button>

            {!isVideoRecording ? (
              <button type="button" className="tg-input-btn" onClick={startVideoRecording} title="Video xabar">
                <IoVideocamOutline />
              </button>
            ) : (
              <button type="button" className="tg-input-btn recording" onClick={stopVideoRecording} title="To'xtatish">
                <IoStop />
              </button>
            )}

            {!isRecording ? (
              <button
                type="button"
                className="tg-input-btn"
                onClick={startVoiceRecording}
                title="Ovozli xabar"
              >
                <IoMicOutline />
              </button>
            ) : (
              <button
                type="button"
                className="tg-input-btn recording"
                onClick={stopVoiceRecording}
                title="To'xtatish"
              >
                <IoStop />
              </button>
            )}
          </div>

          <input
            type="text"
            className="tg-input"
            placeholder="Xabar yozing..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isRecording || isVideoRecording}
          />
          <button
            type="submit"
            className="tg-send-btn"
            disabled={!newMessage.trim() || isRecording || isVideoRecording}
          >
            <IoSend />
          </button>
        </form>

        {isVideoRecording && (
          <div className="video-recording-preview">
            <video ref={videoPreviewRef} autoPlay muted playsInline className="preview-video" />
            <div className="recording-indicator">
              <span className="dot"></span> Rec
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {messageActionModal !== null && (
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
      )}

      {/* Edit Confirmation Modal */}
      {editConfirmId !== null && (
        <div className="modal-overlay" onClick={() => { setEditConfirmId(null); setEditText(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Xabarni tahrirlash</h2>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="modal-textarea"
              placeholder="Tahrirlangan xabar..."
            />
            <div className="modal-buttons">
              <button
                onClick={handleEditMessage}
                className="modal-btn modal-btn-primary"
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
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
      )}
    </div>
  );
}
