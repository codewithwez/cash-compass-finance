// src/components/common/ProtectedRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useStudentStore } from "@/store/useStudentStore";

export default function ProtectedRoutes({ allowedRoles }) {
  const user = useStudentStore((state) => state.user);
  const token = useStudentStore((state) => state.token);

  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && Array.isArray(allowedRoles)) {
    
    const userRole = user.role || "Student"; 

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
