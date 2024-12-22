import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from './components/Layout';
import WorkSchedule from './pages/WorkSchedule';
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Locations from "./pages/Locations"; // استيراد صفحة إدارة المواقع
import LeaveRequests from "./pages/LeaveRequests"; // استيراد صفحة طلبات الاستئذان
import { DataProvider } from "./context/DataContext"; // استيراد DataProvider
import ChangePassword from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // قراءة حالة تسجيل الدخول من localStorage
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    // تحديث حالة تسجيل الدخول في localStorage
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <DataProvider> {/* تغليف التطبيق بـ DataProvider */}
      <Router>
        <Routes>
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
          {/* صفحة تسجيل الدخول */}
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

          {/* الصفحات المحمية */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout><Attendance /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout><Reports /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout><Employees /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout><Notifications /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/locations" element={<Layout><Locations /></Layout>} />
          <Route path="/work-schedule" element={<Layout><WorkSchedule /></Layout>} />

          {/* مسار طلبات الاستئذان */}
          <Route
            path="/leave-requests"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Layout><LeaveRequests /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
