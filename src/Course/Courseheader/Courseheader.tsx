import "./Courseheader.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCourses } from "../../api/taskApi"

interface Course {
    id: number
    title: string
    category: string
    image_url: string | null
    author: string | null
    price: number
    total_lessons: number
    current_lesson: number
}

export default function Courseheader(){
    const navigate = useNavigate()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses()
                setCourses(response.data.slice(0, 5))
            } catch (error) {
                console.error("Error fetching courses:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % courses.length)
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length)
    }

    if (loading) {
        return <div className="courseheader"><p>Kurslar yuklanmoqda...</p></div>
    }

    const visibleCourses = courses.slice(currentIndex, currentIndex + 3)
    const remainingCourses = 3 - visibleCourses.length
    if (remainingCourses > 0) {
        visibleCourses.push(...courses.slice(0, remainingCourses))
    }

    const calculateProgress = (current: number, total: number) => {
        return total > 0 ? (current / total) * 100 : 0
    }

    return(
        <div className="courseheader">
            <div className="courseheader-content">
                <div className="courseheader-text">
                    <h1>Welcome back, ready for your next lesson?</h1>
                    <button className="view-history-btn">View history</button>
                </div>
                <div className="courseheader-cards">
                    {visibleCourses.map((course) => (
                        <div 
                            key={course.id} 
                            className="course-card"
                            onClick={() => navigate(`/courses/${course.id}`)}
                            style={{cursor: 'pointer'}}
                        >
                            <img src={course.image_url || "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600"} alt={course.title} />
                            <div className="card-content">
                                <h3>{course.title}</h3>
                                <div className="progress-bar">
                                    <div className="progress" style={{width: `${calculateProgress(course.current_lesson, course.total_lessons)}%`}}></div>
                                </div>
                                <p className="lesson-count">Lesson {course.current_lesson} of {course.total_lessons}</p>
                            </div>
                        </div>
                    ))}
                    <div className="navigation-arrows">
                        <button className="arrow-btn" onClick={handlePrev}>←</button>
                        <button className="arrow-btn" onClick={handleNext}>→</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
