import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, Eye, EyeOff, Bell } from "lucide-react";
import adminEmployeeService from "../../../services/adminEmployeeService";
import adminNotificationService from "../../../services/adminNotificationService";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
    employeeId: "",
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
    password: "",
    systemRole: "Employee",
  });
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdEmployeeCredentials, setCreatedEmployeeCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminEmployeeService.getAllEmployees();
      
      console.log('Raw Response:', response);
      
      // Service returns response.data which has { success, message, data: { count, employees } }
      // So we need to access response.data.employees
      const employeesData = response?.data?.employees || response?.employees || [];
      
      console.log('Employees Data:', employeesData);
      console.log('Employees Data Length:', employeesData.length);
      
      if (employeesData && employeesData.length > 0) {
        // Transform API response to match UI structure
        const transformedEmployees = employeesData.map(emp => ({
          id: emp._id,
          name: emp.name || 'Unknown',
          role: emp.position || 'N/A',
          department: emp.department || 'N/A',
          photo: emp.photo || null,
          plainPassword: emp.plainPassword || '', // Store plain password from backend
          initials: (emp.name || 'U')
            .split(' ')
            .map(n => n.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2),
          deleted: emp.isActive === false,
          email: emp.email || '',
          phone: emp.phone || '',
          joinDate: emp.dateOfJoining || '', // Backend returns dateOfJoining
          gender: emp.gender || '',
          basicSalary: emp.salary || 0, // Backend returns salary
          allowances: emp.allowances || 0,
          deductions: emp.deductions || 0,
          bio: emp.bio || '',
          employeeId: emp.employeeId || '',
        }));
        console.log('Transformed Employees:', transformedEmployees);
        setEmployees(transformedEmployees);
      } else {
        console.log('No employees found in response');
        setEmployees([]);
      }
    } catch (err) {
      const errorMsg = err?.message || err?.data?.message || 'Failed to load employees';
      console.error('Error loading employees:', err);
      setError(errorMsg);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate unique Employee ID - ensure no duplicates
  const generateUniqueEmployeeId = (existingEmployees) => {
    let newId;
    let isUnique = false;
    
    // Keep generating until we find a unique ID
    while (!isUnique) {
      const randomDigits = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      newId = `EMP${randomDigits}`;
      
      // Check if this ID already exists
      isUnique = !existingEmployees.some(emp => emp.employeeId === newId);
    }
    
    return newId;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 800;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setPhoto(reader.result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(compressedDataUrl);
      };

      img.onerror = () => {
        setPhoto(reader.result);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
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

  const handleAddEmployee = async () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.department || !formData.position.trim()) {
      alert('Please fill in all required fields: First Name, Last Name, Department, and Position');
      return;
    }

    // Validate email if provided
    if (formData.workEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.workEmail)) {
        alert('Please enter a valid email address');
        return;
      }
    } else {
      alert('Please enter work email address');
      return;
    }

    if (modalMode === 'add') {
      if (!formData.password || formData.password.trim().length < 6) {
        alert('Please set a password with at least 6 characters');
        return;
      }
    }

    try {
      const employeeData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.workEmail,
        phone: formData.phoneNumber,
        position: formData.position,
        department: formData.department,
        dateOfJoining: formData.joinDate || new Date(),
        salary: formData.basicSalary || 0,
        allowances: formData.allowances || 0,
        deductions: formData.deductions || 0,
        gender: formData.gender || '',
        bio: formData.bio || '',
        photo: photo, // Include photo (base64)
        password: modalMode === 'add'
          ? formData.password
          : (formData.password && formData.password.trim() ? formData.password : undefined),
        employeeId: modalMode === 'add' ? formData.employeeId : undefined,
      };

      if (modalMode === 'add') {
        // Add new employee
        const response = await adminEmployeeService.createEmployee(employeeData);
        if (response) {
          console.log('Employee created successfully:', response);
          
          // Close modal first
          setShowAddModal(false);
          setModalMode('add');
          setFormData({
            firstName: "",
            lastName: "",
            employeeId: "",
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
            password: "",
            systemRole: "Employee",
          });
          setPhoto(null);
          setSelectedEmployeeId(null);
          
          // Show success alert
          alert(`✅ Employee created successfully!\n\nName: ${employeeData.name}\nEmployee ID: ${employeeData.employeeId}\nEmail: ${formData.workEmail}`);
          
          // Reload employees list immediately (no timeout)
          console.log('Reloading employees...');
          await loadEmployees();
          console.log('Employees reloaded');
        }
      } else if (modalMode === 'edit' && selectedEmployeeId) {
        // Update existing employee (don't send password unless changed)
        await adminEmployeeService.updateEmployee(selectedEmployeeId, employeeData);
        alert('Employee updated successfully!');
        await loadEmployees();
        setShowAddModal(false);
        setModalMode('add');
        setFormData({
          firstName: "",
          lastName: "",
          employeeId: "",
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
          password: "",
          password: "",
          systemRole: "Employee",
        });
        setPhoto(null);
        setSelectedEmployeeId(null);
      }
      return; // Don't reset form yet for 'add' mode
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to save employee';
      alert(`Error: ${errorMsg}`);
      console.error('Error saving employee:', err);
    }
  };

  const handleEditEmployee = async (emp) => {
    setModalMode('edit');
    setShowPassword(false);
    setSelectedEmployeeId(emp.id);
    
    try {
      // Fetch full employee data including password
      const fullEmployee = await adminEmployeeService.getEmployeeById(emp.id);
      const employeeData = fullEmployee.data || fullEmployee;
      
      const nameParts = employeeData.name.split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        employeeId: employeeData.employeeId || "",
        phoneNumber: employeeData.phone || "",
        joinDate: employeeData.dateOfJoining ? new Date(employeeData.dateOfJoining).toISOString().split('T')[0] : "",
        gender: employeeData.gender || "",
        bio: employeeData.bio || "",
        department: employeeData.department || "",
        position: employeeData.position || "",
        basicSalary: employeeData.salary || "",
        allowances: employeeData.allowances || "",
        deductions: employeeData.deductions || "",
        workEmail: employeeData.email || "",
        password: employeeData.plainPassword || "", // Use plainPassword from backend
        systemRole: "Employee",
      });
      setPhoto(employeeData.photo || null);
    } catch (err) {
      console.error('Error fetching employee details:', err);
      alert('Failed to load employee details');
    }
    
    setShowAddModal(true);
  };

  const handleViewDetails = async (emp) => {
    setModalMode('view');
    setShowPassword(false);
    setSelectedEmployeeId(emp.id);
    
    try {
      // Fetch full employee data including password
      const fullEmployee = await adminEmployeeService.getEmployeeById(emp.id);
      const employeeData = fullEmployee.data || fullEmployee;
      
      const nameParts = employeeData.name.split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        employeeId: employeeData.employeeId || "",
        phoneNumber: employeeData.phone || "",
        joinDate: employeeData.dateOfJoining ? new Date(employeeData.dateOfJoining).toISOString().split('T')[0] : "",
        gender: employeeData.gender || "",
        bio: employeeData.bio || "",
        department: employeeData.department || "",
        position: employeeData.position || "",
        basicSalary: employeeData.salary || "",
        allowances: employeeData.allowances || "",
        deductions: employeeData.deductions || "",
        workEmail: employeeData.email || "",
        password: employeeData.plainPassword || "", // Use plainPassword from backend
        systemRole: "Employee",
      });
      setPhoto(employeeData.photo || null);
    } catch (err) {
      console.error('Error fetching employee details:', err);
      alert('Failed to load employee details');
    }
    
    setShowAddModal(true);
  };

  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminEmployeeService.deleteEmployee(employeeToDelete.id);
      alert('Employee deleted successfully!');
      await loadEmployees();
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete employee';
      alert(`Error: ${errorMsg}`);
      console.error('Error deleting employee:', err);
    }
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

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      await adminNotificationService.sendNotification({
        employeeId: notificationEmployee.id,
        title: 'Message from Admin',
        message: notificationMessage.trim(),
      });

      alert(`Notification sent to ${notificationEmployee.name}!`);
      setShowNotificationModal(false);
      setNotificationEmployee(null);
      setNotificationMessage("");
    } catch (err) {
      const errorMsg = err?.message || err?.data?.message || 'Failed to send notification';
      alert(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-7 py-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading employees...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadEmployees}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only Show When Loaded */}
      {!isLoading && (
      <div>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your team members</p>
        </div>

        <button 
          onClick={() => {
            setShowAddModal(true);
            setModalMode('add');
            setShowPassword(false);
            // Generate unique Employee ID - check against existing employees
            const uniqueId = generateUniqueEmployeeId(employees);
            setFormData(prev => ({
              ...prev,
              employeeId: uniqueId,
              password: ""
            }));
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm">
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 flex-1 h-11 hover:border-indigo-400 hover:bg-gray-50 transition min-w-0">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search employees..."
              className="ml-3 outline-none w-full text-sm bg-transparent"
            />
          </div>

          <select className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-w-max">
            <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {employees.filter(emp => !emp.deleted).length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No employees found. Start by adding a new employee.</p>
          </div>
        ) : (
          employees.filter(emp => !emp.deleted).map((emp, index) => (
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
                {emp.photo ? (
                  <img 
                    src={emp.photo} 
                    alt={emp.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-black/40 text-4xl font-bold">
                    {emp.initials}
                  </div>
                )}
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
        ))
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-6 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' && 'Add New Employee'}
                  {modalMode === 'edit' && 'Edit Employee'}
                  {modalMode === 'view' && 'View Employee Details'}
                </h2>
                <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                  {modalMode === 'add' && 'Create a user account and employee profile'}
                  {modalMode === 'edit' && 'Update employee information'}
                  {modalMode === 'view' && 'Employee information details'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setModalMode('add');
                  setShowPassword(false);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    employeeId: "",
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
                    password: "",
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
            <div className="px-6 py-6 space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              
              {/* Upload Photo Section */}
              <div className="text-center">
                <div className="inline-flex flex-col items-center">
                  <label htmlFor="photo-upload" className={modalMode === 'view' ? 'cursor-default' : 'cursor-pointer'}>
                    <div className={`w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center transition ${modalMode === 'view' ? 'bg-gray-50' : 'hover:bg-gray-200'}`}>
                      {photo ? (
                        <img src={photo} alt="Preview" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl text-gray-400">+</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2 hover:text-gray-700 transition">
                      {modalMode === 'view' ? 'Employee Photo' : photo ? 'Change Photo' : 'Upload Photo'}
                    </p>
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
              </div>

              {/* Personal Information Section */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

                  {/* Employee ID - Auto Generated */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID 
                      <span className="text-xs text-green-600 ml-1 font-normal">(Auto Generated)</span>
                    </label>
                    <input 
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      disabled={true}
                      className="w-full px-4 py-2.5 border border-green-300 bg-green-50 rounded-lg text-sm font-mono text-gray-600 cursor-not-allowed disabled:opacity-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">🔒 Unique ID generated automatically</p>
                  </div>

                  {/* Phone & Join Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <p className="text-xs text-gray-500 mb-2">
                        {modalMode === 'view' ? 'Click eye icon to reveal password' : modalMode === 'edit' ? 'Leave empty to keep current password' : 'Set password manually (min 6 characters)'}
                      </p>
                      <div className="relative flex items-center">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password || ''}
                          onChange={handleInputChange}
                          disabled={modalMode === 'view'}
                          placeholder={modalMode === 'add' ? 'Set password (min 6 chars)' : 'Enter new password (optional)'}
                          className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-gray-600 hover:text-gray-900 transition"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
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
              <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 px-4 md:px-8 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setModalMode('add');
                    setShowPassword(false);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      employeeId: "",
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
                      password: "",
                      systemRole: "Employee",
                    });
                    setPhoto(null);
                    setSelectedEmployeeId(null);
                  }}
                  className="w-full md:w-auto px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition rounded-lg"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button 
                    onClick={handleAddEmployee}
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
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
      )}
    </div>
  );
}