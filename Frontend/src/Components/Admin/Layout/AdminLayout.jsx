import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Common/AdminSidebar';

const AdminLayout = () => {
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
