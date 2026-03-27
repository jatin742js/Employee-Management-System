import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Users, Database, Save, Mail } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [changes, setChanges] = useState({});

  const tabs = [
    { id: 'general', label: 'General Settings', icon: SettingsIcon },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
  ];

  const handleChange = (key, value) => {
    setChanges({ ...changes, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure system and application settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Company Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Company Name</label>
                        <input
                          type="text"
                          defaultValue="TechCorp Solutions"
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Company Email</label>
                        <input
                          type="email"
                          defaultValue="admin@techcorp.com"
                          onChange={(e) => handleChange('companyEmail', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 000-0000"
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">System Preferences</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Enable dark mode by default</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Enable audit logs</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Maintenance mode</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Role Permissions</h2>
                    <div className="space-y-3">
                      {['Admin', 'Manager', 'Employee'].map((role) => (
                        <div key={role} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">{role}</span>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit Permissions</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">User Restrictions</h2>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">Force Password Change</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Every 90 days</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">Enable Two-Factor Authentication</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400">For all admin accounts</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Protection</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">SSL/TLS Encryption</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Enable IP Whitelisting</span>
                      </label>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">API Keys</h2>
                    <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm text-gray-600 dark:text-gray-400 truncate">sk_live_••••••••••••••••</span>
                        <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Generate New Key</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h2>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">New employee registration</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Leave requests pending approval</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Attendance alerts</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">System maintenance notices</span>
                      </label>
                    </div>
                  </div>

                  <div className="pb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notification Recipients</h2>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="admin@company.com"
                          defaultValue="admin@techcorp.com"
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">Remove</button>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ Add Email</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Database */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Backup Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Backup Frequency</label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span className="text-gray-900 dark:text-white">Automatic backup enabled</span>
                      </label>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Backup Now</button>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Database Status</h2>
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Connection Status:</span>
                        <span className="text-green-600 font-medium">Connected ✓</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Database Size:</span>
                        <span className="text-gray-900 dark:text-white font-medium">2.4 GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Last Backup:</span>
                        <span className="text-gray-900 dark:text-white font-medium">Today at 2:30 AM</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Maintenance</h2>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">Schedule Maintenance</button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
                <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
