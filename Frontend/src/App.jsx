import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Employee Components
import EmployeeLogin from './Components/Employee/Pages/Login'
import EmployeeDashboard from './Components/Employee/Pages/Dashboard'
import Profile from './Components/Employee/Pages/Profile'
import Attendance from './Components/Employee/Pages/Attendance'
import Leave from './Components/Employee/Pages/Leave'
import Payroll from './Components/Employee/Pages/Payroll'
import Tasks from './Components/Employee/Pages/Tasks'
import Projects from './Components/Employee/Pages/Projects'
import Documents from './Components/Employee/Pages/Documents'
import Notifications from './Components/Employee/Pages/Notifications'
import Support from './Components/Employee/Pages/Support'
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
          <Route path="profile" element={<Profile />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="projects" element={<Projects />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Legacy routes for backward compatibility - wrapped with EmployeeLayout */}
        <Route path="/login" element={<EmployeeLogin />} />
        <Route element={<EmployeeLayout />}>
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
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
