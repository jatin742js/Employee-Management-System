import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Save,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import employeeAuthService from '../../../services/employeeAuthService';
import { useSocket } from '../../../context/SocketContext';

export default function EmployeeSettings() {
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const { socket } = useSocket();
  const [employeeData, setEmployeeData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    organization: '',
    position: '',
  });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile form state - only editable fields
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAuthService.getEmployeeProfile();
      const data = response.data || response;
      
      if (data) {
        const profileData = {
          fullName: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          employeeId: data.employeeId || '',
          department: data.department || '',
          organization: data.organization || '',
          position: data.position || '',
        };
        
        setEmployeeData(profileData);
        setProfile({
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
        });
      }
      setError('');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen to real-time profile updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('profile:updated', (data) => {
      console.log('Profile updated:', data);
      loadProfile(); // Refresh profile data
    });

    return () => {
      socket.off('profile:updated');
    };
  }, [socket]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await employeeAuthService.updateEmployeeProfile({
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange_Save = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordForm.currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password' });
      return;
    }
    if (!passwordForm.newPassword) {
      setMessage({ type: 'error', text: 'Please enter a new password' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setSaving(true);
      await employeeAuthService.changeEmployeePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'profile') {
      return (
          <form onSubmit={handleProfileSave} className="space-y-6">
            {/* Alert section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6">
              <p className="text-xs sm:text-sm text-blue-700">
                <span className="font-semibold">Note:</span> Below you can edit your essential personal information. Your position, department, and organization are managed by your administrator and cannot be changed from here.
              </p>
            </div>

            {/* Editable Fields Section */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span> Personal Information (Editable)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Admin-Controlled Fields Section */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span> Company Information (Admin-Controlled)
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={employeeData.department}
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed disabled:opacity-75"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">⚠️ Contact admin to change</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Position
                    </label>
                    <input
                      type="text"
                      value={employeeData.position}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed disabled:opacity-75"
                    />
                    <p className="text-xs text-gray-500 mt-1">⚠️ Contact admin to change</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={employeeData.employeeId}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed disabled:opacity-75"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Organization
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={employeeData.organization}
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed disabled:opacity-75"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm sm:text-base rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-70"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
      );
    } else if (activeTab === 'password') {
      return (
        <form onSubmit={handlePasswordChange_Save} className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4 mb-6">
            <p className="text-xs sm:text-sm text-amber-700">
              <span className="font-semibold">Tip:</span> Choose a strong password with a mix of uppercase, lowercase, numbers, and special characters for better security.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter a new password (min 6 characters)"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {saving ? 'Updating...' : (
                <>
                  <Lock className="h-4 w-4" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadProfile}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {employeeData.organization} · {employeeData.department} · {employeeData.position}
          </p>
        </div>

        {/* Bento-style card */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-md hover:shadow-lg overflow-hidden border border-gray-200 transition-all duration-200">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-4 sm:px-6 py-4 sm:py-5 font-medium text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === 'profile'
                  ? 'text-teal-600 border-b-teal-600 bg-teal-50/50'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 px-4 sm:px-6 py-4 sm:py-5 font-medium text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === 'password'
                  ? 'text-teal-600 border-b-teal-600 bg-teal-50/50'
                  : 'text-gray-600 border-b-transparent hover:text-gray-900'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Success/Error Message */}
            {message.text && (
              <div className={`mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-6 text-gray-500 dark:text-gray-400 text-xs">
          © 2025 Employee Management System · {employeeData.organization}
        </div> */}
      </div>
      )}
    </div>
  );
}