import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import loginImg from "./img/login.png";
import registerImg from "./img/register.png";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login, register } from "../../api/taskApi";

function passwordBytes(p: string) {
  return new TextEncoder().encode(p).length;
}



export default function Auth() {
  const navigate = useNavigate(); // ✅ faqat component ichida

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const imageSrc = mode === "login" ? loginImg : registerImg;
  const submitText = mode === "login" ? "Login" : "Register";

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (passwordBytes(password) > 72) {
      setError("Password 72 baytdan oshmasin (emoji/harf baytni oshiradi).");
      return;
    }

    if (mode === "register" && !email.trim()) return setError("Email kiriting.");
    if (!username.trim()) return setError("Username kiriting.");
    if (!password.trim()) return setError("Password kiriting.");

    setLoading(true);
    try {
      if (mode === "register") {
        await register(email.trim(), username.trim(), password);
        setSuccess("Ro'yxatdan o'tdingiz ✅ Endi login qiling.");
        setMode("login");
        setPassword("");
      } else {
        // Login
        const res = await login(username.trim(), password);
        
        console.log("Login response:", res.data); // DEBUG

        if (res.data?.message === "Login successful") {
          setSuccess("Login bo'ldi ✅");
          
          // Store token
          if (res.data?.access_token) {
            localStorage.setItem("token", res.data.access_token);
          }
          
          // Store user info
          if (res.data?.role) {
            localStorage.setItem("userRole", res.data.role);
          }
          if (res.data?.avatar) {
            localStorage.setItem("userAvatar", res.data.avatar);
          }
          if (res.data?.username) {
            localStorage.setItem("username", res.data.username);
          }
          if (res.data?.user_id) {
            localStorage.setItem("user_id", res.data.user_id);
          }
          
          console.log("Stored in localStorage:", { // DEBUG
            token: localStorage.getItem("token"),
            role: localStorage.getItem("userRole"),
            username: localStorage.getItem("username"),
          });
          
          // Force a reload of 'me' in Header
          window.dispatchEvent(new Event("auth:changed"));

          // Redirect based on role
          if (res.data?.role === "teacher") {
            setTimeout(() => navigate("/teacher-panel", { replace: true }), 500);
          } else {
            setTimeout(() => navigate("/courses", { replace: true }), 500);
          }
        } else {
          // Should not happen if backend returns 200 only on success
          setError("Login xatoligi");
        }
      }
    } catch (e: any) {
      console.error("Auth error:", e);
      const detail = e.response?.data?.detail;
      if (detail) {
        setError(typeof detail === "string" ? detail : JSON.stringify(detail));
      } else {
        setError("Xatolik yuz berdi. Internetni tekshiring.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="authPage">
      <div className="authCard">
        <div className="authLeft">
          <img className="authLeft__img" src={imageSrc} alt="Auth" />
          <div className="authLeft__overlay">
            <h2>Lorem Ipsum is simply</h2>
            <p>Lorem Ipsum is simply</p>
          </div>
        </div>

        <div className="authRight">
          <div className="authRight__inner">
            <div className="authRight__welcome">Welcome to lorem..!</div>

            <div className="authToggle">
              <button
                type="button"
                className={`authToggle__btn ${mode === "login" ? "isActive" : ""}`}
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              >
                Login
              </button>
              <button
                type="button"
                className={`authToggle__btn ${mode === "register" ? "isActive" : ""}`}
                onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
              >
                Register
              </button>
            </div>

            <p className="authRight__desc">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </p>

            {error && <div style={{ color: "crimson", marginTop: 10 }}>{error}</div>}
            {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}

            <form className="authForm" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {mode === "register" && (
                <>
                  <label className="authLabel">Email Address</label>
                  <input className="authInput" placeholder="Enter your Email Address" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                </>
              )}

              <label className="authLabel">User name</label>
              <input className="authInput" placeholder="Enter your User name" value={username}
                onChange={(e) => setUsername(e.target.value)} />

              <label className="authLabel">Password</label>
              <div className="authPass">
                <input
                  className="authInput authInput--pass"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={72}
                />
                <span className="authEye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>

              <button className="authSubmit" type="submit" disabled={loading}>
                {loading ? "..." : submitText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
