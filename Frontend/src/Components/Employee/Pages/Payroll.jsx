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

  const handleDownloadPayslip = async (month, year, payslip) => {
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
      const paymentStatus = payslip.paymentStatus?.toUpperCase() || 'PENDING';
      const paymentDate = payslip.paymentDate ? new Date(payslip.paymentDate).toLocaleDateString('en-IN') : 'N/A';
      const designation = payslip.employee?.position || 'Employee';
      
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

      // Fetch company info from API
      const companyRes = await api.get('/admin/auth/company-info').catch(() => ({ data: { data: {} } }));
      const companyInfo = companyRes.data.data || {};
      const companyName = companyInfo.organization || 'EMPLOYEE MANAGEMENT SYSTEM';
      const companyAddress = companyInfo.address || {};
      const companyAddressLine = [
        companyAddress.street,
        companyAddress.city,
        companyAddress.state,
        companyAddress.zip,
        companyAddress.country
      ].filter(Boolean).join(', ') || 'Pune, India';

      const htmlContent = `
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
            .salary-slip { width: 210mm; height: 297mm; padding: 30px 40px; background: #ffffff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #d0dce5; padding-bottom: 20px; }
            .company-header h1 { font-size: 24px; font-weight: 700; color: #0b3954; margin-bottom: 8px; }
            .company-header p { font-size: 12px; color: #5a7285; margin: 4px 0; line-height: 1.5; }
            .month-header { text-align: right; }
            .month-header .month-year { font-size: 20px; font-weight: 700; color: #0b3954; margin-bottom: 8px; }
            .month-header .pay-date { font-size: 12px; color: #7a92a8; }
            .emp-info { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .info-column { }
            .info-row { display: flex; margin-bottom: 10px; font-size: 13px; }
            .info-label { font-weight: 600; color: #0b3954; width: 140px; }
            .info-value { color: #2c3e50; }
            .tables-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; }
            .table-box { }
            .table-title { font-size: 14px; font-weight: 700; color: #0b3954; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { padding: 10px 0; text-align: left; border-bottom: 1px solid #e8eef6; }
            th { font-weight: 600; color: #0b3954; }
            td.amount { text-align: right; font-weight: 500; }
            .total-row { border-top: 2px solid #d0dce5; border-bottom: none; font-weight: 700; color: #0b3954; padding-top: 12px; padding-bottom: 8px; }
            .total-row.amount { color: #0b3954; }
            .summary-section { background: #f0f5fb; border-radius: 8px; padding: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .summary-item { text-align: center; }
            .summary-label { font-size: 12px; color: #5a7285; font-weight: 500; }
            .summary-amount { font-size: 16px; font-weight: 700; color: #0b3954; margin-top: 4px; }
            .net-salary-box { background: #f0f5fb; border: 2px solid #0b3954; border-radius: 8px; padding: 20px; text-align: center; }
            .net-label { font-size: 12px; font-weight: 700; color: #0b3954; letter-spacing: 0.5px; }
            .net-amount { font-size: 32px; font-weight: 800; color: #1b5e3f; margin: 10px 0; }
            .net-in-words { font-size: 11px; color: #5a7285; font-weight: 500; }
            .net-amount-line { margin-top: 15px; padding-top: 15px; border-top: 1px solid #d0dce5; font-size: 11px; color: #5a7285; }
            .compliance { font-size: 10px; color: #8da1b3; text-align: center; margin-top: 20px; border-top: 1px solid #d0dce5; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="salary-slip">
            <!-- HEADER -->
            <div class="header">
              <div class="company-header">
                <h1>${companyName}</h1>
                <p>Professional Payroll & HR Solution</p>
                <p>${companyAddressLine}</p>
                <p>Email: ${companyInfo.email || 'hr@company.com'} | Phone: ${companyInfo.phone || 'N/A'}</p>
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

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.position = 'absolute';
      element.style.left = '0';
      element.style.top = '0';
      element.style.width = '210mm';
      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
      element.style.zIndex = '-1000';

      document.body.appendChild(element);
      await new Promise(resolve => setTimeout(resolve, 200));

      const slipElement = element.querySelector('.salary-slip');
      console.log('Slip element:', slipElement);

      const canvas = await html2canvas(slipElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowHeight: slipElement.scrollHeight,
        windowWidth: slipElement.scrollWidth,
      });

      const pdf = new jsPDF({ 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      pdf.save(`Payslip_${employeeId}_${monthName}_${yearStr}.pdf`);

      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
      setDownloadingId(null);
    } catch (error) {
      console.error('PDF Error:', error);
      console.error('Error details:', error.message);
      alert('Error generating PDF. Please check console.');
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