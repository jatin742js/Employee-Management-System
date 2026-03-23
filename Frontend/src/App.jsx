import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Components/Employee/Pages/Login'
import Dashboard from './Components/Employee/Pages/Dashboard'
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<EmployeeLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
