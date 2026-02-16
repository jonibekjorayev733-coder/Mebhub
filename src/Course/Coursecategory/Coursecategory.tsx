import "./Coursecategory.css"
import { useEffect, useState } from "react"
import { getCourses } from "../../api/taskApi"

interface Category {
    name: string
    icon: JSX.Element
}

export default function Coursecategory(){
    const [categories, setCategories] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const categoryIcons: Record<string, JSX.Element> = {
        Design: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                    <path d="M2 2l7.586 7.586"/>
                    <circle cx="11" cy="11" r="2"/>
                </svg>,
        Development: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                    </svg>,
        Business: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>,
        Marketing: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>,
        Photography: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>,
        Acting: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>,
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCourses()
                const uniqueCategories = Array.from(new Set(response.data.map((course: any) => course.category)))
                setCategories(uniqueCategories as string[])
            } catch (error) {
                console.error("Error fetching categories:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (loading) {
        return <div className="coursecategory"><p>Kategoriyalar yuklanmoqda...</p></div>
    }

    const categoryClasses = ['design', 'development', 'business', 'marketing', 'photography', 'acting']

    return(
        <div className="coursecategory">
            <div className="category-grid">
                {categories.map((category, index) => (
                    <div key={category} className={`category-card ${categoryClasses[index % categoryClasses.length]}`}>
                        <div className="icon-box">
                            {categoryIcons[category] || categoryIcons['Design']}
                        </div>
                        <h3>{category}</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing do eiusmod tempor</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
