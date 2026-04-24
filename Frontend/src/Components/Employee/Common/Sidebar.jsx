import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  CalendarPlus,
  CreditCard,
  CheckSquare,
  FolderKanban,
  FileText,
  Bell,
  LifeBuoy,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  UserCircle,
  Briefcase,
  DollarSign,
  Clock,
  Award,
  FileSignature,
  Shield,
  HelpCircle,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  // State for active menu item
  const [activeItem, setActiveItem] = useState('Dashboard');
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    // Any additional initialization can go here
  }, []);

  // Menu items with icons and labels
  const menuItems = [
    { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
   
    { id: 2, label: 'Attendance', icon: CalendarCheck, path: '/employee/attendance' },
    { id: 3, label: 'Leave Management', icon: CalendarCheck, path: '/employee/leave-management' },
    { id: 4, label: 'Payroll / Salary', icon: CreditCard, path: '/employee/payroll' },
    { id: 5, label: 'Settings', icon: Settings, path: '/employee/settings' },   
  ];

  // Mobile bottom nav items
  const mobileBottomNavItems = [
    { id: 1, label: 'Home', icon: LayoutDashboard, path: '/employee/dashboard' },
    { id: 2, label: 'Leave', icon: CalendarPlus, path: '/employee/leave-management' },
    { id: 3, label: 'Attendance', icon: CalendarCheck, path: '/employee/attendance', elevated: true },
    { id: 4, label: 'Salary', icon: DollarSign, path: '/employee/payroll' },
  ];

  // Handle menu click
  const handleMenuItemClick = (label, path) => {
    setActiveItem(label);
    // Navigate to the respective page
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear employee session
      localStorage.removeItem('employeeUser');
      localStorage.removeItem('employeeToken');
      sessionStorage.removeItem('employeeSession');
      // Redirect to employee login
      navigate('/employee/login');
    }
  };

  // Current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Mobile Top Bar with Profile Dropdown */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-teal-200 dark:border-teal-700 px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">John Doe</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">EMP-12345</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition flex items-center gap-2"
          title="Logout"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-teal-200 dark:border-teal-700 shadow-lg">
        <ul className="flex justify-around items-center h-20 px-2">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            return (
              <li key={item.id} className="flex-1">
                <button
                  onClick={() => handleMenuItemClick(item.label, item.path)}
                  className={`
                    flex flex-col items-center justify-center w-full transition-all duration-200 rounded-lg
                    ${item.elevated 
                      ? `h-16 -mt-6 px-3 py-2 bg-teal-600 dark:bg-teal-500 text-white shadow-lg hover:shadow-xl hover:bg-teal-700 dark:hover:bg-teal-600`
                      : `h-20 ${isActive
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
                      }`
                    }
                  `}
                >
                  <Icon size={item.elevated ? 28 : 24} className="shrink-0" />
                  <span className={`font-medium mt-1 ${item.elevated ? 'text-xs' : 'text-xs'}`}>{item.label}</span>
                </button>
              </li>
            );
          })}
          {/* Profile Button */}
          <li className="flex-1">
            <button
              onClick={() => handleMenuItemClick('Settings', '/employee/settings')}
              className={`
                flex flex-col items-center justify-center w-full h-20 transition-all duration-200 rounded-lg
                ${activeItem === 'Settings'
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
                }
              `}
              title="Profile"
            >
              <UserCircle size={24} className="shrink-0" />
              <span className="text-xs font-medium mt-1">Profile</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-teal-200 dark:border-teal-700">
        {/* Profile Card */}
        <div className="p-5 border-b border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800">   
          <div className="flex items-center space-x-3">
            <div className="relative">
              <UserCircle className="w-12 h-12 text-teal-600 dark:text-teal-400" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">John Doe</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">EMP-12345</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200 rounded-full">
                Employee
              </span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">     
            <div className="flex items-center">
              <Briefcase size={12} className="mr-1" />
              <span>Senior Software Engineer</span>
            </div>
            <div className="flex items-center mt-1">
              <Clock size={12} className="mr-1" />
              <span>Joined: Jan 2023</span>
            </div>
          </div>
        </div>

        {/* Date Display */}
        <div className="px-5 py-2 text-xs text-gray-600 dark:text-gray-400 border-b border-teal-200 dark:border-teal-700">
          {currentDate}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.label, item.path)}
                    className={`
                      flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-teal-200 dark:border-teal-700">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-900/20 rounded-lg transition font-medium"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default EmployeeSidebar;