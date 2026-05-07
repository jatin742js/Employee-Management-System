import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import employeePayrollService from "../../../services/employeePayrollService";
import { useSocket } from "../../../context/SocketContext";
import api from "../../../services/api";

const PayrollPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [payrollData, setPayrollData] = useState([]);
  const [rawPayrollData, setRawPayrollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const { socket } = useSocket();

  const normalizeStatus = (value = '') => {
    const status = value.toLowerCase();
    if (status === 'processing') return 'processed';
    return status;
  };

  const getStatusLabel = (value = '') => {
    const normalized = normalizeStatus(value);
    if (normalized === 'processed') return 'Processing';
    if (!normalized) return 'Pending';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const formatMonthYear = (monthValue) => {
    if (!monthValue || !monthValue.includes('-')) {
      const now = new Date();
      return {
        month: now.toLocaleString('en-US', { month: 'long' }),
        year: now.getFullYear().toString(),
      };
    }

    const [year, month] = monthValue.split('-');
    const monthIndex = Number(month);
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return {
      month: monthNames[monthIndex - 1] || 'Unknown',
      year,
    };
  };

  useEffect(() => {
    loadPayroll();
  }, []);

  // Listen to real-time payroll updates via Socket.io
  useEffect(() => {
    if (!socket) {
      console.log('Socket not connected');
      return;
    }

    console.log('Setting up Socket.IO listeners for payroll');

    // Listen for payroll created/updated events
    socket.on('payroll:created', (data) => {
      console.log('Payroll created via socket:', data);
      loadPayroll(); // Refresh payroll data
    });

    socket.on('payroll:updated', (data) => {
      console.log('Payroll updated via socket:', data);
      loadPayroll(); // Refresh payroll data
    });

    socket.on('payroll:notified', (data) => {
      console.log('Payroll notification received:', data);
      loadPayroll(); // Refresh payroll data
    });

    socket.on('payroll:statusUpdated', (data) => {
      console.log('Payroll status updated via socket:', data);
      loadPayroll(); // Refresh payroll data
    });

    return () => {
      socket.off('payroll:created');
      socket.off('payroll:updated');
      socket.off('payroll:notified');
      socket.off('payroll:statusUpdated');
    };
  }, [socket]);

  const loadPayroll = async () => {
    try {
      setIsLoading(true);
      const response = await employeePayrollService.getMyPayroll();
      console.log('Payroll API Response:', response);
      
      const data =
        response?.data?.payroll ||
        response?.payroll ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);
      
      console.log('Extracted payroll data:', data);
      
      if (Array.isArray(data)) {
        setRawPayrollData(data);
        const formattedPayroll = data.map((payroll) => ({
          ...formatMonthYear(payroll.month),
          gross: `₹${Number(payroll.baseSalary || 0).toLocaleString('en-IN')}`,
          deduction: `₹${Number(payroll.deductions || 0).toLocaleString('en-IN')}`,
          bonus: `₹${Number(payroll.allowances || 0).toLocaleString('en-IN')}`,
          net: `₹${Number(payroll.netSalary || 0).toLocaleString('en-IN')}`,
          status: getStatusLabel(payroll.paymentStatus || payroll.status || 'pending'),
        }));
        console.log('Formatted payroll:', formattedPayroll);
        setPayrollData(formattedPayroll);
      } else {
        console.log('Data is not an array:', data);
        setPayrollData([]);
        setRawPayrollData([]);
      }
      setError('');
    } catch (err) {
      console.error('Error loading payroll:', err);
      setError(err.message || 'Failed to load payroll');
      setPayrollData([]);
      setRawPayrollData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPayslip = (month, year, payslip) => {
    try {
      if (!payslip) {
        alert('Payslip data not available');
        return;
      }

      setDownloadingId(`${month}-${year}`);

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const [yearStr, monthStr] = payslip.month ? payslip.month.split('-') : [year, new Date().getMonth() + 1];
      const monthNum = parseInt(monthStr, 10);
      const monthName = monthNames[monthNum - 1] || month;
      
      const employeeName = payslip.employee?.name || 'Employee';
      const employeeId = payslip.employee?.employeeId || 'N/A';
      const department = payslip.employee?.department || 'N/A';
      const paymentMethod = payslip.paymentMethod?.replace('-', ' ').toUpperCase() || 'BANK TRANSFER';
      const paymentStatus = payslip.paymentStatus?.toUpperCase() || 'PENDING';
      const paymentDate = payslip.paymentDate ? new Date(payslip.paymentDate).toLocaleDateString('en-IN') : 'N/A';
      const designation = payslip.employee?.position || payslip.employee?.role || 'Employee';
      const joiningDate = payslip.employee?.dateOfJoining ? new Date(payslip.employee.dateOfJoining).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
      const bankAccount = payslip.employee?.bankAccount || 'XXXX-XXXX-XXXX-XXXX';
      
      const grossSalary = (payslip.baseSalary || 0) + (payslip.allowances || 0) + (payslip.bonus || 0);
      const tds = Math.floor((payslip.deductions || 0) * 0.4);
      const pf = Math.floor((payslip.deductions || 0) * 0.3);
      const pt = Math.floor((payslip.deductions || 0) * 0.3);
      const netSalary = payslip.netSalary || (grossSalary - (payslip.deductions || 0));

      // Convert number to words function
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

      // Define PDF generation function before using it
      const generatePDF = (companyName, companyAddressLine, companyEmail, companyPhone) => {
        const htmlContent = `
        <div class="salary-slip" style="width: 100%; background: #ffffff; padding: 0; font-family: 'Inter', Arial, sans-serif; color: #1a2c3e;">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #eef2f7; }
            .salary-slip { width: 100%; background: #ffffff; border-radius: 24px; }
            .slip-inner { padding: 2rem; }
            .header-section { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; border-bottom: 2px solid #e9edf2; padding-bottom: 1.5rem; margin-bottom: 1.8rem; gap: 2rem; }
            .company-info h1 { font-size: 1.5rem; font-weight: 700; color: #1e466e; margin-bottom: 8px; }
            .company-info p { color: #5a6e7c; font-size: 0.85rem; margin-top: 4px; }
            .slip-badge { text-align: right; }
            .month-year { font-weight: 700; font-size: 1.2rem; color: #1e466e; }
            .pay-date { font-size: 0.85rem; color: #4f6f8f; margin-top: 8px; }
            .emp-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; background: #fbfdff; border-radius: 16px; border: 1px solid #eef2f8; padding: 1.4rem; margin-bottom: 2rem; }
            .info-block { display: flex; flex-direction: column; gap: 0.8rem; }
            .info-row { display: flex; align-items: flex-start; gap: 0.8rem; font-size: 0.9rem; padding-bottom: 8px; border-bottom: 1px dashed #e2e8f0; }
            .info-label { font-weight: 600; color: #2c4c6e; min-width: 100px; }
            .info-value { color: #1f2f3e; font-weight: 500; }
            .components-row { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 2rem; }
            .earning-card, .deduction-card { flex: 1; min-width: 280px; background: #ffffff; border-radius: 16px; border: 1px solid #eef2f8; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); }
            .card-header { background: #f8fafd; padding: 1rem 1.2rem; border-bottom: 1px solid #e9edf2; }
            .card-header h3 { font-weight: 600; font-size: 1.1rem; color: #1e466e; }
            .comp-table { width: 100%; border-collapse: collapse; }
            .comp-table td { padding: 0.85rem 1.2rem; text-align: left; border-bottom: 1px solid #eff3f8; font-size: 0.9rem; }
            .comp-table td.label { font-weight: 500; color: #2c4c6e; }
            .comp-table td.amount { text-align: right; font-weight: 600; font-family: monospace; }
            .total-row { background: #f9fbfe; font-weight: 700; border-top: 2px solid #e2e8f0; }
            .total-row td { font-weight: 700; color: #0b3954; }
            .net-summary { background: linear-gradient(105deg, #f6fafe 0%, #ffffff 100%); border-radius: 16px; padding: 1.2rem 1.8rem; margin: 1.5rem 0; border: 1px solid #e2ebf3; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
            .net-calculation { display: flex; gap: 1rem; flex-wrap: wrap; }
            .calc-item { background: white; padding: 0.5rem 1rem; border-radius: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            .calc-label { font-weight: 500; color: #48637c; font-size: 0.8rem; }
            .calc-value { font-weight: 700; font-size: 1.1rem; margin-left: 8px; color: #2c3e50; }
            .net-pay-block { background: #eef3fc; padding: 0.8rem 1.5rem; border-radius: 12px; text-align: center; }
            .net-label { font-size: 0.85rem; font-weight: 600; color: #1e466e; }
            .net-amount { font-size: 1.5rem; font-weight: 800; color: #1e5a3a; margin: 8px 0; }
            .amount-in-words { font-size: 0.8rem; color: #4f6f8f; font-weight: 500; }
            .info-note { background: #F9FCFE; border-radius: 12px; padding: 10px 14px; margin-top: 1rem; border-left: 4px solid #9bbad8; font-size: 0.8rem; color: #3c5a77; line-height: 1.5; }
            .compliance-note { margin-top: 1rem; text-align: center; font-size: 0.75rem; color: #8ba0b2; border-top: 1px solid #eceff5; padding-top: 1rem; }
            @media (max-width: 768px) {
              .emp-details-grid { grid-template-columns: 1fr; }
              .header-section { flex-direction: column; }
              .net-summary { flex-direction: column; align-items: flex-start; }
              .components-row { flex-direction: column; }
            }
          </style>
          
          <div class="slip-inner">
            <!-- HEADER -->
            <div class="header-section">
              <div class="company-info">
                <h1>${companyName}</h1>
                <p>Professional Payroll & HR Solution</p>
                <p>${companyAddressLine}</p>
                <p>Email: ${companyEmail} | Phone: ${companyPhone}</p>
              </div>
              <div class="slip-badge">
                <div class="month-year">${monthName} ${yearStr}</div>
                <div class="pay-date">Pay Date: ${paymentDate}</div>
              </div>
            </div>

            <!-- EMPLOYEE DETAILS -->
            <div class="emp-details-grid">
              <div class="info-block">
                <div class="info-row"><span class="info-label">Name:</span><span class="info-value">${employeeName}</span></div>
                <div class="info-row"><span class="info-label">Employee ID:</span><span class="info-value">${employeeId}</span></div>
                <div class="info-row"><span class="info-label">Designation:</span><span class="info-value">${designation}</span></div>
                <div class="info-row"><span class="info-label">Department:</span><span class="info-value">${department}</span></div>
              </div>
              <div class="info-block">
                <div class="info-row"><span class="info-label">Bank Account:</span><span class="info-value">${bankAccount}</span></div>
                <div class="info-row"><span class="info-label">Payment Status:</span><span class="info-value">${paymentStatus}</span></div>
                <div class="info-row"><span class="info-label">Payment Method:</span><span class="info-value">${paymentMethod}</span></div>
              </div>
            </div>

            <!-- EARNINGS & DEDUCTIONS -->
            <div class="components-row">
              <!-- Earnings -->
              <div class="earning-card">
                <div class="card-header">
                  <h3>Earnings & Allowances</h3>
                </div>
                <table class="comp-table">
                  <tbody>
                    <tr><td class="label">Basic Salary</td><td class="amount">₹ ${(payslip.baseSalary || 0).toLocaleString('en-IN')}</td></tr>
                    ${payslip.allowancesBreakdown && payslip.allowancesBreakdown.length > 0 
                      ? payslip.allowancesBreakdown.map(item => `<tr><td class="label">${item.name || 'Allowance'}</td><td class="amount">₹ ${(item.amount || 0).toLocaleString('en-IN')}</td></tr>`).join('')
                      : ''
                    }
                    <tr class="total-row"><td class="label">TOTAL EARNINGS</td><td class="amount">₹ ${((payslip.baseSalary || 0) + (payslip.allowances || 0)).toLocaleString('en-IN')}</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- Deductions -->
              <div class="deduction-card">
                <div class="card-header">
                  <h3>Deductions</h3>
                </div>
                <table class="comp-table">
                  <tbody>
                    ${payslip.deductionsBreakdown && payslip.deductionsBreakdown.length > 0 
                      ? payslip.deductionsBreakdown.map(item => `<tr><td class="label">${item.name || 'Deduction'}</td><td class="amount">₹ ${(item.amount || 0).toLocaleString('en-IN')}</td></tr>`).join('')
                      : ''
                    }
                    <tr class="total-row"><td class="label">TOTAL DEDUCTIONS</td><td class="amount">₹ ${(payslip.deductions || 0).toLocaleString('en-IN')}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- NET SALARY SUMMARY -->
            <div class="net-summary">
              <div class="net-calculation">
                <div class="calc-item"><span class="calc-label">Gross Earnings</span><span class="calc-value">₹ ${grossSalary.toLocaleString('en-IN')}</span></div>
                <div class="calc-item"><span class="calc-label">Total Deductions</span><span class="calc-value">₹ ${(payslip.deductions || 0).toLocaleString('en-IN')}</span></div>
              </div>
              <div class="net-pay-block">
                <div class="net-label">NET SALARY (IN HAND)</div>
                <div class="net-amount">₹ ${netSalary.toLocaleString('en-IN')}</div>
                <div class="amount-in-words">${salaryInWords}</div>
              </div>
            </div>

            <!-- ADDITIONAL INFO -->
            <div class="info-note">
              || <strong>Net Amount:</strong> ₹ ${netSalary.toLocaleString('en-IN')}
            </div>

            <!-- COMPLIANCE NOTE -->
            <div class="compliance-note">
              This is system generated salary slip for the month of ${monthName} ${yearStr}. Valid for banking / statutory purposes.
            </div>
          </div>
        </div>
      `;

        // Create element and append to document for rendering only
        const element = document.createElement('div');
        element.innerHTML = htmlContent;
        element.style.position = 'fixed';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.width = '210mm';
        element.style.zIndex = '-1000';
        
        document.body.appendChild(element);

        // Use requestAnimationFrame to ensure rendering completes before PDF generation
        requestAnimationFrame(() => {
          setTimeout(async () => {
            try {
              const salarySlipDiv = element.querySelector('.salary-slip');
              
              // Generate canvas from the element
              const canvas = await html2canvas(salarySlipDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowHeight: salarySlipDiv.scrollHeight,
                windowWidth: salarySlipDiv.scrollWidth
              });

              // Create PDF and add canvas image
              const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
              });

              const imgData = canvas.toDataURL('image/jpeg', 0.98);
              const pageWidth = pdf.internal.pageSize.getWidth();
              const pageHeight = pdf.internal.pageSize.getHeight();
              
              // Calculate image dimensions to fit A4 with margins
              const margin = 5;
              const imgWidth = pageWidth - (margin * 2);
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
              pdf.save(`Payslip_${employeeId}_${monthName}_${yearStr}.pdf`);

              // Cleanup
              if (document.body.contains(element)) {
                document.body.removeChild(element);
              }
              setDownloadingId(null);
            } catch (err) {
              console.error('PDF generation error:', err);
              if (document.body.contains(element)) {
                document.body.removeChild(element);
              }
              setDownloadingId(null);
              alert('Error generating PDF. Please try again.');
            }
          }, 50);
        });
      };

      // Fetch company info from API
      api.get('/admin/auth/company-info')
        .then(res => {
          const companyInfo = res.data.data || {};
          const companyName = companyInfo.organization || 'EMPLOYEE MANAGEMENT SYSTEM';
          const companyAddress = companyInfo.address || {};
          const companyAddressLine = [
            companyAddress.street,
            companyAddress.city,
            companyAddress.state,
            companyAddress.zip,
            companyAddress.country
          ].filter(Boolean).join(', ') || 'Pune, India';
          
          const companyEmail = companyInfo.email || 'hr@company.com';
          const companyPhone = companyInfo.phone || 'N/A';
          
          generatePDF(companyName, companyAddressLine, companyEmail, companyPhone);
        })
        .catch(err => {
          console.log('Error fetching company info, using defaults:', err);
          // Use defaults if API fails
          generatePDF('EMPLOYEE MANAGEMENT SYSTEM', 'Pune, India', 'hr@company.com', 'N/A');
        });
    } catch (error) {
      console.error('PDF Error:', error);
      alert('Error generating PDF. Please try again.');
      setDownloadingId(null);
    }
  };

  const filteredData = payrollData.filter(
    (item) =>
      (selectedMonth === "All" || item.month === selectedMonth) &&
      (selectedYear === "All" || item.year === selectedYear) &&
      (
        selectedStatus === "All" ||
        normalizeStatus(item.status) === normalizeStatus(selectedStatus)
      )
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100  py-8 px-4">
      <div className="w-full">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Payroll Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage and track your salary payments</p>
        </div>

        {/* Debug Section */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-mono">
            <strong>Debug:</strong> Payroll Records: {payrollData.length} | Filtered: {filteredData.length} | Loading: {isLoading ? 'Yes' : 'No'}
          </p>
          {error && <p className="text-xs text-red-700 mt-2">Error: {error}</p>}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">💼 Payroll History</h2>
            <p className="text-gray-600 text-xs mt-1">
              {filteredData.length === 0 
                ? "No records found for the selected filters" 
                : `Showing ${filteredData.length} record${filteredData.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filters Section */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
              Filter Options
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Month
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
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

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Year
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  placeholder="All or 2026"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option>All</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Processed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-4 text-left">
                      <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Month & Year</span>
                    </th>
                    <th className="py-3 px-4 text-left">
                      <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Status</span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide">Action</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200">
                        <td className="py-3 px-4">
                          <span className="text-gray-900 font-medium">{item.month} {item.year}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium border border-teal-200">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => handleDownloadPayslip(item.month, item.year, rawPayrollData[index])}
                            disabled={downloadingId === `${item.month}-${item.year}`}
                            className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm"
                          >
                            <Download size={14} />
                            {downloadingId === `${item.month}-${item.year}` ? 'Downloading...' : 'Download'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-8 px-4 text-center">
                        <p className="text-gray-600 text-sm">No payroll data found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
        </div>

      </div>
    </div>
  );
};

export default PayrollPage;