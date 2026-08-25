import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Features from "./pages/Features";

// Dashboards
import StudentDashboard from "./pages/studentpages/StudentDashboard";
import EmployeeDashboard from "./pages/employeepages/EmployeeDashboard";
import AdminDashboard from "./pages/adminpages/AdminDashboard";

// Auth & Stores
import ProtectedRoutes from "./components/common/ProtectedRoutes";

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/features" element={<Features />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["Admin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["Student"]} />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/student-dashboard" replace />} />

      {/* Employee Protected Routes */}
      <Route element={<ProtectedRoutes allowedRoles={["Employee"]} />}>
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      </Route>

      {/* Fallback - MUST ALWAYS BE AT THE VERY BOTTOM */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
