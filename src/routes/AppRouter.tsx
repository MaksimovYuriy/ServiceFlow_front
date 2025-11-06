import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import AdminLoginPage from "../pages/Login/Admin/LoginPage";
import AdminDashboardPage from "../pages/Dashboard/AdminDashboardPage";
import BookingPage from "../pages/Booking/BookingPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booking" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />}/>
        <Route path="/booking" element={<BookingPage />}/>
      </Routes>
    </BrowserRouter>
  );
}
