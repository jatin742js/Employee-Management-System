import React, { useState, useEffect } from 'react';
import { Download, Plus, X, Upload, Eye, Trash2, Wifi, WifiOff } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import adminPayrollService from '../../../services/adminPayrollService';
import adminEmployeeService from '../../../services/adminEmployeeService';
import { useSocket } from '../../../context/SocketContext';

export default function Payroll() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [showAllowancesBreakdown, setShowAllowancesBreakdown] = useState(false);
  const [showDeductionsBreakdown, setShowDeductionsBreakdown] = useState(false);
  const [allowancesBreakdown, setAllowancesBreakdown] = useState([]);
  const [deductionsBreakdown, setDeductionsBreakdown] = useState([]);
  const [breakdownName, setBreakdownName] = useState('');
  const [breakdownAmount, setBreakdownAmount] = useState('');
  const [breakdownType, setBreakdownType] = useState('allowances');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const paymentStatusOptions = ['pending', 'processed', 'paid'];

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

    return () => {
      socket.off('payroll:created');
      socket.off('payroll:statusUpdated');
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
      const [yearStr, monthStr] = payslip.month.split('-');
      const monthNum = parseInt(monthStr, 10);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[monthNum - 1];
      
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      const companyName = adminUser.organization || 'EMPLOYEE MANAGEMENT SYSTEM';
      
      // Get address from different possible structures
      let companyAddressLine = '';
      if (adminUser.address && typeof adminUser.address === 'object') {
        const companyAddress = adminUser.address;
        companyAddressLine = [
          companyAddress.street,
          companyAddress.city,
          companyAddress.state,
          companyAddress.zip,
          companyAddress.country
        ].filter(Boolean).join(', ');
      } else if (adminUser.address && typeof adminUser.address === 'string') {
        companyAddressLine = adminUser.address;
      }
      
      // Fallback if no address found
      if (!companyAddressLine) {
        companyAddressLine = adminUser.companyAddress || adminUser.addressLine || 'Pune, India';
      }
      
      const employeeName = payslip.employee?.name || 'Employee';
      const employeeId = payslip.employee?.employeeId || 'N/A';
      const department = payslip.employee?.department || 'N/A';
      const paymentStatus = payslip.paymentStatus?.toUpperCase() || 'PENDING';
      const paymentDate = payslip.paymentDate ? new Date(payslip.paymentDate).toLocaleDateString('en-IN') : 'N/A';
      
      const grossSalary = (payslip.baseSalary || 0) + (payslip.allowances || 0) + (payslip.bonus || 0);
      const netSalary = payslip.netSalary || (grossSalary - (payslip.deductions || 0));

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
      const designation = payslip.employee?.position || 'Employee';

      const htmlContent = `
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @charset "UTF-8";
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html { background: #ffffff; }
            body { 
              font-family: Arial, Helvetica, sans-serif; 
              background: #ffffff; 
              color: #2c3e50;
              -webkit-font-smoothing: antialiased;
              text-rendering: optimizeLegibility;
            }
            .salary-slip { 
              width: 100%; 
              padding: 30px 40px; 
              background: #ffffff; 
              color: #2c3e50; 
              min-height: 100%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              box-sizing: border-box;
            }
            
            /* Header Section */
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; border-bottom: 3px solid #0b3954; padding-bottom: 25px; }
            .company-header h1 { font-size: 28px; font-weight: 800; color: #0b3954; margin-bottom: 5px; letter-spacing: -0.5px; }
            .company-header .subtitle { font-size: 13px; color: #7a92a8; font-weight: 500; margin-bottom: 8px; }
            .company-header p { font-size: 11px; color: #7a92a8; margin: 2px 0; line-height: 1.6; }
            
            .month-header { text-align: right; }
            .month-header .month-year { font-size: 22px; font-weight: 800; color: #0b3954; margin-bottom: 8px; }
            .month-header .pay-date { font-size: 12px; color: #7a92a8; }
            
            /* Employee Info Section */
            .emp-info { display: flex; justify-content: space-between; margin-bottom: 35px; }
            .info-column { flex: 1; }
            .info-row { display: flex; margin-bottom: 12px; font-size: 13px; }
            .info-label { font-weight: 700; color: #0b3954; width: 120px; min-width: 120px; }
            .info-value { color: #2c3e50; font-weight: 500; }
            
            /* Tables Section */
            .tables-section { display: flex; gap: 40px; margin-bottom: 30px; }
            .table-box { flex: 1; }
            .table-title { font-size: 14px; font-weight: 800; color: #0b3954; margin-bottom: 15px; letter-spacing: 0.3px; text-transform: uppercase; }
            
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            table tbody tr { border-bottom: 1px solid #e8eef6; }
            table td { padding: 11px 0; text-align: left; color: #2c3e50; font-weight: 500; }
            table td.amount { text-align: right; font-weight: 600; color: #0b3954; }
            
            .total-row { border-top: 2px solid #0b3954; font-weight: 800; color: #0b3954; padding-top: 14px !important; padding-bottom: 10px !important; }
            
            /* Summary Section */
            .summary-section { background: #f0f5fb; border-radius: 6px; padding: 25px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .summary-item { flex: 1; text-align: center; }
            .summary-label { font-size: 11px; color: #5a7285; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
            .summary-amount { font-size: 18px; font-weight: 800; color: #0b3954; margin-top: 6px; }
            
            /* Net Salary Box */
            .net-salary-box { background: #f0f5fb; border: 2px solid #0b3954; border-radius: 6px; padding: 28px; text-align: center; margin-bottom: 20px; }
            .net-label { font-size: 12px; font-weight: 800; color: #0b3954; letter-spacing: 1px; text-transform: uppercase; }
            .net-amount { font-size: 36px; font-weight: 900; color: #0b3954; margin: 12px 0; }
            .net-in-words { font-size: 12px; color: #5a7285; font-weight: 500; }
            .net-amount-line { margin-top: 12px; padding-top: 12px; border-top: 1px solid #d0dce5; font-size: 12px; color: #5a7285; }
            
            /* Compliance */
            .compliance { font-size: 10px; color: #8da1b3; text-align: center; margin-top: 15px; border-top: 1px solid #d0dce5; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div class="salary-slip">
            <!-- HEADER -->
            <div class="header">
              <div class="company-header">
                <h1>${companyName}</h1>
                <p class="subtitle">Professional Payroll & HR Solution</p>
                <p>${companyAddressLine}</p>
                <p>Email: ${adminUser.email || 'hr@company.com'}</p>
              </div>
              <div class="month-header">
                <div class="month-year">${monthName} ${yearStr}</div>
                <div class="pay-date">Pay Date: ${paymentDate}</div>
              </div>
            </div>

            <!-- EMPLOYEE INFO -->
            <div class="emp-info">
              <div class="info-column">
                <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${employeeName}</span></div>
                <div class="info-row"><span class="info-label">Employee ID:</span><span class="info-value">${employeeId}</span></div>
                <div class="info-row"><span class="info-label">Designation:</span><span class="info-value">${designation}</span></div>
                <div class="info-row"><span class="info-label">Department:</span><span class="info-value">${department}</span></div>
              </div>
              <div class="info-column">
                <div class="info-row"><span class="info-label">Bank Account:</span><span class="info-value">XXXX-XXXX-XXXX-XXXX</span></div>
                <div class="info-row"><span class="info-label">Payment Status:</span><span class="info-value">${paymentStatus}</span></div>
                <div class="info-row"><span class="info-label">Payment Method:</span><span class="info-value">BANK TRANSFER</span></div>
              </div>
            </div>

            <!-- TABLES SECTION -->
            <div class="tables-section">
              <div class="table-box">
                <div class="table-title">Earnings & Allowances</div>
                <table>
                  <tbody>
                    <tr>
                      <td>Basic Salary</td>
                      <td class="amount">₹ ${(payslip.baseSalary || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    ${payslip.allowancesBreakdown && payslip.allowancesBreakdown.length > 0 
                      ? payslip.allowancesBreakdown.map(item => `
                        <tr>
                          <td>${item.name}</td>
                          <td class="amount">₹ ${(item.amount || 0).toLocaleString('en-IN')}</td>
                        </tr>
                      `).join('')
                      : ''
                    }
                    <tr class="total-row">
                      <td>TOTAL EARNINGS</td>
                      <td class="amount total-row">₹ ${((payslip.baseSalary || 0) + (payslip.allowances || 0)).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="table-box">
                <div class="table-title">Deductions</div>
                <table>
                  <tbody>
                    ${payslip.deductionsBreakdown && payslip.deductionsBreakdown.length > 0 
                      ? payslip.deductionsBreakdown.map(item => `
                        <tr>
                          <td>${item.name}</td>
                          <td class="amount">₹ ${(item.amount || 0).toLocaleString('en-IN')}</td>
                        </tr>
                      `).join('')
                      : ''
                    }
                    <tr class="total-row">
                      <td>TOTAL DEDUCTIONS</td>
                      <td class="amount total-row">₹ ${(payslip.deductions || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SUMMARY SECTION -->
            <div class="summary-section">
              <div class="summary-item">
                <div class="summary-label">Gross Earnings</div>
                <div class="summary-amount">₹ ${grossSalary.toLocaleString('en-IN')}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Deductions</div>
                <div class="summary-amount">₹ ${(payslip.deductions || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <!-- NET SALARY BOX -->
            <div class="net-salary-box">
              <div class="net-label">NET SALARY (IN HAND)</div>
              <div class="net-amount">₹ ${netSalary.toLocaleString('en-IN')}</div>
              <div class="net-in-words">${salaryInWords}</div>
              <div class="net-amount-line">|| Net Amount: ₹ ${netSalary.toLocaleString('en-IN')}</div>
            </div>

            <!-- COMPLIANCE -->
            <div class="compliance">
              This is system generated salary slip for the month of ${monthName} ${yearStr}. Valid for banking / statutory purposes.
            </div>
          </div>
        </body>
        </html>
      `;

      // Create isolated temporary container
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = htmlContent;
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.height = 'auto';
      tempContainer.style.display = 'block';
      tempContainer.style.zIndex = '-9999';
      tempContainer.style.margin = '0';
      tempContainer.style.padding = '0';
      
      document.body.appendChild(tempContainer);
      await new Promise(resolve => setTimeout(resolve, 300));

      const slipElement = tempContainer.querySelector('.salary-slip');

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Payslip_${employeeId}_${monthName}_${yearStr}.pdf`,
        image: {
          type: 'png',
          quality: 0.99
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: slipElement.offsetWidth,
          windowHeight: slipElement.offsetHeight
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: false
        }
      };

      await html2pdf()
        .set(opt)
        .from(slipElement)
        .save();

      // Cleanup
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('PDF Error:', error);
      console.error('Error details:', error.message);
      alert('Error generating PDF. Please check console.');
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
                  <button 
                    onClick={() => handleDownload(payslip)}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                    title="Download PDF"
                  >
                    <Download size={16} />
                    Download
                  </button>
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
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
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
