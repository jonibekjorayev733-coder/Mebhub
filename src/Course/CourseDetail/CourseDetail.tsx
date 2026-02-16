import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCourseById } from "../../api/taskApi"
import Payment from "../Payment/Payment"
import "./CourseDetail.css"

interface Lesson {
    id: number
    course_id: number
    title: string
    description: string | null
    video_url: string | null
    order: number
}

interface CourseDetail {
    id: number
    title: string
    category: string
    image_url: string | null
    author: string | null
    price: number
    total_lessons: number
    current_lesson: number
    description: string | null
    lessons: Lesson[]
}

export type Course = CourseDetail

export default function CourseDetail() {
    const { courseId } = useParams<{ courseId: string }>()
    const navigate = useNavigate()
    const [course, setCourse] = useState<CourseDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
    const [isPurchased, setIsPurchased] = useState(false)
    const [showPayment, setShowPayment] = useState(false)
    const FREE_LESSONS_COUNT = 2

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                if (!courseId) return
                const response = await getCourseById(parseInt(courseId))
                setCourse(response.data)
                if (response.data.lessons && response.data.lessons.length > 0) {
                    setSelectedLesson(response.data.lessons[0])
                }
                // Check if course is purchased from localStorage
                const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
                setIsPurchased(purchasedCourses.includes(parseInt(courseId)))
            } catch (error) {
                console.error("Error fetching course:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourse()
    }, [courseId])

    const isLessonFree = (lessonOrder: number) => {
        return lessonOrder <= FREE_LESSONS_COUNT
    }

    const canAccessLesson = (lessonOrder: number) => {
        return isLessonFree(lessonOrder) || isPurchased
    }

    const handleBuyNow = () => {
        setShowPayment(true)
    }

    const handlePaymentSuccess = () => {
        if (courseId) {
            const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
            if (!purchasedCourses.includes(parseInt(courseId))) {
                purchasedCourses.push(parseInt(courseId))
                localStorage.setItem('purchasedCourses', JSON.stringify(purchasedCourses))
            }
            setIsPurchased(true)
            setShowPayment(false)
        }
    }

    if (loading) {
        return <div className="course-detail-loading">Yuklanmoqda...</div>
    }

    if (!course) {
        return (
            <div className="course-detail-error">
                <p>Kurs topilmadi</p>
                <button onClick={() => navigate(-1)}>Orqaga</button>
            </div>
        )
    }

    if (showPayment && course) {
        return <Payment course={course} onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} />
    }

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
        } catch (error) {
            return null;
        }
    };

    return (
        <div className="course-detail">
            <button className="back-btn" onClick={() => navigate(-1)}>← Orqaga</button>

            <div className="course-detail-container">
                {/* Video Player Section */}
                <div className="course-detail-main">
                    <div className="video-player">
                        {selectedLesson && !canAccessLesson(selectedLesson.order) ? (
                            <div className="locked-video">
                                <div className="lock-icon">🔒</div>
                                <h3>Bu dars qulfli</h3>
                                <p>Barcha darslarni ko'rish uchun kursni sotib oling</p>
                                <button className="unlock-btn" onClick={handleBuyNow}>Sotib olish - ${course?.price}</button>
                            </div>
                        ) : selectedLesson?.video_url ? (
                            <iframe
                                width="100%"
                                height="600"
                                src={getYoutubeEmbedUrl(selectedLesson.video_url) || ""}
                                title={selectedLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="no-video">Video mavjud emas</div>
                        )}
                    </div>

                    <div className="lesson-info">
                        <h2>{selectedLesson?.title || "Dars"}</h2>
                        <p>{selectedLesson?.description}</p>

                        {/* Topic-relevant content section */}
                        {/* AI Interaction Section */}
                        <div className="ai-section">
                            <button className="ai-btn-large" onClick={() => navigate(`/ai-learning/${courseId}`)}>
                                <div className="ai-btn-content">
                                    <span className="ai-icon-large">🤖</span>
                                    <div className="ai-text-group">
                                        <span className="ai-title">AI Yordamchi</span>
                                        <span className="ai-subtitle">Dars bo'yicha savol berish</span>
                                    </div>
                                </div>
                                <span className="ai-arrow-large">→</span>
                            </button>

                            <button className="ai-btn-large" onClick={() => navigate('/student-messaging')} style={{ marginTop: '12px', backgroundColor: '#667eea' }}>
                                <div className="ai-btn-content">
                                    <span className="ai-icon-large">💬</span>
                                    <div className="ai-text-group">
                                        <span className="ai-title">O'qituvchi bilan bog'lanish</span>
                                        <span className="ai-subtitle">Dars bo'yicha savol berish</span>
                                    </div>
                                </div>
                                <span className="ai-arrow-large">→</span>
                            </button>

                            <div className="topic-analysis">
                                <h3>Mavzu tahlili</h3>
                                <p>{getTopicContent(selectedLesson?.title || "")}</p>
                            </div>
                        </div>

                        <div className="course-progress">
                            <h3>Kurs progessi</h3>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${(course.current_lesson / course.total_lessons) * 100}%` }}></div>
                            </div>
                            <p>Dars {course.current_lesson} of {course.total_lessons}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Lessons List */}
                <div className="course-detail-sidebar">
                    <div className="course-header-info">
                        <h1>{course.title}</h1>
                        <div className="course-meta">
                            <span className="category">{course.category}</span>
                            <span className="instructor">{course.author}</span>
                            <span className="price">${course.price}</span>
                        </div>
                        <p className="description">{course.description}</p>

                        {!isPurchased && (
                            <button className="buy-now-btn" onClick={handleBuyNow}>
                                Sotib olish - ${course.price}
                            </button>
                        )}
                        {isPurchased && (
                            <div className="purchased-badge">✓ Sotib olingan</div>
                        )}
                    </div>

                    <div className="lessons-list">
                        <h3>Darslar ({course.lessons.length})</h3>
                        <p className="free-notice">{FREE_LESSONS_COUNT}ta dars bepul</p>
                        {course.lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className={`lesson-item ${selectedLesson?.id === lesson.id ? 'active' : ''} ${!canAccessLesson(lesson.order) ? 'locked' : ''}`}
                                onClick={() => canAccessLesson(lesson.order) ? setSelectedLesson(lesson) : null}
                            >
                                <div className="lesson-number">
                                    {!canAccessLesson(lesson.order) ? '🔒' : index + 1}
                                </div>
                                <div className="lesson-details">
                                    <h4>{lesson.title}</h4>
                                    <p>{lesson.description}</p>
                                    {!canAccessLesson(lesson.order) && (
                                        <span className="locked-badge">Qulfli</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getTopicContent(title: string): React.ReactNode {
    const contentMap: { [key: string]: string } = {
        "AWS Fundamentals": "AWS bilan ishlashning asoslari. Amazon Web Services har bir turi xizmatini o'rganish, cloud computing asoslari, va infrastrukturasi haqida bilim olasiz.",
        "EC2 Instances": "Elastic Compute Cloud - virtual serverlarni yaratish va sozlash. EC2 turlari, instance lifecycle, security groups konfiguratsiyasi.",
        "S3 Storage": "Simple Storage Service - ob'ektlar saqlash xizmati. Bucket yaratish, fayllarni upload qilish, versioning va lifecycle policies.",
        "VPC & Security": "Virtual Private Cloud - xavfsiz tarmoq muhiti. Security groups, NACLs, subnets, va network architecture.",
        "Databases": "RDS (Relational Database Service) va DynamoDB - ma'lumotlar bazalarini boshqarish.",
        "Load Balancing": "ELB (Elastic Load Balancer) - trafikni taqsimlash va high availability.",
        "Monitoring": "CloudWatch - monitorin va logging xizmati. Metrics, alarms, va dashboards.",
        "Networking Basics": "Tarmoq asoslari. TCP/IP, OSI model, ports, protocols, DNS, DHCP.",
        "Penetration Testing": "Zaaifliklarni topish uchun xavfsiz test qilish. Tools, metodologiya, va best practices.",
        "Web Security": "Web aplikatsiyalarni himoya qilish. OWASP Top 10, SQL injection, XSS, CSRF.",
        "Cryptography": "Shifrlash metodlari. Symmetric, asymmetric encryption, hashing, digital signatures.",
        "Malware Analysis": "Zararli dasturlarni tahlil qilish. Static va dynamic analysis, reverse engineering.",
        "Vulnerability Assessment": "Zaaifliklarni aniqlash va baholash. Scanning tools, report generation.",
        "Ethical Hacking Tools": "Penetration testing uchun qurilmalar. Nmap, Metasploit, Wireshark, Burp Suite.",
        "Python Basics": "Python dasturlash til asoslari. Variables, data types, operators, control flow.",
        "OOP Concepts": "Object-Oriented Programming - sinflar, obyektlar, vorislik, polimorfizm.",
        "Decorators": "Python decorators - funksiyalarni modifikatsiya qilish. @property, @staticmethod.",
        "Generators": "Generator funksiyalari - lazy evaluation, memory efficiency, yield operatori.",
        "Async Programming": "Asinxron dasturlash - asyncio, await, coroutines, event loop.",
        "List Comprehensions": "Python's powerful list/dict/set comprehensions - concise va efficient.",
        "Error Handling": "Exception handling - try/except/finally, custom exceptions, logging.",
        "Modules & Packages": "Kod tartibini saqlash - modules, packages, imports, __init__.py.",
        "Testing": "Unit testing - pytest framework, fixtures, mocking, coverage.",
        "Performance": "Kod optimizatsiyasi - profiling, bottleneck identification, refactoring.",
    }

    return contentMap[title] || "Bu dars haqida qo'shimcha ma'lumot..."
}
