import "./Courseslider.css"
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
}

export default function Courseslider(){
    const navigate = useNavigate()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getCourses()
                setCourses(response.data)
            } catch (error) {
                console.error("Error fetching courses:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    if (loading) {
        return <div className="courseslider"><p>Kurslar yuklanmoqda...</p></div>
    }

    return(
        <div className="courseslider">
            <h2>The course is powered development</h2>
            <div className="slider-grid">
                {courses.map((course) => (
                    <div key={course.id} className="slider-card" onClick={() => navigate(`/courses/${course.id}`)} style={{cursor: 'pointer'}}>
                        <img src={course.image_url || "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600"} alt={course.title} />
                        <div className="slider-content">
                            <span className="category-tag">{course.category}</span>
                            <h3>{course.title}</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                            <div className="course-meta">
                                <div className="instructor">
                                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60" alt="Instructor" />
                                    <span>{course.author || "Instructor"}</span>
                                </div>
                                <div className="rating">
                                    <span>4.5</span>
                                </div>
                                <div className="price">
                                    <span>${course.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
