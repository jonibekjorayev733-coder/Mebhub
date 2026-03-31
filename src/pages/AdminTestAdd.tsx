import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Edit2, BookOpen, HelpCircle, BarChart3, Save } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

interface Topic {
  id: number;
  name: string;
  description?: string;
}

interface LearningItem {
  id: number;
  topic_id: number;
  latin_term: string;
  uzbek_term: string;
  description?: string;
}

interface TestQuestion {
  id: number;
  topic_id: number;
  question_text: string;
  correct_answer: string;
  options: string[];
  difficulty?: string;
}

const AdminTestAdd: React.FC = () => {
  const { token, logout } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState<"topics" | "learning" | "questions">("topics");
  const [confirmModal, setConfirmModal] = useState<{ type: string; id?: number } | null>(null);

  // Topic Form
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [topicForm, setTopicForm] = useState({ name: "", description: "" });

  // Learning Form
  const [showLearningForm, setShowLearningForm] = useState(false);
  const [editingLearningId, setEditingLearningId] = useState<number | null>(null);
  const [learningForm, setLearningForm] = useState({
    topic_id: 0,
    latin_term: "",
    uzbek_term: "",
    description: "",
  });

  // Question Form
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState({
    topic_id: 0,
    question_text: "",
    correct_answer: "",
    options: ["", "", "", ""],
    difficulty: "easy",
  });

  const [items, setItems] = useState<LearningItem[]>([]);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);

  useEffect(() => {
    if (token) {
      fetchTopics();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    if (activeTab === "learning") fetchLearningItems();
    if (activeTab === "questions") fetchQuestions();
  }, [activeTab, token]);

  const fetchTopics = async () => {
    if (!token) return;
    try {
      const response = await fetch("/admin/topics", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
        console.log("✅ Topics loaded:", data);
      } else if (response.status === 401) {
        console.error("❌ Unauthorized topics request");
        logout();
      } else {
        console.error("❌ Error fetching topics, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchLearningItems = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/admin/learning-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else if (response.status === 401) {
        console.error("❌ Unauthorized learning items request");
        logout();
      }
    } catch (error) {
      console.error("Error fetching learning items:", error);
    }
  };

  const fetchQuestions = async () => {
    if (!token) return;

    try {
      const response = await fetch(`/admin/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else if (response.status === 401) {
        console.error("❌ Unauthorized questions request");
        logout();
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !topicForm.name) {
      alert("Token yoki mavzu nomi yo'q!");
      return;
    }

    try {
      const method = editingTopicId ? "PUT" : "POST";
      const url = editingTopicId 
        ? `/admin/topics/${editingTopicId}`
        : "/admin/topics";

      const payload = {
        name: topicForm.name,
        description: topicForm.description || "",
        order: 0
      };
      
      console.log(`${method} topic payload:`, payload);
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        setTopicForm({ name: "", description: "" });
        setEditingTopicId(null);
        setShowTopicForm(false);
        fetchTopics();
        alert(editingTopicId ? "✅ Mavzu muvaffaqiyatli o'zgartirildi!" : "✅ Mavzu muvaffaqiyatli qo'shildi!");
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", response.status, errorData);
        alert(`❌ Xato: ${errorData.detail || "Mavzuni saqlashda xato yuz berdi"}`);
      }
    } catch (error) {
      console.error("Error adding topic:", error);
      alert(`❌ Serverga ulanishda xato yuz berdi: ${error}`);
    }
  };

  const handleAddLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !learningForm.latin_term || !learningForm.uzbek_term) {
      alert("Token yoki majburiy maydonlar to'ldirilmadi!");
      return;
    }

    try {
      const method = editingLearningId ? "PUT" : "POST";
      const url = editingLearningId 
        ? `/admin/learning-items/${editingLearningId}`
        : "/admin/learning-items";

      const payload = {
        topic_id: learningForm.topic_id || 1,
        latin_term: learningForm.latin_term,
        uzbek_term: learningForm.uzbek_term,
        description: learningForm.description || "",
        order: 0
      };

      console.log(`${method} learning payload:`, payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        setLearningForm({
          topic_id: 0,
          latin_term: "",
          uzbek_term: "",
          description: "",
        });
        setEditingLearningId(null);
        setShowLearningForm(false);
        fetchLearningItems();
        alert(editingLearningId ? "✅ Material muvaffaqiyatli o'zgartirildi!" : "✅ O'rganish elementi muvaffaqiyatli qo'shildi!");
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", response.status, errorData);
        alert(`❌ Xato: ${errorData.detail || "O'rganish elementini saqlashda xato yuz berdi"}`);
      }
    } catch (error) {
      console.error("Error adding learning item:", error);
      alert(`❌ Serverga ulanishda xato yuz berdi: ${error}`);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !questionForm.question_text || !questionForm.correct_answer) {
      alert("Token yoki majburiy maydonlar to'ldirilmadi!");
      return;
    }

    try {
      const method = editingQuestionId ? "PUT" : "POST";
      const url = editingQuestionId 
        ? `/admin/questions/${editingQuestionId}`
        : "/admin/questions";

      const payload = {
        topic_id: questionForm.topic_id || 1,
        question_text: questionForm.question_text,
        correct_answer: questionForm.correct_answer,
        options: questionForm.options.filter(o => o.trim()),
        difficulty: questionForm.difficulty || "medium",
        order: 0
      };

      console.log(`${method} question payload:`, payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        setQuestionForm({
          topic_id: 0,
          question_text: "",
          correct_answer: "",
          options: ["", "", "", ""],
          difficulty: "easy",
        });
        setEditingQuestionId(null);
        setShowQuestionForm(false);
        fetchQuestions();
        alert(editingQuestionId ? "✅ Test muvaffaqiyatli o'zgartirildi!" : "✅ Test muvaffaqiyatli qo'shildi!");
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", response.status, errorData);
        alert(`❌ Xato: ${errorData.detail || "Testni saqlashda xato yuz berdi"}`);
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert(`❌ Serverga ulanishda xato yuz berdi: ${error}`);
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setTopicForm({ name: topic.name, description: topic.description || "" });
    setShowTopicForm(true);
  };

  const handleDeleteTopic = (id: number) => {
    setConfirmModal({ type: "topic", id });
  };

  const confirmDeleteTopic = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`/admin/topics/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTopics();
        setConfirmModal(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Xato: ${errorData.detail || "Mavzuni o'chirishda xato yuz berdi"}`);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      alert("Serverga ulanishda xato yuz berdi");
    }
  };

  const handleEditLearning = (item: LearningItem) => {
    setEditingLearningId(item.id);
    setLearningForm({
      topic_id: item.topic_id,
      latin_term: item.latin_term,
      uzbek_term: item.uzbek_term,
      description: item.description || "",
    });
    setShowLearningForm(true);
  };

  const handleDeleteLearning = (id: number) => {
    setConfirmModal({ type: "learning", id });
  };

  const confirmDeleteLearning = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`/admin/learning-items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchLearningItems();
        setConfirmModal(null);
      } else {
        alert("Materialni o'chirishda xato bo'ldi");
      }
    } catch (error) {
      console.error("Error deleting learning item:", error);
      alert("Serverga ulanishda xato yuz berdi");
    }
  };

  const handleEditQuestion = (question: TestQuestion) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      topic_id: question.topic_id,
      question_text: question.question_text,
      correct_answer: question.correct_answer,
      options: question.options,
      difficulty: question.difficulty || "easy",
    });
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (id: number) => {
    setConfirmModal({ type: "question", id });
  };

  const confirmDeleteQuestion = async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`/admin/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchQuestions();
        setConfirmModal(null);
      } else {
        alert("Testni o'chirishda xato bo'ldi");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Serverga ulanishda xato yuz berdi");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-brand-500" />
          <h1 className="text-4xl font-bold text-white">Test O'qitish</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("topics")}
          className={`px-6 py-4 font-semibold transition-colors ${
            activeTab === "topics"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <BookOpen className="w-5 h-5 inline-block mr-2" />
          Mavzular
        </button>
        <button
          onClick={() => setActiveTab("learning")}
          className={`px-6 py-4 font-semibold transition-colors ${
            activeTab === "learning"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <BookOpen className="w-5 h-5 inline-block mr-2" />
          O'rganish
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-4 font-semibold transition-colors ${
            activeTab === "questions"
              ? "text-brand-500 border-b-2 border-brand-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <HelpCircle className="w-5 h-5 inline-block mr-2" />
          Testlar
        </button>
      </div>

      {/* Topics Tab */}
      {activeTab === "topics" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Mavzular</h2>
            <button
              onClick={() => {
                setEditingTopicId(null);
                setTopicForm({ name: "", description: "" });
                setShowTopicForm(!showTopicForm);
              }}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Mavzu
            </button>
          </div>

          {showTopicForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingTopicId ? "Mavzuni O'zgartirish" : "Yangi Mavzu Qo'shish"}
                </h3>
                <form onSubmit={handleAddTopic} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Mavzu Nomi</label>
                    <input
                      type="text"
                      value={topicForm.name}
                      onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                      placeholder="Mavzu nomini kiriting..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Tavsif</label>
                    <textarea
                      value={topicForm.description}
                      onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                      placeholder="Mavzu tavsifini kiriting..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Saqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTopicForm(false);
                        setEditingTopicId(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Topics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div key={topic.id} className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{topic.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{topic.description || "Tavsifi yo'q"}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTopic(topic)}
                    className="flex-1 p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    O'zgartirish
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="flex-1 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Tab */}
      {activeTab === "learning" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">O'rganish Materiallari</h2>
            <button
              onClick={() => {
                setEditingLearningId(null);
                setLearningForm({
                  topic_id: 0,
                  latin_term: "",
                  uzbek_term: "",
                  description: "",
                });
                setShowLearningForm(!showLearningForm);
              }}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Material
            </button>
          </div>

          {showLearningForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingLearningId ? "Materialni O'zgartirish" : "Yangi Material Qo'shish"}
                </h3>
                <form onSubmit={handleAddLearning} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Mavzu</label>
                    <select
                      value={learningForm.topic_id}
                      onChange={(e) => setLearningForm({ ...learningForm, topic_id: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    >
                      <option value={0}>Mavzuni tanlang...</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Lotin Ismi</label>
                    <input
                      type="text"
                      value={learningForm.latin_term}
                      onChange={(e) => setLearningForm({ ...learningForm, latin_term: e.target.value })}
                      placeholder="Lotin ismi..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">O'zbek Ismi</label>
                    <input
                      type="text"
                      value={learningForm.uzbek_term}
                      onChange={(e) => setLearningForm({ ...learningForm, uzbek_term: e.target.value })}
                      placeholder="O'zbek ismi..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Tavsif</label>
                    <textarea
                      value={learningForm.description}
                      onChange={(e) => setLearningForm({ ...learningForm, description: e.target.value })}
                      placeholder="Tavsif..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Saqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLearningForm(false);
                        setEditingLearningId(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Learning Items List */}
          <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Lotin</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">O'zbek</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Mavzu</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                    <td className="py-4 px-4 text-white">{item.latin_term}</td>
                    <td className="py-4 px-4 text-gray-300">{item.uzbek_term}</td>
                    <td className="py-4 px-4 text-gray-300">
                      {topics.find(t => t.id === item.topic_id)?.name}
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditLearning(item)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLearning(item.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === "questions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Testlar</h2>
            <button
              onClick={() => {
                setEditingQuestionId(null);
                setQuestionForm({
                  topic_id: 0,
                  question_text: "",
                  correct_answer: "",
                  options: ["", "", "", ""],
                  difficulty: "easy",
                });
                setShowQuestionForm(!showQuestionForm);
              }}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Test
            </button>
          </div>

          {showQuestionForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingQuestionId ? "Testni O'zgartirish" : "Yangi Test Qo'shish"}
                </h3>
                <form onSubmit={handleAddQuestion} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Mavzu</label>
                    <select
                      value={questionForm.topic_id}
                      onChange={(e) => setQuestionForm({ ...questionForm, topic_id: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    >
                      <option value={0}>Mavzuni tanlang...</option>
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Savol Matni</label>
                    <textarea
                      value={questionForm.question_text}
                      onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                      placeholder="Savol yozing..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">To'g'ri Javob</label>
                    <input
                      type="text"
                      value={questionForm.correct_answer}
                      onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                      placeholder="To'g'ri javob..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Javob Variantlari</label>
                    {questionForm.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                        placeholder={`Variant ${index + 1}...`}
                        className="w-full px-4 py-2 mb-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                      />
                    ))}
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2">Qiyinchilik Darajasi</label>
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
                    >
                      <option value="easy">Oson</option>
                      <option value="medium">O'rta</option>
                      <option value="hard">Qiyin</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Saqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setEditingQuestionId(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-all"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8">
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="p-6 rounded-2xl bg-gray-800/20 border border-gray-800/30 hover:border-brand-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-white font-semibold mb-2">{q.question_text}</p>
                      <p className="text-sm text-gray-400 mb-2">To'g'ri javob: <span className="text-green-400">{q.correct_answer}</span></p>
                      <span className="inline-block text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                        {q.difficulty || "easy"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmModal}
        title={
          confirmModal?.type === "topic"
            ? "Mavzuni o'chirish"
            : confirmModal?.type === "learning"
            ? "Materialni o'chirish"
            : "Testni o'chirish"
        }
        message={
          confirmModal?.type === "topic"
            ? "Siz bu mavzuni o'chirmoqchisiz? Bu amalni qaytara olmaysiz!"
            : confirmModal?.type === "learning"
            ? "Siz bu materialni o'chirmoqchisiz? Bu amalni qaytara olmaysiz!"
            : "Siz bu testni o'chirmoqchisiz? Bu amalni qaytara olmaysiz!"
        }
        confirmText="O'chirish"
        confirmVariant="danger"
        onCancel={() => setConfirmModal(null)}
        onConfirm={() => {
          if (confirmModal?.type === "topic" && confirmModal.id) confirmDeleteTopic(confirmModal.id);
          if (confirmModal?.type === "learning" && confirmModal.id) confirmDeleteLearning(confirmModal.id);
          if (confirmModal?.type === "question" && confirmModal.id) confirmDeleteQuestion(confirmModal.id);
        }}
      />
    </div>
  );
};

export default AdminTestAdd;
