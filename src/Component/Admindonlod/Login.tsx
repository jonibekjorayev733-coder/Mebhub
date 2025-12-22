
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login qildi:", credential.user.uid);
        navigate("/", { replace: true });

      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: name,
          role: "user", 
          createdAt: serverTimestamp(),
        });

        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
        }

        console.log("SignUp qildi:", user.uid);
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      alert(error?.message || "Xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" aria-live="polite">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Ism va familiya"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? isLogin
              ? "Kirish..."
              : "Ro'yxatdan..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>

        <p>
          {isLogin ? "Akkauntingiz yo‘qmi?" : "Akkauntingiz bormi?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setIsLogin(!isLogin);
            }}
          >
            {isLogin ? "Ro‘yxatdan o‘ting" : "Login qiling"}
          </span>
        </p>
      </form>
    </div>
  );
}
