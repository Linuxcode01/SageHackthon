/**
 * AppRouter.jsx
 * Central routing configuration for the entire app.
 * Uses React Router v6 with protected routes based on user role.
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Auth screens
import SplashScreen    from "../screens/SplashScreen";
import LoginScreen     from "../screens/LoginScreen";
import SignupScreen    from "../screens/SignupScreen";

// Teacher screens
import TeacherDashboard     from "../screens/teacher/TeacherDashboard";
import TeacherStudents      from "../screens/teacher/TeacherStudents";
import TeacherAnalytics     from "../screens/teacher/TeacherAnalytics";
import TeacherInsights      from "../screens/teacher/TeacherInsights";
import TeacherUpload        from "../screens/teacher/TeacherUpload";
import TeacherChatbot       from "../screens/teacher/TeacherChatbot";
import TeacherNotifications from "../screens/teacher/TeacherNotifications";
import TeacherProfile       from "../screens/teacher/TeacherProfile";

// Student screens
import StudentDashboard  from "../screens/student/StudentDashboard";
import StudentPerformance from "../screens/student/StudentPerformance";
import StudentSubjects   from "../screens/student/StudentSubjects";
import StudentInsights   from "../screens/student/StudentInsights";
import StudentChatbot    from "../screens/student/StudentChatbot";
import StudentProfile    from "../screens/student/StudentProfile";

// Admin screens
import AdminDashboard   from "../screens/admin/AdminDashboard";
import AdminDepartments from "../screens/admin/AdminDepartments";
import AdminStudents    from "../screens/admin/AdminStudents";
import AdminTeachers    from "../screens/admin/AdminTeachers";
import AdminAnalytics   from "../screens/admin/AdminAnalytics";
import AdminInsights    from "../screens/admin/AdminInsights";
import AdminReports     from "../screens/admin/AdminReports";
import AdminActivity    from "../screens/admin/AdminActivity";
import AdminChatbot     from "../screens/admin/AdminChatbot";
import AdminProfile     from "../screens/admin/AdminProfile";

/**
 * ProtectedRoute — redirects to login if not authenticated or wrong role.
 */
function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"       element={<SplashScreen />} />
        <Route path="/login"  element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginScreen />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} replace /> : <SignupScreen />} />

        {/* ── Teacher routes ── */}
        <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/students"      element={<ProtectedRoute allowedRole="teacher"><TeacherStudents /></ProtectedRoute>} />
        <Route path="/teacher/analytics"     element={<ProtectedRoute allowedRole="teacher"><TeacherAnalytics /></ProtectedRoute>} />
        <Route path="/teacher/insights"      element={<ProtectedRoute allowedRole="teacher"><TeacherInsights /></ProtectedRoute>} />
        <Route path="/teacher/upload"        element={<ProtectedRoute allowedRole="teacher"><TeacherUpload /></ProtectedRoute>} />
        <Route path="/teacher/chatbot"       element={<ProtectedRoute allowedRole="teacher"><TeacherChatbot /></ProtectedRoute>} />
        <Route path="/teacher/notifications" element={<ProtectedRoute allowedRole="teacher"><TeacherNotifications /></ProtectedRoute>} />
        <Route path="/teacher/profile"       element={<ProtectedRoute allowedRole="teacher"><TeacherProfile /></ProtectedRoute>} />

        {/* ── Student routes ── */}
        <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/performance" element={<ProtectedRoute allowedRole="student"><StudentPerformance /></ProtectedRoute>} />
        <Route path="/student/subjects"    element={<ProtectedRoute allowedRole="student"><StudentSubjects /></ProtectedRoute>} />
        <Route path="/student/insights"    element={<ProtectedRoute allowedRole="student"><StudentInsights /></ProtectedRoute>} />
        <Route path="/student/chatbot"     element={<ProtectedRoute allowedRole="student"><StudentChatbot /></ProtectedRoute>} />
        <Route path="/student/profile"     element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />

        {/* ── Admin routes ── */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/departments" element={<ProtectedRoute allowedRole="admin"><AdminDepartments /></ProtectedRoute>} />
        <Route path="/admin/students"    element={<ProtectedRoute allowedRole="admin"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/teachers"    element={<ProtectedRoute allowedRole="admin"><AdminTeachers /></ProtectedRoute>} />
        <Route path="/admin/analytics"   element={<ProtectedRoute allowedRole="admin"><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/insights"    element={<ProtectedRoute allowedRole="admin"><AdminInsights /></ProtectedRoute>} />
        <Route path="/admin/reports"     element={<ProtectedRoute allowedRole="admin"><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/activity"    element={<ProtectedRoute allowedRole="admin"><AdminActivity /></ProtectedRoute>} />
        <Route path="/admin/chatbot"     element={<ProtectedRoute allowedRole="admin"><AdminChatbot /></ProtectedRoute>} />
        <Route path="/admin/profile"     element={<ProtectedRoute allowedRole="admin"><AdminProfile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
