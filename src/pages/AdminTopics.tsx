import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface Topic {
  id: number;
  name: string;
  description: string;
  order: number;
}

interface Message {
  type: "success" | "error";
  text: string;
}

const AdminTopics: React.FC = () => {
  const { token, isLoading: authLoading } = useAuth();

  // Topic form state
  const [topicForm, setTopicForm] = useState({
    name: "",
    description: "",
    order: 1,
  });

  // Test/Question form state
  const [testForm, setTestForm] = useState({
    topic_id: "",
    question_text: "",
    correct_answer: "",
    options: ["", "", "", ""],
    difficulty: "medium",
    order: 1,
  });

  // Learning item form state
  const [learningForm, setLearningForm] = useState({
    topic_id: "",
    latin_term: "",
    uzbek_term: "",
    description: "",
    order: 1,
  });

  // State
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingLearning, setLoadingLearning] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [testTopicSearch, setTestTopicSearch] = useState("");
  const [learningTopicSearch, setLearningTopicSearch] = useState("");
  const [showTestDropdown, setShowTestDropdown] = useState(false);
  const [showLearningDropdown, setShowLearningDropdown] = useState(false);

  // Fetch topics on mount
  useEffect(() => {
    if (!authLoading && token) {
      fetchTopics();
    }
  }, [token, authLoading]);

  const fetchTopics = async () => {
    if (!token) {
      console.warn("No token available");
      return;
    }
    setLoadingTopics(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      
      const response = await fetch("/admin/topics", {
        method: "GET",
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        setTopics(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        console.error("Unauthorized: Token invalid or user is not admin");
        setMessage({
          type: "error",
          text: "Autentifikatsiya muammosi. Qayta kiring.",
        });
      } else {
        console.error("Failed to fetch topics:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setMessage({
        type: "error",
        text: "Mavzular yuklanmadi: " + (error as Error).message,
      });
    } finally {
      setLoadingTopics(false);
    }
  };

  // Filter topics based on search
  const filteredTopicsForTest = topics.filter((topic) =>
    topic.name.toLowerCase().includes(testTopicSearch.toLowerCase())
  );

  const filteredTopicsForLearning = topics.filter((topic) =>
    topic.name.toLowerCase().includes(learningTopicSearch.toLowerCase())
  );

  // Submit topic form
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage({ type: "error", text: "Token mavjud emas. Qayta kiring." });
      return;
    }
    setLoadingTopic(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("/admin/topics", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(topicForm),
      });

      if (response.ok) {
        const newTopic = await response.json();
        setTopics([...topics, newTopic]);
        setMessage({
          type: "success",
          text: "✓ Mavzu muvaffaqiyatli qo'shildi!",
        });
        setTopicForm({ name: "", description: "", order: 1 });
        setTimeout(() => setMessage(null), 3000);
      } else if (response.status === 401) {
        setMessage({
          type: "error",
          text: "Xato: Siz admin emasiz yoki token muddati tugagan.",
        });
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Xato: ${error || "Mavzu qo'shilmadi"}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Xato: " + (error as Error).message,
      });
    } finally {
      setLoadingTopic(false);
    }
  };

  // Submit test form
  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.topic_id) {
      setMessage({ type: "error", text: "Iltimos, mavzuni tanlang" });
      return;
    }
    if (!token) {
      setMessage({ type: "error", text: "Token mavjud emas. Qayta kiring." });
      return;
    }

    setLoadingTest(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("/admin/questions", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          topic_id: parseInt(testForm.topic_id),
          question_text: testForm.question_text,
          correct_answer: testForm.correct_answer,
          options: testForm.options.filter((o) => o.trim()),
          difficulty: testForm.difficulty,
          order: testForm.order,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✓ Test muvaffaqiyatli qo'shildi!",
        });
        setTestForm({
          topic_id: "",
          question_text: "",
          correct_answer: "",
          options: ["", "", "", ""],
          difficulty: "medium",
          order: 1,
        });
        setTestTopicSearch("");
        setShowTestDropdown(false);
        setTimeout(() => setMessage(null), 3000);
      } else if (response.status === 401) {
        setMessage({
          type: "error",
          text: "Xato: Siz admin emasiz yoki token muddati tugagan.",
        });
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Xato: ${error || "Test qo'shilmadi"}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Xato: " + (error as Error).message,
      });
    } finally {
      setLoadingTest(false);
    }
  };

  // Submit learning form
  const handleAddLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningForm.topic_id) {
      setMessage({ type: "error", text: "Iltimos, mavzuni tanlang" });
      return;
    }
    if (!token) {
      setMessage({ type: "error", text: "Token mavjud emas. Qayta kiring." });
      return;
    }

    setLoadingLearning(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("/admin/items", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          topic_id: parseInt(learningForm.topic_id),
          latin_term: learningForm.latin_term,
          uzbek_term: learningForm.uzbek_term,
          description: learningForm.description,
          order: learningForm.order,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "✓ O'rganish materiali muvaffaqiyatli qo'shildi!",
        });
        setLearningForm({
          topic_id: "",
          latin_term: "",
          uzbek_term: "",
          description: "",
          order: 1,
        });
        setLearningTopicSearch("");
        setShowLearningDropdown(false);
        setTimeout(() => setMessage(null), 3000);
      } else if (response.status === 401) {
        setMessage({
          type: "error",
          text: "Xato: Siz admin emasiz yoki token muddati tugagan.",
        });
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Xato: ${error || "Material qo'shilmadi"}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Xato: " + (error as Error).message,
      });
    } finally {
      setLoadingLearning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Mavzularni Boshqarish</h1>
        <p className="text-gray-400">Mavzular, testlar va o'rganish materiallarini qo'shish</p>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-success-500/20 text-success-400"
              : "bg-error-500/20 text-error-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* FORM 1: ADD TOPIC */}
        <div className="p-6 rounded-lg border border-gray-800 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white mb-4">Yangi Mavzu</h2>
          <form onSubmit={handleAddTopic} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mavzu nomi
              </label>
              <input
                type="text"
                value={topicForm.name}
                onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="masalan: Qalb"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tavsifi
              </label>
              <textarea
                value={topicForm.description}
                onChange={(e) =>
                  setTopicForm({ ...topicForm, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 h-20"
                placeholder="Mavzu haqida"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tartibi
              </label>
              <input
                type="number"
                value={topicForm.order}
                onChange={(e) =>
                  setTopicForm({ ...topicForm, order: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loadingTopic}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loadingTopic ? "Qo'shilmoqda..." : "Mavzu Qo'shish"}
            </button>
          </form>
        </div>

        {/* FORM 2: ADD TEST/QUESTION */}
        <div className="p-6 rounded-lg border border-gray-800 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white mb-4">Yangi Test</h2>
          <form onSubmit={handleAddTest} className="space-y-4">
            {/* Topic Select with Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mavzuni Tanlang
              </label>
              <div
                className="border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-brand-500 cursor-pointer p-2"
                onClick={() => setShowTestDropdown(!showTestDropdown)}
              >
                <div className="px-2 py-1">
                  {testForm.topic_id
                    ? topics.find((t) => t.id === parseInt(testForm.topic_id))?.name ||
                      "Mavzuni tanlang..."
                    : "Mavzuni tanlang..."}
                </div>
              </div>

              {showTestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-gray-700 rounded-lg bg-gray-800 z-10 shadow-lg">
                  <input
                    type="text"
                    placeholder="Qidiring..."
                    value={testTopicSearch}
                    onChange={(e) => setTestTopicSearch(e.target.value)}
                    className="w-full px-3 py-2 border-b border-gray-700 bg-gray-700 text-white placeholder-gray-500 focus:outline-none"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {loadingTopics ? (
                      <div className="px-4 py-2 text-gray-400">Yuklanmoqda...</div>
                    ) : filteredTopicsForTest.length > 0 ? (
                      filteredTopicsForTest.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => {
                            setTestForm({ ...testForm, topic_id: topic.id.toString() });
                            setShowTestDropdown(false);
                            setTestTopicSearch("");
                          }}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                          {topic.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">Mavzu topilmadi</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Savol matni
              </label>
              <textarea
                value={testForm.question_text}
                onChange={(e) =>
                  setTestForm({ ...testForm, question_text: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 h-16"
                placeholder="Savolingizni yozing"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To'g'ri javob
              </label>
              <input
                type="text"
                value={testForm.correct_answer}
                onChange={(e) =>
                  setTestForm({ ...testForm, correct_answer: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="To'g'ri javob"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Noto'g'ri javoblar (3 ta)
              </label>
              {testForm.options.map((option, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...testForm.options];
                    newOptions[idx] = e.target.value;
                    setTestForm({ ...testForm, options: newOptions });
                  }}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 mb-2"
                  placeholder={`Variant ${idx + 1}`}
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Qiynchiligi
              </label>
              <select
                value={testForm.difficulty}
                onChange={(e) =>
                  setTestForm({ ...testForm, difficulty: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="easy">Oson</option>
                <option value="medium">O'rta</option>
                <option value="hard">Qiyin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loadingTest}
              className="w-full bg-success-500 hover:bg-success-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loadingTest ? "Qo'shilmoqda..." : "Test Qo'shish"}
            </button>
          </form>
        </div>

        {/* FORM 3: ADD LEARNING MATERIAL */}
        <div className="p-6 rounded-lg border border-gray-800 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white mb-4">O'rganish Materiali</h2>
          <form onSubmit={handleAddLearning} className="space-y-4">
            {/* Topic Select with Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mavzuni Tanlang
              </label>
              <div
                className="border border-gray-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-brand-500 cursor-pointer p-2"
                onClick={() => setShowLearningDropdown(!showLearningDropdown)}
              >
                <div className="px-2 py-1">
                  {learningForm.topic_id
                    ? topics.find((t) => t.id === parseInt(learningForm.topic_id))
                        ?.name || "Mavzuni tanlang..."
                    : "Mavzuni tanlang..."}
                </div>
              </div>

              {showLearningDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 border border-gray-700 rounded-lg bg-gray-800 z-10 shadow-lg">
                  <input
                    type="text"
                    placeholder="Qidiring..."
                    value={learningTopicSearch}
                    onChange={(e) => setLearningTopicSearch(e.target.value)}
                    className="w-full px-3 py-2 border-b border-gray-700 bg-gray-700 text-white placeholder-gray-500 focus:outline-none"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {loadingTopics ? (
                      <div className="px-4 py-2 text-gray-400">Yuklanmoqda...</div>
                    ) : filteredTopicsForLearning.length > 0 ? (
                      filteredTopicsForLearning.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => {
                            setLearningForm({
                              ...learningForm,
                              topic_id: topic.id.toString(),
                            });
                            setShowLearningDropdown(false);
                            setLearningTopicSearch("");
                          }}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                          {topic.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400">Mavzu topilmadi</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lotin terminasi
              </label>
              <input
                type="text"
                value={learningForm.latin_term}
                onChange={(e) =>
                  setLearningForm({ ...learningForm, latin_term: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="masalan: Myocardium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                O'zbek tarjimasi
              </label>
              <input
                type="text"
                value={learningForm.uzbek_term}
                onChange={(e) =>
                  setLearningForm({ ...learningForm, uzbek_term: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="masalan: Yurak muskulasi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tavsifi
              </label>
              <textarea
                value={learningForm.description}
                onChange={(e) =>
                  setLearningForm({ ...learningForm, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 h-16"
                placeholder="Terminologiya haqida ma'lumot"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingLearning}
              className="w-full bg-warning-500 hover:bg-warning-600 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loadingLearning ? "Qo'shilmoqda..." : "Material Qo'shish"}
            </button>
          </form>
        </div>
      </div>

      {/* TOPICS DISPLAY - Show all topics as cards */}
      {topics.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Barcha Mavzular</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-lg border border-gray-800 bg-gray-800/30 hover:border-brand-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                    <span className="text-brand-400 font-bold">{topic.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-xs text-gray-500">#{topic.id}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{topic.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{topic.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Tartibi: {topic.order}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-500/20 text-brand-400">
                    Mavzu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTopics;
