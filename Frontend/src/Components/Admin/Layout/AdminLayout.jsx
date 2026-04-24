import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Common/AdminSidebar';
import { useSocket } from '../../../context/SocketContext';

const AdminLayout = () => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected) {
      // Get admin ID from localStorage
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        try {
          const admin = JSON.parse(adminUser);
          const adminId = admin.id;
          
          // Join admin-specific room
          socket.emit('admin:join', adminId);
          socket.emit('admin:joinDashboard', adminId);
          
          console.log(`Admin ${adminId} joined socket room`);
        } catch (error) {
          console.error('Error parsing admin user:', error);
        }
      }
    }
  }, [socket, isConnected]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className="md:w-64">
        <AdminSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full md:mt-0 mt-16 md:mb-0 mb-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
