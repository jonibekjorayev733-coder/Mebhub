import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2, Edit2, BookOpen, HelpCircle, BarChart3, Save } from "lucide-react";

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
  const { token } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTab, setActiveTab] = useState<"topics" | "learning" | "questions">("topics");

  // Topic Form
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicForm, setTopicForm] = useState({ name: "", description: "" });

  // Learning Form
  const [showLearningForm, setShowLearningForm] = useState(false);
  const [learningForm, setLearningForm] = useState({
    topic_id: 0,
    latin_term: "",
    uzbek_term: "",
    description: "",
  });

  // Question Form
  const [showQuestionForm, setShowQuestionForm] = useState(false);
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
    if (activeTab === "learning") fetchLearningItems();
    if (activeTab === "questions") fetchQuestions();
  }, [activeTab]);

  const fetchTopics = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/topics", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTopics(data);
        console.log("✅ Topics loaded:", data);
      } else {
        console.error("❌ Error fetching topics, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchLearningItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/learning-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching learning items:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/questions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
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
      const payload = {
        name: topicForm.name,
        description: topicForm.description || "",
        order: 0
      };
      
      console.log("Sending topic payload:", payload);
      
      const response = await fetch("http://127.0.0.1:8000/admin/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        setTopicForm({ name: "", description: "" });
        setShowTopicForm(false);
        fetchTopics();
        alert("✅ Mavzu muvaffaqiyatli qo'shildi!");
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", response.status, errorData);
        alert(`❌ Xato: ${errorData.detail || "Mavzu qo'shishda xato yuz berdi"}`);
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
      const payload = {
        topic_id: learningForm.topic_id || 1,
        latin_term: learningForm.latin_term,
        uzbek_term: learningForm.uzbek_term,
        description: learningForm.description || "",
        order: 0
      };

      console.log("Sending learning payload:", payload);

      const response = await fetch("http://127.0.0.1:8000/admin/learning-items", {
        method: "POST",
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
        setShowLearningForm(false);
        fetchLearningItems();
        alert("✅ O'rganish elementi muvaffaqiyatli qo'shildi!");
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", response.status, errorData);
        alert(`❌ Xato: ${errorData.detail || "O'rganish elementini qo'shishda xato yuz berdi"}`);
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
      const payload = {
        topic_id: questionForm.topic_id || 1,
        question_text: questionForm.question_text,
        correct_answer: questionForm.correct_answer,
        options: questionForm.options.filter(o => o.trim()),
        difficulty: questionForm.difficulty || "medium",
        order: 0
      };

      console.log("Sending question payload:", payload);

      const response = await fetch("http://127.0.0.1:8000/admin/questions", {
        method: "POST",
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
        setShowQuestionForm(false);
        fetchQuestions();
        alert("✅ Savol muvaffaqiyatli qo'shildi!");
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Error response:", response.status, errorData);
        alert(`❌ Xato: ${errorData.detail || "Savol qo'shishda xato yuz berdi"}`);
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert(`❌ Serverga ulanishda xato yuz berdi: ${error}`);
    }
  };

  const handleDeleteTopic = async (id: number) => {
    if (!token || !window.confirm("Mavzuni o'chirishni tasdiqlang?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/topics/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTopics();
        alert("Mavzu muvaffaqiyatli o'chirildi!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Xato: ${errorData.detail || "Mavzuni o'chirishda xato yuz berdi"}`);
        console.error("Error response:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error deleting topic:", error);
      alert("Serverga ulanishda xato yuz berdi");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          📚 Test Qo'shish
        </h1>
        <p className="text-gray-400">
          Mavzu, o'rganish materiallari va test savollarini boshqarish
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("topics")}
          className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "topics"
              ? "border-brand-500 text-brand-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          Mavzular
        </button>
        <button
          onClick={() => setActiveTab("learning")}
          className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "learning"
              ? "border-brand-500 text-brand-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          O'rganish
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "questions"
              ? "border-brand-500 text-brand-400"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          Savollar
        </button>
      </div>

      {/* Topics Tab */}
      {activeTab === "topics" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Mavzular</h2>
            <button
              onClick={() => setShowTopicForm(!showTopicForm)}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Mavzu
            </button>
          </div>

          {showTopicForm && (
            <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8">
              <form onSubmit={handleAddTopic} className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Mavzu Nomi</label>
                  <input
                    type="text"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="Masalan: Anatomiya"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Tavsifi</label>
                  <textarea
                    value={topicForm.description}
                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="Mavzunin tavsifi..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTopicForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Bekor Qilish
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Topics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <div key={topic.id} className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{topic.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{topic.description || "Tavsifi yo'q"}</p>
                <div className="flex gap-2">
                  <button className="flex-1 p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2">
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
              onClick={() => setShowLearningForm(!showLearningForm)}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Material
            </button>
          </div>

          {showLearningForm && (
            <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8">
              <form onSubmit={handleAddLearning} className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Mavzu Tanlang</label>
                  <select
                    value={learningForm.topic_id}
                    onChange={(e) => setLearningForm({ ...learningForm, topic_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    required
                  >
                    <option value={0}>Mavzuni tanlang...</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Lotin Terminni</label>
                  <input
                    type="text"
                    value={learningForm.latin_term}
                    onChange={(e) => setLearningForm({ ...learningForm, latin_term: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="Masalan: Skeletus"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">O'zbek Terminni</label>
                  <input
                    type="text"
                    value={learningForm.uzbek_term}
                    onChange={(e) => setLearningForm({ ...learningForm, uzbek_term: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="Masalan: Suyak Tuzilmasi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Tavsifi</label>
                  <textarea
                    value={learningForm.description}
                    onChange={(e) => setLearningForm({ ...learningForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="Terminning tavsifi..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLearningForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Bekor Qilish
                  </button>
                </div>
              </form>
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
                      <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-400">
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
            <h2 className="text-2xl font-bold text-white">Test Savollar</h2>
            <button
              onClick={() => setShowQuestionForm(!showQuestionForm)}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi Savol
            </button>
          </div>

          {showQuestionForm && (
            <div className="rounded-3xl border border-gray-800/50 bg-gradient-to-br from-gray-800/30 to-gray-900/50 p-8">
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Mavzu Tanlang</label>
                  <select
                    value={questionForm.topic_id}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    required
                  >
                    <option value={0}>Mavzuni tanlang...</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Savol Matni</label>
                  <textarea
                    value={questionForm.question_text}
                    onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="Savol yozing..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">To'g'ri Javob</label>
                  <input
                    type="text"
                    value={questionForm.correct_answer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                    placeholder="To'g'ri javobni yozing"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Noto'g'ri Javoblar (3 ta)</label>
                  {questionForm.options.map((option, i) => (
                    <input
                      key={i}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[i] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      className="w-full mb-2 px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                      placeholder={`Noto'g'ri javob ${i + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-white mb-2 font-semibold">Qiyinchilik Darajasi</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="easy">Oson</option>
                    <option value="medium">O'rta</option>
                    <option value="hard">Qiyin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuestionForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Bekor Qilish
                  </button>
                </div>
              </form>
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
                      <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-400">
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
    </div>
  );
};

export default AdminTestAdd;
