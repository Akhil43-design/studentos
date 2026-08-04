import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SyncProvider } from './context/SyncContext';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import GlobalSearchModal from './components/common/GlobalSearchModal';
import WebSearchAssistDrawer from './components/common/WebSearchAssistDrawer';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPinPage from './pages/ForgotPinPage';

import StudentDashboard from './components/dashboards/StudentDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

import NotebooksPage from './pages/NotebooksPage';
import DrawingStudioPage from './pages/DrawingStudioPage';
import GroupChatPage from './pages/GroupChatPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AttendancePage from './pages/AttendancePage';
import ExamsPage from './pages/ExamsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedLayout() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiAssistOpen, setAiAssistOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/splash" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6fafe] dark:bg-[#091426] transition-colors">
      <Navbar
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAiAssist={() => setAiAssistOpen(true)}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            {/* Dashboards */}
            <Route path="dashboard/student" element={<StudentDashboard />} />
            <Route path="dashboard/teacher" element={<TeacherDashboard />} />
            <Route path="dashboard/parent" element={<ParentDashboard />} />
            <Route path="dashboard/admin" element={<AdminDashboard />} />

            {/* Modules */}
            <Route path="notebooks" element={<NotebooksPage />} />
            <Route path="drawing" element={<DrawingStudioPage />} />
            <Route path="chat" element={<GroupChatPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Default Fallback Redirect */}
            <Route
              path="*"
              element={
                <Navigate
                  to={
                    user?.role === 'teacher'
                      ? '/dashboard/teacher'
                      : user?.role === 'parent'
                      ? '/dashboard/parent'
                      : user?.role === 'admin'
                      ? '/dashboard/admin'
                      : '/dashboard/student'
                  }
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <WebSearchAssistDrawer
        isOpen={aiAssistOpen}
        onClose={() => setAiAssistOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SyncProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SplashPage />} />
              <Route path="/splash" element={<SplashPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-pin" element={<ForgotPinPage />} />

              {/* Protected App Routes */}
              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </BrowserRouter>
        </SyncProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
