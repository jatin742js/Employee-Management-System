import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import employeePayrollService from "../../../services/employeePayrollService";
import { useSocket } from "../../../context/SocketContext";

const PayrollPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [payrollData, setPayrollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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
    if (!socket) return;

    socket.on('payroll:notified', (data) => {
      console.log('Payroll notification received:', data);
      loadPayroll(); // Refresh payroll data
    });

    socket.on('payroll:updated', (data) => {
      console.log('Payroll updated:', data);
      loadPayroll();
    });

    socket.on('payroll:statusUpdated', (data) => {
      console.log('Payroll status updated:', data);
      loadPayroll();
    });

    return () => {
      socket.off('payroll:notified');
      socket.off('payroll:updated');
      socket.off('payroll:statusUpdated');
    };
  }, [socket]);

  const loadPayroll = async () => {
    try {
      setIsLoading(true);
      const response = await employeePayrollService.getMyPayroll();
      const data =
        response?.data?.payroll ||
        response?.payroll ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);
      
      if (Array.isArray(data)) {
        const formattedPayroll = data.map((payroll) => ({
          ...formatMonthYear(payroll.month),
          gross: `₹${Number(payroll.baseSalary || 0).toLocaleString('en-IN')}`,
          deduction: `₹${Number(payroll.deductions || 0).toLocaleString('en-IN')}`,
          bonus: `₹${Number(payroll.allowances || 0).toLocaleString('en-IN')}`,
          net: `₹${Number(payroll.netSalary || 0).toLocaleString('en-IN')}`,
          status: getStatusLabel(payroll.paymentStatus || payroll.status || 'pending'),
        }));
        setPayrollData(formattedPayroll);
      } else {
        setPayrollData([]);
      }
      setError('');
    } catch (err) {
      console.error('Error loading payroll:', err);
      setError(err.message || 'Failed to load payroll');
      setPayrollData([]);
    } finally {
      setIsLoading(false);
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
                            onClick={() => {
                              const month = selectedMonth;
                              const year = selectedYear;
                              alert(`Downloading Payslip_${month}_${year}.pdf...`);
                            }}
                            className="inline-flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 shadow-sm"
                          >
                            <Download size={14} />
                            Download
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