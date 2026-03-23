import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';

const EmployeeLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
