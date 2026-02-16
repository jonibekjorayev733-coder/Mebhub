import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Register/Login/Login";
import Courses from "./Course/Courses/Courses";
import CourseDetail from "./Course/CourseDetail/CourseDetail";
import AILearning from "./Course/AILearning/AILearning";
import TeacherPanel from "./Teacher/TeacherPanel";
import StudentMessaging from "./Student/StudentMessaging";
import Profile from "./Profile";
import Settings from "./Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/ai-learning/:courseId" element={<AILearning />} />
        <Route path="/teacher-panel" element={<TeacherPanel />} />
        <Route path="/student-messaging" element={<StudentMessaging />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
