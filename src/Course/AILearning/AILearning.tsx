import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/taskApi";
import ReactMarkdown from 'react-markdown';
import { BsGrid } from "react-icons/bs";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import "./AILearning.css";

interface VideoLesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  order: number;
}

interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface Course {
  id: number;
  title: string;
  lessons: VideoLesson[];
}

export default function AILearning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<VideoLesson | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Resizing (ikkita sidebar uchun)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320);
  const [rightChatWidth, setRightChatWidth] = useState(380);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Fetch course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/courses/${courseId}`);
        const data = response.data;
        setCourse(data);
        if (data.lessons?.length > 0) setSelectedLesson(data.lessons[0]);
      } catch (error) {
        console.error("Course yuklashda xato:", error);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  // Chat history + greeting
  useEffect(() => {
    const fetchHistory = async () => {
      if (!courseId) return;
      try {
        const response = await axiosInstance.get(`/ai/history/${courseId}`);
        const history = response.data.map((item: any) => ({
          id: item.id,
          sender: item.sender,
          text: item.message,
          timestamp: new Date(item.timestamp),
        }));
        setMessages(history);

        if (history.length === 0 && course?.lessons?.[0]) {
          setMessages([{
            id: 0,
            sender: "ai",
            text: `Salom! **${course.title}** kursi bo'yicha yordam beraman.\nSavollaringiz bo'lsa, yozing! 🚀`,
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        console.error("Chat history xatosi:", error);
      }
    };
    if (courseId && course) fetchHistory();
  }, [courseId, course]);

  // Auto focus chat input
  useEffect(() => {
    const timer = setTimeout(() => chatInputRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, [selectedLesson]);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Resize logic
  const startResizeLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
  }, []);

  const startResizeRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
  }, []);

  const stopResize = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  const resizeHandler = useCallback((e: MouseEvent) => {
    if (isResizingLeft) {
      const newW = Math.max(260, Math.min(500, e.clientX));
      setLeftSidebarWidth(newW);
    }
    if (isResizingRight) {
      const newW = Math.max(300, Math.min(600, window.innerWidth - e.clientX));
      setRightChatWidth(newW);
    }
  }, [isResizingLeft, isResizingRight]);

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      window.addEventListener("mousemove", resizeHandler);
      window.addEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", resizeHandler);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizingLeft, isResizingRight, resizeHandler, stopResize]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedLesson || !courseId) return;

    const tempId = Date.now();
    const userMsg = { id: tempId, sender: "user" as const, text: inputValue.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    const aiId = tempId + 1;
    setMessages(prev => [...prev, { id: aiId, sender: "ai", text: "...", timestamp: new Date() }]);

    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          course_id: parseInt(courseId),
          message: userMsg.text,
          context: `${selectedLesson.title}: ${selectedLesson.description || ""}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Server xatosi");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });

        setMessages(prev =>
          prev.map(m => m.id === aiId ? { ...m, text: aiText } : m)
        );
      }
    } catch (err) {
      console.error("Chat xatosi:", err);
      setMessages(prev =>
        prev.map(m =>
          m.id === aiId ? { ...m, text: m.text + "\n[Xato yuz berdi]" } : m
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/i);
      return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    } catch {
      return null;
    }
  };

  if (!course || !selectedLesson) {
    return <div className="loading">Yuklanmoqda...</div>;
  }

  return (
    <div className={`ai-learning ${isResizingLeft || isResizingRight ? "resizing" : ""}`}>
      <div className="uv-background-wrapper">
        <div className="nebula-uv"></div>
        <div className="stars-uv"></div>
      </div>

      <div className="main-layout">
        {/* Chap sidebar — Mavzular */}
        <div className="left-sidebar" style={{ width: `${leftSidebarWidth}px` }}>
          <div className="sidebar-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Orqaga
            </button>
          </div>
          <div className="topics-list">
            <div className="list-title">
              <BsGrid /> Mavzular / Darslar
            </div>
            {course.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className={`topic-item ${selectedLesson.id === lesson.id ? "active" : ""}`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <span className="topic-num">{idx + 1}</span>
                <span className="topic-name">{lesson.title}</span>
                {selectedLesson.id === lesson.id && <FiChevronRight />}
              </div>
            ))}
          </div>
        </div>

        <div className="resizer left-resizer" onMouseDown={startResizeLeft} />

        {/* Markaz — Video + Info */}
        <div className="main-content">
          <div className="video-section">
            {getYoutubeEmbedUrl(selectedLesson.video_url) ? (
              <iframe
                src={`${getYoutubeEmbedUrl(selectedLesson.video_url)}?rel=0&modestbranding=1`}
                title={selectedLesson.title}
                allowFullScreen
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="no-video">Video mavjud emas</div>
            )}
          </div>
          <div className="lesson-info">
            <h1>{selectedLesson.title}</h1>
            <p>{selectedLesson.description}</p>
          </div>
        </div>

        <div className="resizer right-resizer" onMouseDown={startResizeRight} />

        {/* O'ng sidebar — AI Chat */}
        <div className="right-chat" style={{ width: `${rightChatWidth}px` }}>
          <div className="chat-header">
            <div className="ai-status">
              <div className="status-dot" />
              AI Yo'riqchi
            </div>
          </div>

          <div className="messages-container">
            {messages.map(msg => (
              <div key={msg.id} className={`msg ${msg.sender}`}>
                <div className="bubble">
                  {msg.sender === "ai" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                ref={chatInputRef}
                type="text"
                placeholder="Savolingizni yozing..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === "Enter" && !isLoading && handleSendMessage()}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="send-icon"
              >
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}