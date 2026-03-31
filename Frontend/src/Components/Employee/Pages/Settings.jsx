import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Save,
} from 'lucide-react';

// Mock employee data (would come from context/store)
const employeeData = {
  fullName: 'Olivia Chen',
  email: 'olivia.chen@techcorp.com',
  phone: '+1 (555) 123-4567',
  employeeId: 'E-10245',
  department: 'Product Design',
  organization: 'TechCorp Inc.',
  position: 'Senior Product Designer',
};

export default function EmployeeSettings() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state - only editable fields
  const [profile, setProfile] = useState({
    fullName: employeeData.fullName,
    email: employeeData.email,
    phone: employeeData.phone,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  const renderTabContent = () => {
    return (
          <form onSubmit={handleProfileSave} className="space-y-6">
            {/* Alert section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <span className="font-semibold">Note:</span> Below you can edit your essential personal information. Your position, department, and organization are managed by your administrator and cannot be changed from here.
              </p>
            </div>

            {/* Editable Fields Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span> Personal Information (Editable)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 mt-5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Admin-Controlled Fields Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span> Company Information (Admin-Controlled)
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={employeeData.department}
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⚠️ Contact admin to change</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Position
                    </label>
                    <input
                      type="text"
                      value={employeeData.position}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⚠️ Contact admin to change</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={employeeData.employeeId}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Organization
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={employeeData.organization}
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cannot be changed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium rounded-lg transition shadow-sm disabled:opacity-70"
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
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-5xl ml-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {employeeData.organization} · {employeeData.department} · {employeeData.position}
          </p>
        </div>

        {/* Bento-style card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Content */}
          <div className="p-6">
            {/* Success/Error Message */}
            {message.text && (
              <div className={`mb-6 p-3 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
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
    </div>
  );
}