import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import AdminDashboardPage from "../pages/Dashboard/AdminDashboardPage";
import BookingPage from "../pages/Booking/BookingPage";
import UserPage from "../pages/Crm/UserPage";
import ServicePage from "../pages/Crm/ServicePage";
import MasterPage from "../pages/Crm/MasterPage";
import MaterialPage from "../pages/Crm/MaterialPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booking" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />}/>
        <Route path="/booking" element={<BookingPage />}/>
        <Route path="/admin/crm/users" element={<UserPage />} />
        <Route path="/admin/crm/services" element={<ServicePage />} />
        <Route path="/admin/crm/masters" element={<MasterPage />} />
        <Route path="/admin/crm/materials" element={<MaterialPage />} />
      </Routes>
    </BrowserRouter>
  );
}
