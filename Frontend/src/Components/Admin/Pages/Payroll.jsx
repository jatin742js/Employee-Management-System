import React, { useState, useEffect } from 'react';
import { Download, Plus, X, Upload, Eye } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import adminPayrollService from '../../../services/adminPayrollService';
import adminEmployeeService from '../../../services/adminEmployeeService';

export default function Payroll() {
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
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const paymentStatusOptions = ['pending', 'processed', 'paid'];

  useEffect(() => {
    loadPayrollData();
  }, []);

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

  const handleDownload = (payslip) => {
    try {
      const [yearStr, monthStr] = payslip.month.split('-');
      const monthNum = parseInt(monthStr, 10);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthName = monthNames[monthNum - 1];
      const monthShortName = monthShort[monthNum - 1];
      
      const employeeName = payslip.employee?.name || 'Employee';
      const employeeId = payslip.employee?.employeeId || 'N/A';
      const department = payslip.employee?.department || 'N/A';
      const paymentMethod = payslip.paymentMethod?.replace('-', ' ').toUpperCase() || 'BANK TRANSFER';
      const paymentStatus = payslip.paymentStatus?.toUpperCase() || 'PENDING';
      const paymentDate = payslip.paymentDate ? new Date(payslip.paymentDate).toLocaleDateString('en-IN') : 'N/A';
      
      const grossSalary = (payslip.baseSalary || 0) + (payslip.allowances || 0) + (payslip.bonus || 0);
      const tds = Math.floor((payslip.deductions || 0) * 0.4);
      const pf = Math.floor((payslip.deductions || 0) * 0.3);
      const pt = Math.floor((payslip.deductions || 0) * 0.3);

      // HTML structure for PDF conversion (without DOCTYPE to prevent rendering issues)
      const htmlContent = `
        <div class="payslip" style="width: 100%; background: white; padding: 20px; font-family: Arial, sans-serif;">
          <style>
            .payslip { width: 100%; background: white; padding: 20px; }
            .payslip .header { background-color: #1e293b; color: white; padding: 20px; text-align: center; margin-bottom: 20px; border-bottom: 3px solid #4f46e5; }
            .payslip .header h1 { font-size: 24px; margin-bottom: 5px; }
            .payslip .header p { font-size: 12px; margin: 5px 0; }
            .payslip .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; }
            .payslip .section-title { font-size: 13px; font-weight: bold; color: #1e293b; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #4f46e5; }
            .payslip .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .payslip .label { font-size: 12px; color: #666; }
            .payslip .value { font-size: 12px; font-weight: bold; color: #000; }
            .payslip .highlight { background-color: #dbeafe; padding: 10px; border: 1px solid #4f46e5; font-weight: bold; }
            .payslip .net-section { background-color: #f0fdf4; padding: 15px; border: 2px solid #16a34a; margin: 20px 0; text-align: center; }
            .payslip .net-value { font-size: 28px; color: #16a34a; font-weight: bold; margin: 10px 0; }
            .payslip .footer { background-color: #111827; color: white; padding: 15px; text-align: center; font-size: 10px; margin-top: 20px; }
            .payslip table { width: 100%; border-collapse: collapse; }
            .payslip td { padding: 8px; border-bottom: 1px solid #eee; }
            .payslip .left { text-align: left; }
            .payslip .right { text-align: right; }
          </style>
          
          <!-- Header -->
          <div class="header">
            <h1>EMPLOYEE MANAGEMENT SYSTEM</h1>
            <p>Professional Payroll & HR Solution</p>
            <p style="margin-top: 10px; font-size: 16px;">PAYROLL SLIP - ${monthShortName} ${yearStr}</p>
            <p style="font-size: 10px; margin-top: 10px;">Address: Pune, India | Email: hr@company.com | Phone: +91-20-XXXX-XXXX</p>
          </div>

          <!-- Employee Details -->
          <div class="section">
            <div class="section-title">EMPLOYEE INFORMATION</div>
            <div class="row">
              <div><span class="label">Name:</span> <span class="value">${employeeName}</span></div>
              <div><span class="label">Employee ID:</span> <span class="value">${employeeId}</span></div>
            </div>
            <div class="row">
              <div><span class="label">Department:</span> <span class="value">${department}</span></div>
              <div><span class="label">Payment Method:</span> <span class="value">${paymentMethod}</span></div>
            </div>
            <div class="row">
              <div><span class="label">Payment Status:</span> <span class="value">${paymentStatus}</span></div>
              <div><span class="label">Payment Date:</span> <span class="value">${paymentDate}</span></div>
            </div>
          </div>

          <!-- Earnings -->
          <div class="section">
            <div class="section-title">EARNINGS</div>
            <table>
              <tr>
                <td class="left label">Basic Salary</td>
                <td class="right value">₹ ${(payslip.baseSalary || 0).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="left label">House Rent Allowance</td>
                <td class="right value">₹ ${(payslip.allowances || 0).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="left label">Performance Bonus</td>
                <td class="right value">₹ ${(payslip.bonus || 0).toLocaleString('en-IN')}</td>
              </tr>
              <tr class="highlight">
                <td class="left">GROSS EARNINGS</td>
                <td class="right">₹ ${grossSalary.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <!-- Deductions -->
          <div class="section">
            <div class="section-title">DEDUCTIONS</div>
            <table>
              <tr>
                <td class="left label">Income Tax (TDS)</td>
                <td class="right value">₹ ${tds.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="left label">Provident Fund</td>
                <td class="right value">₹ ${pf.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="left label">Professional Tax</td>
                <td class="right value">₹ ${pt.toLocaleString('en-IN')}</td>
              </tr>
              <tr class="highlight" style="background-color: #fee2e2; border: 1px solid #dc2626;">
                <td class="left">TOTAL DEDUCTIONS</td>
                <td class="right" style="color: #dc2626;">₹ ${(payslip.deductions || 0).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <!-- Net Salary -->
          <div class="net-section">
            <div class="label">NET SALARY (TAKE HOME PAY)</div>
            <div class="net-value">₹ ${(payslip.netSalary || 0).toLocaleString('en-IN')}</div>
            <div style="font-size: 11px; color: #16a34a;">Credited to Bank Account</div>
          </div>

          <!-- Summary -->
          <div class="section">
            <div class="section-title">SUMMARY</div>
            <div class="row">
              <div><span class="label">Gross Earnings:</span> <span class="value">₹ ${grossSalary.toLocaleString('en-IN')}</span></div>
              <div><span class="label">Total Deductions:</span> <span class="value">₹ ${(payslip.deductions || 0).toLocaleString('en-IN')}</span></div>
              <div><span class="label">Net Pay:</span> <span class="value" style="color: #16a34a;">₹ ${(payslip.netSalary || 0).toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>This is an electronically generated document. No physical signature is required as per IT Rules, 2021.</p>
            <p style="margin-top: 8px;">Confidential - For Employee Only</p>
            <p style="margin-top: 8px;">Generated on: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      `;

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      // Completely hide element without affecting layout
      element.style.display = 'none';
      element.style.position = 'absolute';
      element.style.left = '-10000px';
      element.style.top = '-10000px';
      element.style.width = '210mm';
      element.style.height = 'auto';
      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
      element.style.visibility = 'hidden';
      document.body.appendChild(element);
      
      // Small delay to ensure rendering
      setTimeout(() => {
        // Use html2pdf with reliable settings
        const options = {
          margin: [5, 5, 5, 5],
          filename: `Payslip_${employeeId}_${monthName}_${yearStr}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            allowTaint: true,
            logging: false
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };

        html2pdf()
          .set(options)
          .from(element.querySelector('.payslip'))
          .save()
          .finally(() => {
            if (document.body.contains(element)) {
              document.body.removeChild(element);
            }
            console.log('PDF downloaded:', employeeName);
          });
      }, 100);

    } catch (error) {
      console.error('PDF Error:', error);
      alert('Error generating PDF. Please try again.');
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
          paymentMethod: 'bank-transfer',
        };

        const response = await adminPayrollService.createPayroll(payrollData);
        if (response) {
          alert('Payslip generated successfully!');
          setShowModal(false);
          setShowEmployeeDropdown(false);
          await loadPayrollData();
          
          // Reset form
          setSelectedEmployee('');
          setEmployeeQuery('');
          setMonth('1');
          setYear('2026');
          setBasicSalary('');
          setAllowances('0');
          setDeductions('0');
          setUploadedDoc(null);
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
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
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
            {payslips.length > 0 ? payslips.map((payslip) => {
              // Parse month from YYYY-MM format
              const [yearStr, monthStr] = payslip.month.split('-');
              const monthNum = parseInt(monthStr, 10);
              const monthName = monthNames[monthNum - 1] || 'Unknown';
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
                    disabled={updatingStatusId === payslip._id}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
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
                      onClick={() => handleDownload(payslip)}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                    >
                      <Download size={16} />
                      Download
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
            <div className="px-6 py-6 space-y-5">
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

              {/* Allowances and Deductions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allowances</label>
                  <input 
                    type="number"
                    value={allowances}
                    onChange={(e) => setAllowances(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deductions</label>
                  <input 
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition duration-150"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setShowEmployeeDropdown(false);
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
                  <div className="bg-linear-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-8 rounded-t-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h1 className="text-3xl font-bold tracking-wider">EMPLOYEE MANAGEMENT SYSTEM</h1>
                        <p className="text-sm text-indigo-200 mt-2">Professional Payroll & HR Solution</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-indigo-200 uppercase tracking-widest">Payroll Slip</p>
                        <p className="text-2xl font-bold mt-2">
                          {(() => {
                            const [yearStr, monthStr] = selectedPayslip.month.split('-');
                            const monthNum = parseInt(monthStr, 10);
                            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                            return `${monthNames[monthNum - 1]} ${yearStr}`;
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-indigo-400 pt-4 text-xs text-indigo-100">
                      <p>Address: Pune, India | Email: hr@company.com | Phone: +91-20-XXXX-XXXX</p>
                    </div>
                  </div>

                  {/* Employee Details Section */}
                  <div className="grid grid-cols-2 gap-8 p-8 border-b-2 border-gray-300">
                    {/* Left Column */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-indigo-700">Employee Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Name</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.employee?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Employee ID</p>
                          <p className="text-sm font-bold text-gray-900 mt-1 font-mono">{selectedPayslip.employee?.employeeId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Department</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.employee?.department || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-indigo-700">Payment Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Payment Method</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{selectedPayslip.paymentMethod?.replace('-', ' ').toUpperCase() || 'Bank Transfer'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Payment Status</p>
                          <div className="mt-1">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                              selectedPayslip.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              selectedPayslip.paymentStatus === 'processed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedPayslip.paymentStatus?.toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Payment Date</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {selectedPayslip.paymentDate ? new Date(selectedPayslip.paymentDate).toLocaleDateString('en-IN') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Section */}
                  <div className="p-8 border-b border-gray-300">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-indigo-600">Earnings</h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700 font-medium">Basic Salary</span>
                        <span className="text-sm font-bold text-gray-900">₹ {(selectedPayslip.baseSalary || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700 font-medium">House Rent Allowance</span>
                        <span className="text-sm font-bold text-gray-900">₹ {(selectedPayslip.allowances || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700 font-medium">Performance Bonus</span>
                        <span className="text-sm font-bold text-gray-900">₹ {(selectedPayslip.bonus || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-indigo-50 px-3 rounded-md border border-indigo-200 font-semibold">
                        <span className="text-sm text-indigo-900">Gross Earnings</span>
                        <span className="text-sm text-indigo-900">₹ {((selectedPayslip.baseSalary || 0) + (selectedPayslip.allowances || 0) + (selectedPayslip.bonus || 0)).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions Section */}
                  <div className="p-8 border-b border-gray-300">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-3 border-b-2 border-red-600">Deductions</h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700 font-medium">Income Tax (TDS)</span>
                        <span className="text-sm font-bold text-red-600">₹ {Math.floor((selectedPayslip.deductions || 0) * 0.4).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700 font-medium">Provident Fund</span>
                        <span className="text-sm font-bold text-red-600">₹ {Math.floor((selectedPayslip.deductions || 0) * 0.3).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-700 font-medium">Professional Tax</span>
                        <span className="text-sm font-bold text-red-600">₹ {Math.floor((selectedPayslip.deductions || 0) * 0.3).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-red-50 px-3 rounded-md border border-red-200 font-semibold">
                        <span className="text-sm text-red-900">Total Deductions</span>
                        <span className="text-sm text-red-900">₹ {(selectedPayslip.deductions || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary Section */}
                  <div className="p-8 bg-linear-to-r from-green-50 to-emerald-50 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Net Salary (Take Home Pay)</p>
                        <p className="text-2xl font-bold text-green-700">₹ {(selectedPayslip.netSalary || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-600 text-white rounded-lg p-4 text-center">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-1">Credited To</p>
                          <p className="text-lg font-bold">Bank Account</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="p-8 bg-gray-50 border-b border-gray-300">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Summary</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-700">Gross Earnings:</span>
                          <span className="text-sm font-bold text-gray-900">₹ {((selectedPayslip.baseSalary || 0) + (selectedPayslip.allowances || 0) + (selectedPayslip.bonus || 0)).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-sm text-gray-700">Total Deductions:</span>
                          <span className="text-sm font-bold text-red-600">₹ {(selectedPayslip.deductions || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-green-600">
                        <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-2">Net Pay</p>
                        <p className="text-2xl font-bold text-green-600">₹ {(selectedPayslip.netSalary || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-8 bg-gray-900 text-white text-center rounded-b-lg">
                    <p className="text-xs text-gray-300 mb-3">This is an electronically generated document. No physical signature is required as per IT Rules, 2021.</p>
                    <p className="text-xs text-gray-400 mb-3">Confidential - For Employee Only</p>
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
                Download PDF
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
