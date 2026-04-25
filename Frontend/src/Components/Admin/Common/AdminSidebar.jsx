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
import adminAuthService from '../../../services/adminAuthService';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for active menu item
  const [activeItem, setActiveItem] = useState('Dashboard');
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State for profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [adminInfo, setAdminInfo] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adminUser') || '{}');
      return {
        name: stored?.name || 'Admin User',
        email: stored?.email || 'admin@company.com',
        organization: stored?.organization || 'Organization',
        role: stored?.role || 'Administrator',
        department: stored?.department || 'Administration',
      };
    } catch {
      return {
        name: 'Admin User',
        email: 'admin@company.com',
        organization: 'Organization',
        role: 'Administrator',
        department: 'Administration',
      };
    }
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (stored && Object.keys(stored).length) {
        setAdminInfo({
          name: stored.name || 'Admin User',
          email: stored.email || 'admin@company.com',
          organization: stored.organization || 'Organization',
          role: stored.role || 'Administrator',
          department: stored.department || 'Administration',
        });
      }
    } catch {
      // Ignore localStorage parsing issues
    }
  }, []);

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

  // Menu items for admin (core items only)
  const menuItems = [
    { id: 1, label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', badge: false },
    { id: 2, label: 'Employees', icon: Users, path: '/admin/employees', badge: false },
    { id: 3, label: 'Attendance', icon: CalendarCheck, path: '/admin/attendance', badge: false },
    { id: 4, label: 'Leave Management', icon: CalendarPlus, path: '/admin/leave-management', badge: false },
    { id: 5, label: 'Payroll', icon: CreditCard, path: '/admin/payroll', badge: false },
  
    { id: 6, label: 'Settings', icon: Settings, path: '/admin/settings', badge: false },
  ];

  // Mobile bottom nav items
  const mobileBottomNavItems = [
    { id: 1, label: 'Dashboard', displayLabel: 'Home', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 2, label: 'Attendance', displayLabel: 'Attendance', icon: CalendarCheck, path: '/admin/attendance' },
    { id: 3, label: 'Employees', displayLabel: 'Employee', icon: Users, path: '/admin/employees', elevated: true },
    { id: 4, label: 'Leave Management', displayLabel: 'Leave', icon: CalendarPlus, path: '/admin/leave-management' },
    { id: 5, label: 'Payroll', displayLabel: 'Salary', icon: CreditCard, path: '/admin/payroll' },
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
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear admin session using auth service
      adminAuthService.logoutAdmin();
      // Redirect to admin login
      navigate('/admin/login');
    }
  };

  return (
    <>
      {/* Mobile Top Bar with Profile Dropdown */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 via-violet-600 to-sky-600 shadow-md">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">Admin Workspace</p>
            <span className="block truncate text-sm font-bold text-gray-900 dark:text-white">AdminHub</span>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 hover:text-gray-700 dark:text-gray-400 transition"
            title="Profile"
          >
            <UserCircle size={24} />
          </button>
          
          {/* Mobile Header Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  navigate('/admin/settings');
                  setShowProfileDropdown(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 transition"
              >
                <UserCircle size={18} />
                My Profile
              </button>
              <div className="border-t border-gray-200 dark:border-gray-600"></div>
              <button
                onClick={() => {
                  setShowProfileDropdown(false);
                  handleLogout();
                }}
                className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <ul className="flex justify-around items-center h-20 px-2">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            return (
              <li key={item.id} className="flex-1">
                <button
                  onClick={() => handleMenuItemClick(item.path, item.label)}
                  className={`
                    flex flex-col items-center justify-center w-full px-3 py-2 transition-all duration-200 rounded-lg
                    ${item.elevated 
                      ? `h-16 -mt-6 bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg hover:shadow-xl hover:bg-indigo-700 dark:hover:bg-indigo-600`
                      : `h-20 ${isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`
                    }
                  `}
                >
                  <Icon size={item.elevated ? 28 : 24} className="shrink-0" />
                  <span className={`font-medium mt-1 ${item.elevated ? 'text-xs' : 'text-xs'}`}>{item.displayLabel || item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-linear-to-br from-indigo-50 via-white to-sky-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-4 shadow-sm backdrop-blur-xs">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 via-violet-600 to-sky-600 shadow-md">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Admin Workspace</p>
                <span className="block text-lg font-bold leading-tight text-gray-900 dark:text-white">AdminHub</span>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Control panel for operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile Card */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-4 py-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 via-violet-600 to-sky-600 shadow-md ring-4 ring-indigo-100 dark:ring-gray-700">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 bg-emerald-500"></span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">{adminInfo.name}</h3>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{adminInfo.email}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {adminInfo.role}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    {adminInfo.department}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Briefcase size={12} className="shrink-0 text-gray-400" />
                    <span className="truncate">{adminInfo.organization}</span>
                  </div>
                </div>
              </div>
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
                        : 'text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white  bg-red-600 dark:text-red-400 hover:bg-red-500  dark:hover:bg-red-900/20 rounded-lg transition font-medium"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;