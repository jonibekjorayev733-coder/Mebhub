import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTopics from "./pages/AdminTopics";
import AdminLearning from "./pages/AdminLearning";
import AdminQuestions from "./pages/AdminQuestions";
import AdminUsers from "./pages/AdminUsers";
import AdminAuthentication from "./pages/AdminAuthentication";
import AdminTestAdd from "./pages/AdminTestAdd";
import { Dashboard } from "@/pages/dashboard";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./index.css";

interface User {
  is_admin?: boolean;
}

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
}

function AdminRoute({ element }: { element: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  // Debug: log user to see is_admin value
  console.log('AdminRoute - isAuthenticated:', isAuthenticated, 'user:', user);

  const userWithAdmin = user as User | null;
  
  // Allow access if authenticated AND (is_admin OR no is_admin field set - for testing)
  if (isAuthenticated && (userWithAdmin?.is_admin || userWithAdmin?.is_admin === undefined)) {
    return element;
  }

  return <Navigate to="/" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route
        path="/admin"
        element={<AdminRoute element={<AdminLayout />} />}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="topics" element={<AdminTopics />} />
        <Route path="learning" element={<AdminLearning />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="authentication" element={<AdminAuthentication />} />
        <Route path="test-add" element={<AdminTestAdd />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
