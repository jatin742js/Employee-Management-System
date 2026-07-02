import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'

// Welcome Page
import WelcomePage from './Components/WelcomePage'

// Employee Components
import EmployeeLogin from './Components/Employee/Pages/Login'
import EmployeeDashboard from './Components/Employee/Pages/Dashboard'

import Attendance from './Components/Employee/Pages/Attendance'
import Payroll from './Components/Employee/Pages/Payroll'
import LeaveManagement from './Components/Employee/Pages/LeaveManagement'
import Settings from './Components/Employee/Pages/Settings'
import EmployeeLayout from './Components/Employee/Layout/EmployeeLayout'
import PayslipPrintPage from './Components/Common/PayslipPrintPage'

// Admin Components
import AdminLogin from './Components/Admin/Pages/Login'
import AdminRegister from './Components/Admin/Pages/Register'
import AdminDashboard from './Components/Admin/Pages/Dashboard'
import Employee from './Components/Admin/Pages/Employee'
import AdminAttendance from './Components/Admin/Pages/Attendance'
import AdminLeaveManagement from './Components/Admin/Pages/LeaveManagement'
import AdminPayroll from './Components/Admin/Pages/Payroll'
import AdminSettings from './Components/Admin/Pages/Settings'
import AdminLayout from './Components/Admin/Layout/AdminLayout'

// Protected Route Component for root path
const RootRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const employeeToken = localStorage.getItem('employeeToken');

    if (adminToken) {
      setRedirectPath('/admin/dashboard');
    } else if (employeeToken) {
      setRedirectPath('/employee/dashboard');
    } else {
      setRedirectPath(null);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return <WelcomePage />;
};

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<Employee />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="leave-management" element={<AdminLeaveManagement />} />
            <Route path="payroll" element={<AdminPayroll />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Employee Routes - with layout */}
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route path="dashboard" element={<EmployeeDashboard />} />
           
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave-management" element={<LeaveManagement />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Welcome/Portal Selection Page - with authentication check */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/payslip-print" element={<PayslipPrintPage />} />
          
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SocketProvider>
  )
}

export default App
