import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarPlus,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Briefcase,
  UserCircle
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for active menu item
  const [activeItem, setActiveItem] = useState('Dashboard');
  // State for mobile sidebar visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for user dropdown (optional)
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  // Menu items for admin (core items only)
  const menuItems = [
    { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', badge: false },
    { id: 2, label: 'Employees', icon: Users, path: '/admin/employees', badge: false },
    { id: 3, label: 'Attendance', icon: CalendarCheck, path: '/admin/attendance', badge: false },
    { id: 4, label: 'Leave Management', icon: CalendarPlus, path: '/admin/leave-management', badge: false },
    { id: 5, label: 'Payroll', icon: CreditCard, path: '/admin/payroll', badge: false },
  
    { id: 6, label: 'Settings', icon: Settings, path: '/admin/settings', badge: false },
  ];

  // Update active item based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item => item.path === currentPath);
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.label);
    }
  }, [location.pathname]);

  // Handle menu click
  const handleMenuItemClick = (path, label) => {
    setActiveItem(label);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear admin session
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminSession');
      // Redirect to admin login
      navigate('/admin/login');
    }
  };

  return (
    <>
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
          {/* Logo */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">AdminHub</span>
            </div>
          </div>

          {/* Admin Profile Card - Simplified */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <UserCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Admin User</h3>
              </div>
            </div>
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
                      onClick={() => handleMenuItemClick(item.path, item.label)}
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
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badgeCount}
                        </span>
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
    </>
  );
};

export default AdminSidebar;