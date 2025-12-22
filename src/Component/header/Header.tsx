import './header.css';
import { IoSearchSharp } from "react-icons/io5";
import { RiShoppingCart2Line, RiUserLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../Admindonlod/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem("cartCount");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("cartCount");
      if (saved) setCount(parseInt(saved, 10));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        console.log("Current UID:", u.uid);
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setRole(data.role || null);
          console.log("Firestore role:", data.role);
        } else {
          console.warn("Firestore: bunday foydalanuvchi yo‘q!", u.uid);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogin = () => navigate("/login");
  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="header">
      <div className="headercenter">
        <span>
          <h2>sub</h2>
          <h2>readey</h2>
        </span>

        <ul>
          <li><a href="/">home</a></li>
          <li><a href="/">about</a></li>
          <li><a href="/">contact</a></li>
          <li><a href="/">blog</a></li>
          <li><a href="/">shop</a></li>
        </ul>

        <div className="fast">
          <div className="inputs">
            <input type="text" placeholder="search..." />
            <button><IoSearchSharp /></button>
          </div>

          <div className="cart-wrap">
            <button onClick={() => navigate("/cart")}>
              <RiShoppingCart2Line />
            </button>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </div>

          {!user ? (
            <button onClick={handleLogin}><RiUserLine /></button>
          ) : (
            <div className="user-wrap" ref={wrapRef}>
              <div
                className="user-avatar"
                onClick={() => setOpen((v) => !v)}
                role="button"
                tabIndex={0}
                aria-expanded={open}
              >
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase()}
              </div>

              <div className={`dropdown ${open ? "open" : ""}`}>
                <p className="user-name">{user.displayName || user.email}</p>

                {/* 🔥 Role check */}
                {role === "admin" && (
                  <button
                    className="admin-btn"
                    onClick={() => {
                      navigate("/admin");
                      setOpen(false);
                    }}
                  >
                    Admin Panel
                  </button>
                )}

                {role === "chef" && (
                  <button
                    className="admin-btn"
                    onClick={() => {
                      navigate("/chef");
                      setOpen(false);
                    }}
                  >
                    Chef Panel
                  </button>
                )}

                <button className="logout-btn" onClick={handleLogout}>
                  Chiqish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
