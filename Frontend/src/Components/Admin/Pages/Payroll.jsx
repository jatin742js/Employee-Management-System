import React, { useState, useEffect } from 'react';
import { Download, Plus, X, Upload, Eye, Trash2, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminPayrollService from '../../../services/adminPayrollService';
import adminEmployeeService from '../../../services/adminEmployeeService';
import { useSocket } from '../../../context/SocketContext';
import { openPayslipPrintPage } from '../../../utils/payslipPrintUtils';

export default function Payroll() {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeQuery, setEmployeeQuery] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2026');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowances, setAllowances] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
  const [bankAccount, setBankAccount] = useState('');
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showPayslipPreview, setShowPayslipPreview] = useState(false);
  const [previewPayslip, setPreviewPayslip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAllowancesBreakdown, setShowAllowancesBreakdown] = useState(false);
  const [showDeductionsBreakdown, setShowDeductionsBreakdown] = useState(false);
  const [allowancesBreakdown, setAllowancesBreakdown] = useState([]);
  const [deductionsBreakdown, setDeductionsBreakdown] = useState([]);
  const [breakdownName, setBreakdownName] = useState('');
  const [breakdownAmount, setBreakdownAmount] = useState('');
  const [breakdownType, setBreakdownType] = useState('allowances');
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const paymentStatusOptions = ['pending', 'processed', 'paid'];

  const getPayrollPeriod = (monthValue) => {
    if (!monthValue || !monthValue.includes('-')) {
      return { monthName: 'Unknown', yearStr: '' };
    }

    const [yearStr, monthStr] = monthValue.split('-');
    const monthNum = Number(monthStr);

    return {
      monthName: monthNames[monthNum - 1] || 'Unknown',
      yearStr,
    };
  };

  const normalizeStatusValue = (value = '') => {
    const status = value.toLowerCase();
    if (status === 'processing') return 'processed';
    return status;
  };

  const filteredPayslips = payslips.filter((payslip) => {
    const { monthName, yearStr } = getPayrollPeriod(payslip.month);
    const status = normalizeStatusValue(payslip.paymentStatus || 'pending');

    return (
      (filterMonth === 'All' || monthName === filterMonth) &&
      (filterYear === 'All' || yearStr === filterYear) &&
      (filterStatus === 'All' || status === normalizeStatusValue(filterStatus))
    );
  });

  useEffect(() => {
    loadPayrollData();
  }, []);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!socket) return;

    // Listen for new payslip created
    socket.on('payroll:created', (data) => {
      console.log('New payslip created:', data);
      loadPayrollData();
    });

    // Listen for payslip status updated
    socket.on('payroll:statusUpdated', (data) => {
      console.log('Payroll status updated:', data);
      setPayslips((prev) =>
        prev.map((payslip) =>
          payslip._id === data.payslipId
            ? {
                ...payslip,
                paymentStatus: data.newStatus,
                paymentDate: data.paymentDate || payslip.paymentDate,
              }
            : payslip
        )
      );
    });

    socket.on('payroll:deleted', (data) => {
      console.log('Payroll deleted:', data);
      loadPayrollData();
    });

    return () => {
      socket.off('payroll:created');
      socket.off('payroll:statusUpdated');
      socket.off('payroll:deleted');
    };
  }, [socket]);

  const loadPayrollData = async () => {
    try {
      setIsLoading(true);
      const [payrollRes, employeeRes] = await Promise.all([
        adminPayrollService.getAllPayroll(),
        adminEmployeeService.getAllEmployees(),
      ]);

      console.log('Payroll Response:', payrollRes);
      
      // Handle payroll response - check multiple possible structures
      let payrollList = [];
      if (payrollRes?.data?.payroll?.length > 0) {
        payrollList = payrollRes.data.payroll;
        console.log('Using payrollRes.data.payroll:', payrollList);
      } else if (payrollRes?.payroll?.length > 0) {
        payrollList = payrollRes.payroll;
        console.log('Using payrollRes.payroll:', payrollList);
      } else if (payrollRes?.data?.length > 0) {
        payrollList = payrollRes.data;
        console.log('Using payrollRes.data:', payrollList);
      } else if (Array.isArray(payrollRes)) {
        payrollList = payrollRes;
        console.log('Using payrollRes directly:', payrollList);
      }
      
      console.log('Final Payroll List:', payrollList);
      setPayslips(payrollList);
      
      const employeeList = employeeRes?.data?.employees || employeeRes?.employees || [];
      if (employeeList.length > 0) {
        setEmployees(employeeList);
      } else {
        setEmployees([]);
      }
      setError('');
    } catch (err) {
      const errorMsg = err.message || 'Failed to load payroll data';
      setError(errorMsg);
      console.error('Error loading payroll:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (payslip) => {
    try {
      setIsDownloading(true);

      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      openPayslipPrintPage({
        navigate,
        payslip,
        companyInfo: {
          organization: adminUser.organization,
          email: adminUser.email,
         
          address: adminUser.address,
          companyAddress: adminUser.companyAddress,
          addressLine: adminUser.addressLine,
        },
      });
    } catch (error) {
      console.error('Print page error:', error);
      console.error('Error details:', error.message);
      alert(error.message || 'Unable to open payslip page.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeletePayroll = async (payslip) => {
    if (!payslip?._id) return;

    const confirmed = window.confirm(
      `Delete payroll for ${payslip.employee?.name || payslip.name || 'this employee'} (${getPayrollPeriod(payslip.month).monthName} ${getPayrollPeriod(payslip.month).yearStr})?`
    );

    if (!confirmed) return;

    try {
      await adminPayrollService.deletePayroll(payslip._id);
      await loadPayrollData();
    } catch (error) {
      console.error('Delete payroll error:', error);
      alert(error.message || 'Unable to delete payroll.');
    }
  };

  const handleGeneratePayslip = async () => {
    if (selectedEmployee && basicSalary) {
      try {
        // Format: YYYY-MM
        const monthFormatted = `${year}-${month.padStart(2, '0')}`;
        
        // Ensure all values are valid numbers
        const baseSalaryNum = parseFloat(basicSalary) || 0;
        const allowancesNum = parseFloat(allowances) || 0;
        const deductionsNum = parseFloat(deductions) || 0;

        // Validate that baseSalary is greater than 0
        if (baseSalaryNum <= 0) {
          alert('Basic Salary must be greater than 0');
          return;
        }

        const payrollData = {
          employee: selectedEmployee,
          month: monthFormatted,
          baseSalary: baseSalaryNum,
          allowances: allowancesNum,
          deductions: deductionsNum,
          bonus: 0,
          paymentMethod: paymentMethod,
          bankAccount: bankAccount,
          allowancesBreakdown: allowancesBreakdown,
          deductionsBreakdown: deductionsBreakdown,
        };

        const response = await adminPayrollService.createPayroll(payrollData);
        if (response) {
          alert('Payslip generated successfully!');
          setShowModal(false);
          setShowEmployeeDropdown(false);
          
          // Emit socket event for real-time updates
          if (socket) {
            socket.emit('payroll:create', {
              payrollData,
              timestamp: new Date().toISOString(),
            });
          }
          
          await loadPayrollData();
          
          // Reset form
          setSelectedEmployee('');
          setEmployeeQuery('');
          setMonth('1');
          setYear('2026');
          setBasicSalary('');
          setAllowances('0');
          setDeductions('0');
          setPaymentMethod('bank-transfer');
          setBankAccount('');
          setUploadedDoc(null);
          setAllowancesBreakdown([]);
          setDeductionsBreakdown([]);
        }
      } catch (err) {
        alert('Failed to generate payslip: ' + err.message);
      }
    }
  };

  const getFilteredEmployees = () => {
    if (!employeeQuery.trim()) return employees;
    return employees.filter((emp) => {
      const label = `${emp.name} (${emp.position || emp.role || 'N/A'})`;
      return label.toLowerCase().includes(employeeQuery.toLowerCase());
    });
  };

  const handleEmployeeInput = (e) => {
    const value = e.target.value;
    setEmployeeQuery(value);
    setShowEmployeeDropdown(true);
    
    // Check if exact match
    const matchedEmployee = employees.find((emp) => {
      const label = `${emp.name} (${emp.position || emp.role || 'N/A'})`;
      return label === value;
    });

    if (matchedEmployee) {
      setSelectedEmployee(matchedEmployee._id);
      setBasicSalary(matchedEmployee.basicSalary || matchedEmployee.salary || '0');
    } else {
      setSelectedEmployee('');
    }
  };

  const handleSelectEmployee = (emp) => {
    const label = `${emp.name} (${emp.position || emp.role || 'N/A'})`;
    setEmployeeQuery(label);
    setSelectedEmployee(emp._id);
    setBasicSalary(emp.basicSalary || emp.salary || '0');
    setShowEmployeeDropdown(false);
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDoc({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
      });
    }
  };

  const addBreakdownItem = () => {
    if (!breakdownName || !breakdownAmount) {
      alert('Please enter name and amount');
      return;
    }
    
    const newItem = {
      id: Date.now(),
      name: breakdownName,
      amount: parseFloat(breakdownAmount),
    };

    if (breakdownType === 'allowances') {
      const newTotal = allowancesBreakdown.reduce((sum, item) => sum + item.amount, 0) + newItem.amount;
      setAllowancesBreakdown([...allowancesBreakdown, newItem]);
      setAllowances(newTotal.toString());
    } else {
      const newTotal = deductionsBreakdown.reduce((sum, item) => sum + item.amount, 0) + newItem.amount;
      setDeductionsBreakdown([...deductionsBreakdown, newItem]);
      setDeductions(newTotal.toString());
    }
    
    setBreakdownName('');
    setBreakdownAmount('');
  };

  const removeBreakdownItem = (id, type) => {
    if (type === 'allowances') {
      const updated = allowancesBreakdown.filter(item => item.id !== id);
      setAllowancesBreakdown(updated);
      const newTotal = updated.reduce((sum, item) => sum + item.amount, 0);
      setAllowances(newTotal.toString());
    } else {
      const updated = deductionsBreakdown.filter(item => item.id !== id);
      setDeductionsBreakdown(updated);
      const newTotal = updated.reduce((sum, item) => sum + item.amount, 0);
      setDeductions(newTotal.toString());
    }
  };

  const handleStatusChange = async (payslipId, currentStatus, nextStatus) => {
    if (!payslipId || currentStatus === nextStatus) return;

    try {
      setUpdatingStatusId(payslipId);
      const paymentDate = nextStatus === 'paid' ? new Date().toISOString() : null;
      const response = await adminPayrollService.updatePayrollStatus(payslipId, nextStatus, paymentDate);
      const updatedPayroll = response?.data || response;

      setPayslips((prev) =>
        prev.map((payslip) =>
          payslip._id === payslipId
            ? {
                ...payslip,
                paymentStatus: updatedPayroll?.paymentStatus || nextStatus,
                paymentDate: updatedPayroll?.paymentDate || payslip.paymentDate,
              }
            : payslip
        )
      );

      // Emit socket event for real-time status update
      if (socket) {
        socket.emit('payroll:updateStatus', {
          payslipId,
          newStatus: nextStatus,
          paymentDate: updatedPayroll?.paymentDate || null,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      alert(`Failed to update status: ${err.message || 'Unknown error'}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-7 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payslips</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Generate and manage employee payslips</p>
          {/* Real-time Status Indicator */}
          
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isConnected}
          title={!isConnected ? 'Reconnecting...' : 'Generate new payslip'}
        >
          <Plus size={18} />
          Generate Payslip
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading payroll data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadPayrollData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only Show When Loaded */}
      {!isLoading && (
      <>

      {/* Filters Section */}
      <div className="mb-6 p-4 sm:p-5 border border-gray-200 bg-white rounded-lg shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
          Filter Options
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Month</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option>All</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="All or 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Processed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Period</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Basic Salary</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredPayslips.length > 0 ? filteredPayslips.map((payslip) => {
              // Parse month from YYYY-MM format
              const { yearStr, monthName } = getPayrollPeriod(payslip.month);
              const employeeName = payslip.employee?.name || payslip.name || 'Unknown';
              
              return (
              <tr key={payslip._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{employeeName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {monthName} {yearStr}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">₹{payslip.baseSalary?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <select
                    value={payslip.paymentStatus || 'pending'}
                    onChange={(e) => handleStatusChange(payslip._id, payslip.paymentStatus || 'pending', e.target.value)}
                    disabled={updatingStatusId === payslip._id || !isConnected}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {paymentStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setPreviewPayslip(payslip);
                        setShowPayslipPreview(true);
                      }}
                      disabled={isDownloading || !isConnected}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isDownloading ? "Opening page..." : "Open Payslip"}
                    >
                      {isDownloading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                          <span>Opening...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          <span>Open</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePayroll(payslip)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      title="Delete Payslip"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
            }) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No payslips found</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Generate Payslip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Generate Monthly Payslip</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setShowEmployeeDropdown(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Employee */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                <input
                  type="text"
                  value={employeeQuery}
                  onChange={handleEmployeeInput}
                  onFocus={() => setShowEmployeeDropdown(true)}
                  placeholder="Search employee name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm transition duration-150"
                />
                {/* Dropdown List */}
                {showEmployeeDropdown && getFilteredEmployees().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {getFilteredEmployees().map((emp) => (
                      <button
                        key={emp._id}
                        type="button"
                        onClick={() => handleSelectEmployee(emp)}
                        className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{emp.name}</div>
                        
                      </button>
                    ))}
                  </div>
                )}
                {/* No Results */}
                {showEmployeeDropdown && employeeQuery && getFilteredEmployees().length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 text-center text-sm text-gray-600">
                    No employees found
                  </div>
                )}
              </div>

              {/* Month and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                  <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm transition duration-150"
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <input 
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150"
                  />
                </div>
              </div>

              {/* Basic Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary *</label>
                <input 
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150"
                  placeholder="5000"
                  min="0"
                />
              </div>

              {/* Allowances and Deductions - Separate Containers */}
              <div className="grid grid-cols-2 gap-6">
                {/* Allowances Container */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-800">Allowances</label>
                    <button
                      type="button"
                      onClick={() => {
                        setBreakdownType('allowances');
                        setShowAllowancesBreakdown(!showAllowancesBreakdown);
                        if (!showAllowancesBreakdown) {
                          setShowDeductionsBreakdown(false);
                          setBreakdownName('');
                          setBreakdownAmount('');
                        } else {
                          setBreakdownName('');
                          setBreakdownAmount('');
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-bold text-xl transition hover:bg-indigo-50 rounded-full w-8 h-8 flex items-center justify-center"
                      title="Add allowances breakdown"
                    >
                      +
                    </button>
                  </div>
                  <input 
                    type="number"
                    value={allowances}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150 bg-white"
                    placeholder="0"
                    min="0"
                    readOnly
                  />
                  
                  {/* Add Allowance Form */}
                  {showAllowancesBreakdown && (
                    <div className="bg-white border-2 border-indigo-300 rounded-lg p-3 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
                        <input 
                          type="text"
                          value={breakdownName}
                          onChange={(e) => setBreakdownName(e.target.value)}
                          placeholder="e.g., HRA, Transport"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                        <input 
                          type="number"
                          value={breakdownAmount}
                          onChange={(e) => setBreakdownAmount(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setBreakdownType('allowances');
                          addBreakdownItem();
                          setBreakdownName('');
                          setBreakdownAmount('');
                        }}
                        className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition"
                      >
                        Add Item
                      </button>
                    </div>
                  )}

                  {/* Allowances Items List */}
                  {allowancesBreakdown.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-300 p-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Added Items ({allowancesBreakdown.length})</p>
                      {allowancesBreakdown.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-600">₹{item.amount.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => removeBreakdownItem(item.id, 'allowances')}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deductions Container */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-800">Deductions</label>
                    <button
                      type="button"
                      onClick={() => {
                        setBreakdownType('deductions');
                        setShowDeductionsBreakdown(!showDeductionsBreakdown);
                        if (!showDeductionsBreakdown) {
                          setShowAllowancesBreakdown(false);
                          setBreakdownName('');
                          setBreakdownAmount('');
                        } else {
                          setBreakdownName('');
                          setBreakdownAmount('');
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-bold text-xl transition hover:bg-indigo-50 rounded-full w-8 h-8 flex items-center justify-center"
                      title="Add deductions breakdown"
                    >
                      +
                    </button>
                  </div>
                  <input 
                    type="number"
                    value={deductions}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150 bg-white"
                    placeholder="0"
                    min="0"
                    readOnly
                  />
                  
                  {/* Add Deduction Form */}
                  {showDeductionsBreakdown && (
                    <div className="bg-white border-2 border-indigo-300 rounded-lg p-3 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Item Name</label>
                        <input 
                          type="text"
                          value={breakdownName}
                          onChange={(e) => setBreakdownName(e.target.value)}
                          placeholder="e.g., PF, TDS"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                        <input 
                          type="number"
                          value={breakdownAmount}
                          onChange={(e) => setBreakdownAmount(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          setBreakdownType('deductions');
                          addBreakdownItem();
                          setBreakdownName('');
                          setBreakdownAmount('');
                        }}
                        className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition"
                      >
                        Add Item
                      </button>
                    </div>
                  )}

                  {/* Deductions Items List */}
                  {deductionsBreakdown.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-300 p-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-700">Added Items ({deductionsBreakdown.length})</p>
                      {deductionsBreakdown.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-600">₹{item.amount.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => removeBreakdownItem(item.id, 'deductions')}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm transition duration-150"
                >
                  <option value="bank-transfer">Bank Transfer</option>
                
                </select>
              </div>

              {/* Bank Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                <input 
                  type="text"
                  value={bankAccount}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    // Format with dashes after every 4 digits
                    let formatted = '';
                    for (let i = 0; i < value.length; i++) {
                      if (i > 0 && i % 4 === 0) {
                        formatted += '-';
                      }
                      formatted += value[i];
                    }
                    setBankAccount(formatted);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150"
                  placeholder="Enter bank account (e.g., 1234-5678-9012-3456)"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setShowEmployeeDropdown(false);
                  setPaymentMethod('bank-transfer');
                  setBankAccount('');
                  setAllowancesBreakdown([]);
                  setDeductionsBreakdown([]);
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleGeneratePayslip}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Payslip Preview Modal */}
      {showPayslipPreview && previewPayslip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-900">Payslip Preview</h2>
              <button 
                onClick={() => {
                  setShowPayslipPreview(false);
                  setPreviewPayslip(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Payslip Content */}
            <div className="px-8 py-8 bg-white">
              {(() => {
                const [yearStr, monthStr] = previewPayslip.month.split('-');
                const monthNum = parseInt(monthStr, 10);
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const monthName = monthNames[monthNum - 1];
                
                const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
                const companyName = adminUser.organization || 'EMPLOYEE MANAGEMENT SYSTEM';
                
                let companyAddressLine = '';
                if (adminUser.address && typeof adminUser.address === 'object') {
                  companyAddressLine = [
                    adminUser.address.street,
                    adminUser.address.city,
                    adminUser.address.state,
                    adminUser.address.zip,
                    adminUser.address.country
                  ].filter(Boolean).join(', ');
                } else if (adminUser.address && typeof adminUser.address === 'string') {
                  companyAddressLine = adminUser.address;
                }
                
                if (!companyAddressLine) {
                  companyAddressLine = adminUser.companyAddress || adminUser.addressLine || 'Pune, India';
                }

                const employeeName = previewPayslip.employee?.name || 'Employee';
                const employeeId = previewPayslip.employee?.employeeId || 'N/A';
                const department = previewPayslip.employee?.department || 'N/A';
                const paymentStatus = previewPayslip.paymentStatus?.toUpperCase() || 'PENDING';
                const paymentDate = previewPayslip.paymentDate ? new Date(previewPayslip.paymentDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
                
                const grossSalary = (previewPayslip.baseSalary || 0) + (previewPayslip.allowances || 0) + (previewPayslip.bonus || 0);
                const netSalary = previewPayslip.netSalary || (grossSalary - (previewPayslip.deductions || 0));
                const designation = previewPayslip.employee?.position || 'Employee';

                const numberToWords = (num) => {
                  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
                  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
                  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
                  const convert = (n) => {
                    if (n === 0) return '';
                    if (n < 10) return ones[n];
                    if (n < 20) return teens[n - 10];
                    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
                    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
                    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
                    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
                    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
                  };
                  return convert(Math.floor(num));
                };

                const salaryInWords = numberToWords(Math.floor(netSalary)) + ' Rupees Only';

                return (
                  <div className="bg-white">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-8 pb-6 border-b-4 border-[#0b3954]">
                      <div>
                        <h1 className="text-3xl font-black text-[#0b3954] leading-tight">{companyName}</h1>
                        <p className="text-sm text-[#7a92a8] font-semibold mt-1">Professional Payroll & HR Solution</p>
                        <p className="text-xs text-[#7a92a8] mt-2 leading-relaxed">{companyAddressLine}</p>
                        <p className="text-xs text-[#7a92a8] mt-1">Email: {adminUser.email || 'hr@company.com'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#0b3954]">{monthName} {yearStr}</p>
                        <p className="text-xs text-[#7a92a8] font-semibold mt-3">Pay Date: {paymentDate}</p>
                      </div>
                    </div>

                    {/* Employee Info Section */}
                    <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b-2 border-gray-300">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Name:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{employeeName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Employee ID:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{employeeId}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Designation:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{designation}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Department:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{department}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Bank Account:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">XXXX-XXXX-XXXX-XXXX</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Payment Status:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{paymentStatus}</p>
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0b3954]">Payment Method:</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">BANK TRANSFER</p>
                        </div>
                      </div>
                    </div>

                    {/* Earnings & Deductions Tables */}
                    <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-gray-300">
                      {/* Earnings Table */}
                      <div>
                        <h3 className="text-xs font-black text-[#0b3954] uppercase tracking-wide mb-4">Earnings & Allowances</h3>
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-sm pb-2.5 border-b border-gray-200">
                            <span className="text-gray-700 font-semibold">Basic Salary</span>
                            <span className="text-gray-900 font-bold">₹ {(previewPayslip.baseSalary || 0).toLocaleString('en-IN')}</span>
                          </div>
                          {previewPayslip.allowancesBreakdown && previewPayslip.allowancesBreakdown.length > 0 && (
                            previewPayslip.allowancesBreakdown.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm pb-2.5 border-b border-gray-200">
                                <span className="text-gray-700 font-semibold">{item.name}</span>
                                <span className="text-gray-900 font-bold">₹ {(item.amount || 0).toLocaleString('en-IN')}</span>
                              </div>
                            ))
                          )}
                          <div className="flex justify-between text-sm pt-3 border-t-2 border-[#0b3954]">
                            <span className="text-[#0b3954] font-black uppercase text-xs">Total Earnings</span>
                            <span className="text-[#0b3954] font-black">₹ {((previewPayslip.baseSalary || 0) + (previewPayslip.allowances || 0)).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Deductions Table */}
                      <div>
                        <h3 className="text-xs font-black text-[#0b3954] uppercase tracking-wide mb-4">Deductions</h3>
                        <div className="space-y-2.5">
                          {previewPayslip.deductionsBreakdown && previewPayslip.deductionsBreakdown.length > 0 ? (
                            previewPayslip.deductionsBreakdown.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm pb-2.5 border-b border-gray-200">
                                <span className="text-gray-700 font-semibold">{item.name}</span>
                                <span className="text-gray-900 font-bold">₹ {(item.amount || 0).toLocaleString('en-IN')}</span>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex justify-between text-sm pb-2.5 border-b border-gray-200">
                                <span className="text-gray-700 font-semibold">PF</span>
                                <span className="text-gray-900 font-bold">₹ {Math.floor((previewPayslip.deductions || 0) * 0.5).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between text-sm pb-2.5 border-b border-gray-200">
                                <span className="text-gray-700 font-semibold">TDS</span>
                                <span className="text-gray-900 font-bold">₹ {Math.floor((previewPayslip.deductions || 0) * 0.5).toLocaleString('en-IN')}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-sm pt-3 border-t-2 border-[#0b3954]">
                            <span className="text-[#0b3954] font-black uppercase text-xs">Total Deductions</span>
                            <span className="text-[#0b3954] font-black">₹ {(previewPayslip.deductions || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-[#f0f5fb] rounded-lg p-6 mb-8 flex justify-between items-center border border-gray-200">
                      <div>
                        <p className="text-xs font-black text-[#5a7285] uppercase tracking-wide">Gross Earnings</p>
                        <p className="text-lg font-black text-[#0b3954] mt-2">₹ {grossSalary.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-[#5a7285] uppercase tracking-wide">Total Deductions</p>
                        <p className="text-lg font-black text-[#0b3954] mt-2">₹ {(previewPayslip.deductions || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Net Salary Box */}
                    <div className="bg-[#f0f5fb] border-2 border-[#0b3954] rounded-lg p-8 text-center mb-8">
                      <p className="text-xs font-black text-[#0b3954] uppercase tracking-widest">Net Salary (In Hand)</p>
                      <p className="text-4xl font-black text-[#0b3954] mt-4 mb-2">₹ {netSalary.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-[#5a7285] font-semibold">{salaryInWords}</p>
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-xs text-[#5a7285] font-semibold">|| Net Amount: ₹ {netSalary.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-300 pt-4 text-center">
                      <p className="text-xs text-[#8da1b3]">This is system generated salary slip for the month of {monthName} {yearStr}. Valid for banking / statutory purposes.</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-8 py-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button 
                onClick={() => {
                  setShowPayslipPreview(false);
                  setPreviewPayslip(null);
                }}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 transition-colors rounded-lg"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowPayslipPreview(false);
                  handleDownload(previewPayslip);
                }}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Opening page...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Open Print Page</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Payslip Modal */}
      {showPayslipModal && selectedPayslip && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0">
              <h2 className="text-lg font-semibold text-gray-900">Payslip - {selectedPayslip.name}</h2>
              <button 
                onClick={() => setShowPayslipModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Payslip Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {selectedPayslip && (
                <div className="bg-white">
                  {/* Professional Header */}
                  <div className="border-b-4 border-[#0b3954] p-8 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-4xl font-black text-[#0b3954] tracking-tight">
                          {(() => {
                            const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
                            return adminUser.organization || 'EMPLOYEE MANAGEMENT SYSTEM';
                          })()}
                        </h1>
                        <p className="text-sm text-[#7a92a8] font-medium mt-1">Professional Payroll & HR Solution</p>
                        <p className="text-xs text-[#7a92a8] mt-1">
                          {(() => {
                            const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
                            
                            // Get address from different possible structures
                            let addressLine = '';
                            if (adminUser.address && typeof adminUser.address === 'object') {
                              addressLine = [
                                adminUser.address.street,
                                adminUser.address.city,
                                adminUser.address.state,
                                adminUser.address.zip,
                                adminUser.address.country
                              ].filter(Boolean).join(', ');
                            } else if (adminUser.address && typeof adminUser.address === 'string') {
                              addressLine = adminUser.address;
                            }
                            
                            // Fallback if no address found
                            if (!addressLine) {
                              addressLine = adminUser.companyAddress || adminUser.addressLine || 'Pune, India';
                            }
                            
                            return addressLine;
                          })()}
                        </p>
                        <p className="text-xs text-[#7a92a8] mt-1">
                          Email: {(() => {
                            const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
                            return adminUser.email || 'hr@company.com';
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#0b3954]">
                          {(() => {
                            const [yearStr, monthStr] = selectedPayslip.month.split('-');
                            const monthNum = parseInt(monthStr, 10);
                            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            return `${monthNames[monthNum - 1]} ${yearStr}`;
                          })()}
                        </p>
                        <p className="text-xs text-[#7a92a8] font-medium mt-2">Pay Date: {selectedPayslip.paymentDate ? new Date(selectedPayslip.paymentDate).toLocaleDateString('en-IN') : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Employee Details Section */}
                  <div className="grid grid-cols-2 gap-12 p-8 border-b-2 border-gray-300">
                    {/* Left Column */}
                    <div>
                      <div className="mb-4">
                        <p className="text-xs text-[#0b3954] font-bold">Name:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.employee?.name || 'N/A'}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-[#0b3954] font-bold">Employee ID:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.employee?.employeeId || 'N/A'}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-[#0b3954] font-bold">Designation:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.employee?.position || 'Developer'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#0b3954] font-bold">Department:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.employee?.department || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="mb-4">
                        <p className="text-xs text-[#0b3954] font-bold">Bank Account:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">XXXX-XXXX-XXXX-XXXX</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-[#0b3954] font-bold">Payment Status:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.paymentStatus?.toUpperCase() || 'PENDING'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#0b3954] font-bold">Payment Method:</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">BANK TRANSFER</p>
                      </div>
                    </div>
                  </div>

                  {/* Earnings & Deductions Sections */}
                  <div className="grid grid-cols-2 gap-12 p-8 border-b border-gray-300">
                    {/* Earnings Section */}
                    <div>
                      <h3 className="text-sm font-black text-[#0b3954] uppercase mb-4">Earnings & Allowances</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 font-medium">Basic Salary</span>
                          <span className="text-gray-900 font-bold">₹ {(selectedPayslip.baseSalary || 0).toLocaleString('en-IN')}</span>
                        </div>
                        {selectedPayslip.allowancesBreakdown && selectedPayslip.allowancesBreakdown.length > 0 && (
                          selectedPayslip.allowancesBreakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 font-medium">{item.name}</span>
                              <span className="text-gray-900 font-bold">₹ {(item.amount || 0).toLocaleString('en-IN')}</span>
                            </div>
                          ))
                        )}
                        <div className="flex justify-between items-center text-sm pt-3 border-t-2 border-[#0b3954]">
                          <span className="text-[#0b3954] font-black">TOTAL EARNINGS</span>
                          <span className="text-[#0b3954] font-black">₹ {((selectedPayslip.baseSalary || 0) + (selectedPayslip.allowances || 0)).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions Section */}
                    <div>
                      <h3 className="text-sm font-black text-[#0b3954] uppercase mb-4">Deductions</h3>
                      <div className="space-y-3">
                        {selectedPayslip.deductionsBreakdown && selectedPayslip.deductionsBreakdown.length > 0 ? (
                          selectedPayslip.deductionsBreakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 font-medium">{item.name}</span>
                              <span className="text-gray-900 font-bold">₹ {(item.amount || 0).toLocaleString('en-IN')}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 font-medium">PF</span>
                              <span className="text-gray-900 font-bold">₹ {Math.floor((selectedPayslip.deductions || 0) * 0.5).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 font-medium">TDS</span>
                              <span className="text-gray-900 font-bold">₹ {Math.floor((selectedPayslip.deductions || 0) * 0.5).toLocaleString('en-IN')}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center text-sm pt-3 border-t-2 border-[#0b3954]">
                          <span className="text-[#0b3954] font-black">TOTAL DEDUCTIONS</span>
                          <span className="text-[#0b3954] font-black">₹ {(selectedPayslip.deductions || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-[#f0f5fb] p-8 flex justify-between items-center border-b border-gray-300">
                    <div>
                      <p className="text-xs text-[#5a7285] font-bold">Gross Earnings</p>
                      <p className="text-lg font-black text-[#0b3954] mt-1">₹ {((selectedPayslip.baseSalary || 0) + (selectedPayslip.allowances || 0)).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#5a7285] font-bold">Total Deductions</p>
                      <p className="text-lg font-black text-[#0b3954] mt-1">₹ {(selectedPayslip.deductions || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Net Salary Section */}
                  <div className="bg-[#f0f5fb] border-2 border-[#0b3954] p-8 text-center">
                    <p className="text-xs font-black text-[#0b3954] uppercase tracking-widest">NET SALARY (IN HAND)</p>
                    <p className="text-4xl font-black text-[#0b3954] mt-3">₹ {(selectedPayslip.netSalary || 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-[#5a7285] font-medium mt-2">Sixty Thousand Seven Hundred Rupees Only</p>
                    <p className="text-xs text-[#5a7285] font-medium mt-3 border-t border-gray-300 pt-3">|| Net Amount: ₹ {(selectedPayslip.netSalary || 0).toLocaleString('en-IN')}</p>
                  </div>

                  {/* Footer */}
                  <div className="p-6 text-center bg-white border-t border-gray-300">
                    <p className="text-xs text-[#8da1b3]">This is system generated salary slip for the month. Valid for banking / statutory purposes.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button 
                onClick={() => setShowPayslipModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition rounded-lg"
              >
                Close
              </button>
              <button 
                onClick={() => handleDownload(selectedPayslip)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
              >
                <Download size={16} />
                Open Print Page
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
