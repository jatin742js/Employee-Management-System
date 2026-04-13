import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, X, Eye, Bell } from "lucide-react";

const initialEmployees = [
  {
    id: 1,
    name: "Avinash Kr",
    role: "Marketing Manager",
    department: "Marketing",
    initials: "AK",
    deleted: false,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Sr Developer",
    department: "Engineering",
    initials: "JD",
    deleted: false,
  },
  {
    id: 3,
    name: "Avinash kr",
    role: "Sr Developer",
    department: "Engineering",
    initials: "Ak",
    deleted: true,
  },
];

export default function EmployeePage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [photo, setPhoto] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationEmployee, setNotificationEmployee] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    joinDate: "",
    gender: "",
    bio: "",
    department: "",
    position: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    workEmail: "",
    systemRole: "Employee",
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    const phoneValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData(prev => ({
      ...prev,
      phoneNumber: phoneValue
    }));
  };

  const handleAddEmployee = () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.department || !formData.position.trim()) {
      alert('Please fill in all required fields: First Name, Last Name, Department, and Position');
      return;
    }

    if (modalMode === 'add') {
      // Add new employee
      const newId = Math.max(...employees.map(e => e.id || 0), 0) + 1;
      const newEmployee = {
        id: newId,
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.position,
        department: formData.department,
        initials: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase(),
        deleted: false,
      };
      setEmployees([...employees, newEmployee]);
      alert('Employee added successfully!');
    } else if (modalMode === 'edit' && selectedEmployeeId) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployeeId
          ? {
              ...emp,
              name: `${formData.firstName} ${formData.lastName}`,
              role: formData.position,
              department: formData.department,
              initials: `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase(),
            }
          : emp
      ));
      alert('Employee updated successfully!');
    }
    
    setShowAddModal(false);
    setModalMode('add');
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      joinDate: "",
      gender: "",
      bio: "",
      department: "",
      position: "",
      basicSalary: "",
      allowances: "",
      deductions: "",
      workEmail: "",
      systemRole: "Employee",
    });
    setPhoto(null);
    setSelectedEmployeeId(null);
  };

  const handleEditEmployee = (emp) => {
    setModalMode('edit');
    setSelectedEmployeeId(emp.id);
    const [firstName, lastName] = emp.name.split(' ');
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: "",
      joinDate: "",
      gender: "",
      bio: "",
      department: emp.department,
      position: emp.role,
      basicSalary: "",
      allowances: "",
      deductions: "",
      workEmail: "",
      systemRole: "Employee",
    });
    setShowAddModal(true);
  };

  const handleViewDetails = (emp) => {
    setModalMode('view');
    setSelectedEmployeeId(emp.id);
    const [firstName, lastName] = emp.name.split(' ');
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: "",
      joinDate: "",
      gender: "",
      bio: "",
      department: emp.department,
      position: emp.role,
      basicSalary: "",
      allowances: "",
      deductions: "",
      workEmail: "",
      systemRole: "Employee",
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    // Remove the employee from the list
    setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
    setShowDeleteConfirm(false);
    setEmployeeToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setEmployeeToDelete(null);
  };

  const handleNotificationClick = (emp) => {
    setNotificationEmployee(emp);
    setNotificationMessage("");
    setShowNotificationModal(true);
  };

  const handleSendNotification = () => {
    if (!notificationMessage.trim()) {
      alert('Please enter a message');
      return;
    }
    console.log(`Notification sent to ${notificationEmployee.name}: ${notificationMessage}`);
    alert(`Notification sent to ${notificationEmployee.name}!`);
    setShowNotificationModal(false);
    setNotificationEmployee(null);
    setNotificationMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-7 py-6">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">Manage your team members</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm">
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 flex-1 h-11 hover:border-indigo-400 hover:bg-gray-50 transition">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="ml-3 outline-none w-full text-sm bg-transparent"
            />
          </div>

          <select className="border border-gray-300 rounded-lg px-4 py-2.5 w-44 text-sm font-medium text-gray-700 bg-white hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
            <option>All Departments</option>
            <option>Marketing</option>
            <option>Engineering</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {employees.map((emp, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Top Card Section - Very Light Background */}
            <div className="bg-gray-50 px-5 py-6 relative">
              
              {/* Department & Deleted Badge on Left */}
              <div className="flex gap-2 items-center mb-8 min-h-6">
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold">
                  {emp.department}
                </span>

              
              </div>

              {/* Action Icons - Top Right */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => handleEditEmployee(emp)} className="p-1.5 bg-white rounded-md hover:bg-gray-100 transition text-gray-600 hover:text-gray-900">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDeleteClick(emp)} className="p-1.5 bg-white rounded-md hover:bg-gray-100 transition text-gray-600 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Avatar - Centered and Large */}
              <div className="flex justify-center mb-4">
                <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-black/40 text-4xl font-bold">
                  {emp.initials}
                </div>
              </div>
            </div>

            {/* Bottom Section - Employee Info */}
            <div className="px-5 py-4 bg-white border-t border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {emp.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-0.5">{emp.role}</p>
                </div>
                
                {/* View Details and Notifications Options - Right Side */}
                <div className="flex flex-col gap-2 text-right">
                  <button onClick={() => handleViewDetails(emp)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition inline-flex items-center justify-end gap-1">
                    <Eye size={14} />
                    View Details
                  </button>
                  <button onClick={() => handleNotificationClick(emp)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition inline-flex items-center justify-end gap-1">
                    <Bell size={14} />
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-8 py-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' && 'Add New Employee'}
                  {modalMode === 'edit' && 'Edit Employee'}
                  {modalMode === 'view' && 'View Employee Details'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {modalMode === 'add' && 'Create a user account and employee profile'}
                  {modalMode === 'edit' && 'Update employee information'}
                  {modalMode === 'view' && 'Employee information details'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setModalMode('add');
                  setFormData({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    joinDate: "",
                    gender: "",
                    bio: "",
                    department: "",
                    position: "",
                    basicSalary: "",
                    allowances: "",
                    deductions: "",
                    workEmail: "",
                    systemRole: "Employee",
                  });
                  setPhoto(null);
                  setSelectedEmployeeId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 py-6 space-y-8">
              
              {/* Upload Photo Section */}
              <div className="text-center">
                <div className="inline-flex">
                  <label htmlFor="photo-upload" className={modalMode === 'view' ? 'cursor-default' : 'cursor-pointer'}>
                    <div className={`w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center transition ${modalMode === 'view' ? 'bg-gray-50' : 'hover:bg-gray-200'}`}>
                      {photo ? (
                        <img src={photo} alt="Preview" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl text-gray-400">+</span>
                      )}
                    </div>
                    <input 
                      id="photo-upload"
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload}
                      disabled={modalMode === 'view'}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-600 mt-2">{modalMode === 'view' ? 'Employee Photo' : 'Upload Photo'}</p>
              </div>

              {/* Personal Information Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {/* First & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        placeholder="Enter first name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        placeholder="Enter last name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>

                  {/* Phone & Join Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handlePhoneNumberChange}
                        disabled={modalMode === 'view'}
                        placeholder="Enter 10 digit number"
                        maxLength="10"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                      <input 
                        type="date"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Optional)</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      placeholder="Brief description..."
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Employment Details</h3>
                <div className="space-y-4">
                  {/* Department & Position */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select 
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      >
                        <option value="">Select Department</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input 
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        placeholder="Enter position"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>

                  {/* Basic Salary & Allowances */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
                      <input 
                        type="number"
                        name="basicSalary"
                        value={formData.basicSalary}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        placeholder="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Allowances</label>
                      <input 
                        type="number"
                        name="allowances"
                        value={formData.allowances}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        placeholder="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deductions</label>
                    <input 
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      placeholder="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                    />
                  </div>
                </div>
              </div>

              {/* Account Setup Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Account Setup</h3>
                <div className="space-y-4">
                  {/* Work Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                    <input 
                      type="email"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      placeholder="employee@company.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                    />
                  </div>

                  {/* Password & System Role */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input 
                        type="password"
                        placeholder="Enter password"
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">System Role</label>
                      <select 
                        name="systemRole"
                        value={formData.systemRole}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setModalMode('add');
                    setFormData({
                      firstName: "",
                      lastName: "",
                      phoneNumber: "",
                      joinDate: "",
                      gender: "",
                      bio: "",
                      department: "",
                      position: "",
                      basicSalary: "",
                      allowances: "",
                      deductions: "",
                      workEmail: "",
                      systemRole: "Employee",
                    });
                    setPhoto(null);
                    setSelectedEmployeeId(null);
                  }}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition rounded-lg"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button 
                    onClick={handleAddEmployee}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
                  >
                    {modalMode === 'add' ? 'Add Employee' : 'Update Employee'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && employeeToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Delete Employee</h2>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <span className="font-semibold">{employeeToDelete.name}</span>?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showNotificationModal && notificationEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Send Notification</h2>
              <p className="text-sm text-gray-600 mt-1">Send a message to {notificationEmployee.name}</p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Message</label>
              <textarea
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your notification message..."
                rows="5"
                maxLength="500"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
              />
              <p className="text-xs text-gray-600 mt-2">{notificationMessage.length}/500 characters</p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationEmployee(null);
                  setNotificationMessage("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}