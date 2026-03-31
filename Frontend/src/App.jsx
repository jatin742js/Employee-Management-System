import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Employee Components
import EmployeeLogin from './Components/Employee/Pages/Login'
import EmployeeDashboard from './Components/Employee/Pages/Dashboard'
import Attendance from './Components/Employee/Pages/Attendance'
import Payroll from './Components/Employee/Pages/Payroll'

import Settings from './Components/Employee/Pages/Settings'
import EmployeeLayout from './Components/Employee/Layout/EmployeeLayout'

// Admin Components
import AdminLogin from './Components/Admin/Pages/Login'
import AdminRegister from './Components/Admin/Pages/Register'
import AdminForgotPassword from './Components/Admin/Pages/ForgotPassword'
import AdminDashboard from './Components/Admin/Pages/Dashboard'
import Employee from './Components/Admin/Pages/Employee'
import AdminAttendance from './Components/Admin/Pages/Attendance'
import AdminLeaveManagement from './Components/Admin/Pages/LeaveManagement'
import AdminPayroll from './Components/Admin/Pages/Payroll'
import AdminSettings from './Components/Admin/Pages/Settings'
import AdminLayout from './Components/Admin/Layout/AdminLayout'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
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
          <Route path="payroll" element={<Payroll />} />
          <Route path="settings" element={<Settings />} />
        </Route>

{/* Default redirect to Admin Login */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
        
        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  )
}

export default App
