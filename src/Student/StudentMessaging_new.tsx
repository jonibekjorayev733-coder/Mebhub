import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import "./StudentMessaging.css";

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
  const currentUserId = parseInt(localStorage.getItem("user_id") || "0");
  
  // State
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editText, setEditText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editConfirmId, setEditConfirmId] = useState<number | null>(null);
  
  // Refs
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIdRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load teacher info
  const loadTeacher = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/students/teacher-info");
      setTeacher(response.data);
    } catch (error) {
      console.error("Error loading teacher:", error);
    }
  }, []);

  // Edit message
  const handleEditMessage = async () => {
    if (!editText.trim() || editConfirmId === null) return;
    
    try {
      await axiosInstance.put(`/students/messages/${editConfirmId}`, {
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

  // Delete message
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

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !teacher) return;

    const tempId = -Date.now();
    const tempMessage: LocalMessage = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: teacher.id,
      message: newMessage,
      is_read: 0,
      timestamp: new Date().toISOString(),
      sender_name: "You",
      receiver_name: teacher.username,
      _isSending: true
    };

    setMessages(prev => [...prev, tempMessage]);
    const messageToSend = newMessage;
    setNewMessage("");

    try {
      const response = await axiosInstance.post("/students/send-message", {
        teacher_id: teacher.id,
        message: messageToSend
      });

      setMessages(prev =>
        prev.map(m =>
          m.id === tempId ? { ...response.data, _isSending: false } : m
        )
      );
      
      if (response.data && response.data.id) {
        lastMessageIdRef.current = Math.max(lastMessageIdRef.current, response.data.id);
      }
      showToast("✅ Habar yuborildi!");
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      console.error("Error sending message:", error);
      showToast("❌ Habar yuborishda xatolik!");
    }
  };

  // Initial setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "student") {
      navigate("/login");
      return;
    }

    loadTeacher();
    setLoading(false);
  }, [navigate, loadTeacher]);

  // Real-time polling
  useEffect(() => {
    if (!teacher) return;

    const pollMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/students/messages/${teacher.id}?after=${lastMessageIdRef.current}`
        );
        
        if (response.data && response.data.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMsgs = response.data.filter((m: Message) => !existingIds.has(m.id));
            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
          });
          
          lastMessageIdRef.current = response.data[response.data.length - 1].id;
          await axiosInstance.put(`/students/mark-read/${teacher.id}`);
        }
      } catch (error) {
        // Silently handle polling errors
      }
    };

    pollIntervalRef.current = setInterval(pollMessages, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [teacher]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div className="student-messaging">Yuklanmoqda...</div>;
  }

  return (
    <div className="student-messaging">
      {/* Header */}
      <div className="messaging-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Orqaga
        </button>
        {teacher && (
          <div className="teacher-info">
            <div className="teacher-avatar">👤</div>
            <h2>{teacher.username}</h2>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Hali xabar yo'q. Birinchi xabar yozishni boshlang!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender_id === currentUserId ? "sent" : "received"
              }`}
            >
              <div className="message-content">{msg.message}</div>
              <div className="message-footer">
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString("uz-UZ", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {msg.sender_id === currentUserId && (
                    <span className="read-status">
                      {msg.is_read ? ' ✓✓' : msg._isSending ? ' ⏳' : ' ✓'}
                    </span>
                  )}
                </div>
                {msg.sender_id === currentUserId && !msg._isSending && (
                  <div className="message-actions">
                    <button
                      onClick={() => {
                        setEditConfirmId(msg.id);
                        setEditText(msg.message);
                      }}
                      className="message-edit-btn"
                      title="Tahrirlash"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(msg.id)}
                      className="message-delete-btn"
                      title="O'chirish"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Form */}
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Xabar yozing..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          ➤
        </button>
      </form>

      {/* Edit Modal */}
      {editConfirmId !== null && (
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

      {/* Delete Modal */}
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
