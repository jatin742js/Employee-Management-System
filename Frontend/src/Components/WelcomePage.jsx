import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleAdminPortal = () => {
    navigate('/admin/login');
  };

  const handleEmployeePortal = () => {
    navigate('/employee/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark Blue Background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex-col items-start justify-center px-12 py-16">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Employee<br />Management System
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
          </p>
        </div>
      </div>

      {/* Right Side - White Background with Buttons */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center px-6 sm:px-12 py-16">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h2>
          
          {/* Description */}
          <p className="text-gray-500 text-center text-lg mb-12">
            Select your portal to securely access the system.
          </p>

          {/* Admin Portal Button */}
          <button
            onClick={handleAdminPortal}
            className="w-full mb-6 px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-300 ease-in-out flex items-center justify-between group"
          >
            <span className="text-lg font-semibold text-gray-900 group-hover:text-white">
              Admin Portal
            </span>
            <svg 
              className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Employee Portal Button */}
          <button
            onClick={handleEmployeePortal}
            className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all duration-300 ease-in-out flex items-center justify-between group"
          >
            <span className="text-lg font-semibold text-gray-900 group-hover:text-white">
              Employee Portal
            </span>
            <svg 
              className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          
        </div>
      </div>

      {/* Mobile Header - visible only on small screens */}
      <div className="md:hidden absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 px-6 py-6">
        <h1 className="text-2xl font-bold text-white">
          Employee Management System
        </h1>
        <p className="text-gray-300 text-sm mt-2">
          Streamline your workforce operations
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
