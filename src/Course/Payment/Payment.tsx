import { useState } from "react"
import "./Payment.css"
import axiosInstance from "../../api/taskApi"

interface PaymentProps {
    course: {
        id: number
        title: string
        price: number
        author?: string | null
    }
    onSuccess: () => void
    onCancel: () => void
}

export default function Payment({ course, onSuccess, onCancel }: PaymentProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    })
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const formatCardNumber = (value: string) => {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
    }

    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, '')
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
        }
        return cleaned
    }

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value)
        setFormData(prev => ({
            ...prev,
            cardNumber: formatted
        }))
    }

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value)
        setFormData(prev => ({
            ...prev,
            expiryDate: formatted
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setErrorMessage("")

        try {
            // Validate form data
            if (!formData.fullName || !formData.email || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
                setErrorMessage("Barcha maydonlarni to'ldiring")
                setIsProcessing(false)
                return
            }

            // Remove spaces from card number for backend
            const cardNumberClean = formData.cardNumber.replace(/\s/g, '')

            // Call backend payment endpoint
            const response = await axiosInstance.post("/payments/process", {
                course_id: course.id,
                card_number: cardNumberClean,
                card_expiry: formData.expiryDate,
                card_cvv: formData.cvv,
                card_holder: formData.fullName
            })

            // Success - payment processed
            if (response.status === 200 || response.status === 201) {
                console.log("✅ Payment successful:", response.data)
                setIsProcessing(false)
                onSuccess()
            }
        } catch (error: any) {
            console.error("❌ Payment error:", error)
            
            // Extract error message from backend response
            let errorMsg = "To'lov jarayonida xato yuz berdi"
            
            if (error.response?.data?.detail) {
                errorMsg = error.response.data.detail
            } else if (error.response?.data?.error) {
                errorMsg = error.response.data.error
            } else if (error.message) {
                errorMsg = error.message
            }

            setErrorMessage(errorMsg)
            setIsProcessing(false)
        }
    }

    return (
        <div className="payment-overlay">
            <div className="payment-container">
                <button className="close-btn" onClick={onCancel}>✕</button>

                <div className="payment-content">
                    {/* Left - Order Summary */}
                    <div className="order-summary">
                        <h2>Sotib olish xulasasi</h2>
                        
                        <div className="course-summary">
                            <h3>{course.title}</h3>
                            <p className="instructor">O'qituvchi: {course.author}</p>
                            <div className="summary-item">
                                <span>Kurs narxi</span>
                                <span>${course.price}</span>
                            </div>
                            <div className="summary-item">
                                <span>Tariflar</span>
                                <span>$0</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-item total">
                                <span>Jami</span>
                                <span>${course.price}</span>
                            </div>
                        </div>

                        <div className="payment-methods">
                            <p>Quyidagi to'lov usullarini qabul qilamiz:</p>
                            <div className="method-icons">
                                <span className="method-icon">💳 PayPal</span>
                                <span className="method-icon">🏦 Visa</span>
                                <span className="method-icon">💳 Mastercard</span>
                            </div>
                        </div>

                        <div className="security-badge">
                            <span>🔒</span>
                            <p>Sizning to'lovingiz xavfsiz shufrirdir</p>
                        </div>
                    </div>

                    {/* Right - Payment Form */}
                    <div className="payment-form-section">
                        <h2>Kartani kiriting</h2>

                        {errorMessage && (
                            <div className="error-message" style={{
                                backgroundColor: "#fee",
                                color: "#c33",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "15px",
                                fontSize: "14px",
                                border: "1px solid #fcc"
                            }}>
                                ⚠️ {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="payment-form">
                            <div className="form-group">
                                <label>To'liq ism</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Jonibek Aliev"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="example@mail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Karta raqami</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="4111 1111 1111 1111"
                                    value={formData.cardNumber}
                                    onChange={handleCardNumberChange}
                                    maxLength={19}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Muddati</label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleExpiryChange}
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        maxLength={3}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="pay-btn" disabled={isProcessing}>
                                {isProcessing ? "Qayta ishlash..." : `${course.price}$ tulov qilish`}
                            </button>

                            <p className="payment-info">
                                Siz Udemy Terms of Service va Refund Policy ga rozisiz
                            </p>
                        </form>

                        <button className="cancel-btn" onClick={onCancel}>Bekor qilish</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
