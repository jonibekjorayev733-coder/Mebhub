import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MedicalApp } from "@/MedicalApp/MedicalApp";
import "@/MedicalApp/styles/medical.css";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="medical-app-container">
      {/* MedicalApp handles its own layout and styling */}
      <MedicalApp />
    </div>
  );
}
