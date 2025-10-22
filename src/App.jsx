import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { RoleProvider } from "./contexts/RoleContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InstrumentSelect from "./pages/InstrumentSelect/InstrumentSelect";
import DanTranh from "./pages/DanTranh/DanTranh";
import SongList from "./pages/DanTranh/ListTranh/SongList";
import BangXepHang from "./pages/DanTranh/Ranking/BangXepHang";
import HoSo from "./pages/DanTranh/Profile/HoSo";
import Subscription from "./pages/Subscription/Subscription";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";

import VoucherManagement from "./pages/Admin/VoucherManagement/VoucherManagement";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement/UserManagement";
import PaymentManagement from "./pages/Admin/PaymentManagement/PaymentManagement";
import NotificationManagement from "./pages/Admin/NotificationManagement/NotificationManagement";
import SubscriptionManagement from "./pages/Admin/SubscriptionManagement/SubscriptionManagement";
import LessonManagement from "./pages/Admin/LessonManagement/LessonManagement";
import "./pages/Admin/AdminPlaceholder/AdminPlaceholder.css";

// Employee components
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard/EmployeeDashboard";
import EmployeeCourses from "./pages/Employee/EmployeeCourses/EmployeeCourses";
import EmployeeUsers from "./pages/Employee/EmployeeUsers/EmployeeUsers";
import EmployeeReports from "./pages/Employee/EmployeeReports/EmployeeReports";
import EmployeeTasks from "./pages/Employee/EmployeeTasks/EmployeeTasks";
import EmployeeTeam from "./pages/Employee/EmployeeTeam/EmployeeTeam";
import EmployeeLayout from "./components/EmployeeLayout/EmployeeLayout";

// Placeholder components for admin
const AdminCourses = () => <div className="dashboard-container"><h1>Quản lý khóa học</h1><p>Chức năng quản lý khóa học đang được phát triển...</p></div>;
const AdminReports = () => <div className="dashboard-container"><h1>Báo cáo</h1><p>Chức năng báo cáo đang được phát triển...</p></div>;
const AdminSettings = () => <div className="dashboard-container"><h1>Cài đặt hệ thống</h1><p>Chức năng cài đặt đang được phát triển...</p></div>;

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RoleProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Customer Routes */}
          <Route path="/home" element={<InstrumentSelect />} />
          <Route path="/dan-tranh" element={<DanTranh />} />
          <Route path="/song-list" element={<SongList />} />
          <Route path="/bangxephang" element={<BangXepHang />} />
          <Route path="/HoSo" element={<ProtectedRoute><HoSo /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><Layout><UserManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute requiredRole="admin"><Layout><PaymentManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><Layout><AdminReports /></Layout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><Layout><AdminSettings /></Layout></ProtectedRoute>} />
          <Route path="/admin/vouchers" element={<ProtectedRoute requiredRole="admin"><Layout><VoucherManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/subscriptions" element={<ProtectedRoute requiredRole="admin"><Layout><SubscriptionManagement /></Layout></ProtectedRoute>} />
        <Route path="/admin/lessons" element={<ProtectedRoute requiredRole="admin"><Layout><LessonManagement /></Layout></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute requiredRole="admin"><Layout><NotificationManagement /></Layout></ProtectedRoute>} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout><EmployeeDashboard /></EmployeeLayout></ProtectedRoute>} />
          <Route path="/employee/courses" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout><EmployeeCourses /></EmployeeLayout></ProtectedRoute>} />
          <Route path="/employee/users" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout><EmployeeUsers /></EmployeeLayout></ProtectedRoute>} />
          <Route path="/employee/reports" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout><EmployeeReports /></EmployeeLayout></ProtectedRoute>} />
          <Route path="/employee/tasks" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout><EmployeeTasks /></EmployeeLayout></ProtectedRoute>} />
          <Route path="/employee/team" element={<ProtectedRoute requiredRole="employee"><EmployeeLayout><EmployeeTeam /></EmployeeLayout></ProtectedRoute>} />
        </Routes>
        </Router>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;