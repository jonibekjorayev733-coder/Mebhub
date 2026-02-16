import "./CourseFooter.css"

export default function CourseFooter(){
    return(
        <div className="coursefooter">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-logo">
                        <h2>TOTC</h2>
                    </div>
                    <div className="footer-section">
                        <h3>Top 4 Category</h3>
                        <ul>
                            <li>Development</li>
                            <li>Finance & Accounting</li>
                            <li>Design</li>
                            <li>Business</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>About</li>
                            <li>Become Instructor</li>
                            <li>Contact</li>
                            <li>Career</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li>Help Center</li>
                            <li>FAQs</li>
                            <li>Terms & Condition</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="footer-newsletter">
                        <h3>Subscribe to get the Newsletter</h3>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Your Email" />
                            <button>Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>Copyright © 2023 StartUp Inc.</p>
                </div>
            </div>
        </div>
    )
}
