import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import { useSocket } from '../../../context/SocketContext';

const EmployeeLayout = () => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected) {
      // Get employee ID from localStorage
      const employeeUser = localStorage.getItem('employeeUser');
      if (employeeUser) {
        try {
          const employee = JSON.parse(employeeUser);
          const employeeId = employee.id;
          
          // Join employee-specific room
          socket.emit('employee:join', employeeId);
          socket.emit('employee:joinDashboard', employeeId);
          
          console.log(`Employee ${employeeId} joined socket room`);
        } catch (error) {
          console.error('Error parsing employee user:', error);
        }
      }
    }
  }, [socket, isConnected]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className="md:w-64">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full md:mt-0 mt-16 md:mb-0 mb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
