import "./header.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import image from "./imgs/image.png";
import imgs from "../Main/img2/gril.png"
import { Link } from "react-router-dom";
import { getCurrentUser, logout as apiLogout } from "../../api/taskApi";

type Me = { id: number; username: string; email: string };

export default function Header() {
  const navigate = useNavigate();

  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);

  async function loadMe() {
    try {
      const res = await getCurrentUser();
      setMe(res.data);
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    loadMe();

    // Listen for login/logout events
    const refresh = () => loadMe();
    window.addEventListener("auth:changed", refresh);
    return () => window.removeEventListener("auth:changed", refresh);
  }, []);

  async function logout() {
    // In a real cookie-auth system, we should call a logout endpoint to clear the cookie
    // For now, valid to just clear frontend state and maybe call backend logout if exists
    // But since we don't have a backend logout that clears cookies yet (usually), 
    // we can just reload or rely on token expiry. 
    // Ideally, we add a logout endpoint. For now, let's just clear client state.
    // actually better to add logout endpoint to clear cookie.

    // Attempting to clear via backend (optional but recommended)
    // await axiosInstance.post("/auth/logout"); 

    // For now, just navigate and reload to clear state if we can't clear httpOnly cookie from JS
    // BUT we can't clear HttpOnly cookie from JS. We have to call backend.
    // I will add a backend logout endpoint in the next step.
    try {
      await apiLogout();
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem("userRole"); // Clear role on logout
    setMe(null);
    setOpen(false);
    navigate("/login", { replace: true });
  }


  return (
    <header className="header">
      <div className="head">
        <img className="image" src={image} alt="Rasm mavjud emas" />

        <div className="headerright">
          <ul>
            <li><Link to="/courses">Courses</Link></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">About Us</a></li>
          </ul>

          {!me ? (
            <div className="headerbutton">
              <button onClick={() => navigate("/login")} className="button1">login</button>
              <button onClick={() => navigate("/login")} className="button2">sign UP</button>
            </div>
          ) : (
            <div className="userBox">
              <button className="avatarBtn" onClick={() => setOpen(v => !v)}>
                <div className="avatarCircle">
                  <img src={imgs} alt="" />
                </div>
                <span className="avatarName">{me.username}</span>
                <span className="avatarArrow">▾</span>
              </button>

              {open && (
                <div className="userMenu">
                  {localStorage.getItem("userRole") === "teacher" && (
                    <>
                      <button className="menuItem" onClick={() => { setOpen(false); navigate("/teacher-panel"); }}>
                        👨‍🏫 Teacher Panel
                      </button>
                      <div className="menuLine" />
                    </>
                  )}
                  <button className="menuItem" onClick={() => { setOpen(false); navigate("/profile"); }}>
                    Profile
                  </button>
                  <button className="menuItem" onClick={() => { setOpen(false); navigate("/settings"); }}>
                    Settings
                  </button>
                  <div className="menuLine" />
                  <button className="menuItem menuLogout" onClick={logout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="body"></div>
    </header>
  );
}
