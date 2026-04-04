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
  // State for mobile sidebar visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menu items with icons and labels
  const menuItems = [
    { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
    { id: 2, label: 'Attendance', icon: CalendarCheck, path: '/employee/attendance' },
    { id: 3, label: 'Leave Management', icon: CalendarCheck, path: '/employee/leave' },

    { id: 4, label: 'Payroll / Salary', icon: CreditCard, path: '/employee/payroll' },
    { id: 5, label: 'Settings', icon: Settings, path: '/employee/settings' },
  ];

  // Handle menu click
  const handleMenuItemClick = (label, path) => {
    setActiveItem(label);
    // Close mobile menu after click
    setIsMobileMenuOpen(false);
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
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Profile Card */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <UserCircle className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">John Doe</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">EMP-12345</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
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
          <div className="px-5 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
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
                          ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon size={20} className="shrink-0" />
                      <span className="ml-3 text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="ml-3 text-sm font-medium">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
            >
              <LogOut size={20} />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeSidebar;