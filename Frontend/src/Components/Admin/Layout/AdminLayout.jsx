import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Common/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full md:w-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
