import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import AdminLoginPage from "../pages/Login/Admin/LoginPage";
import AdminDashboardPage from "../pages/Dashboard/AdminDashboardPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />}/>
      </Routes>
    </BrowserRouter>
  );
}
