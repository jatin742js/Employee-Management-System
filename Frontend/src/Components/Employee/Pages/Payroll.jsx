import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import employeePayrollService from "../../../services/employeePayrollService";
import { useSocket } from "../../../context/SocketContext";
import api from "../../../services/api";
import { openPayslipPrintPage } from "../../../utils/payslipPrintUtils";

const PayrollPage = () => {
  const navigate = useNavigate();
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

    socket.on('payroll:deleted', (data) => {
      console.log('Payroll deleted via socket:', data);
      loadPayroll(); // Refresh payroll data
    });

    return () => {
      socket.off('payroll:created');
      socket.off('payroll:updated');
      socket.off('payroll:notified');
      socket.off('payroll:statusUpdated');
      socket.off('payroll:deleted');
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

      // Fetch company info from API
      const companyRes = await api
        .get('/admin/auth/company-info', { params: { context: 'payslip' } })
        .catch(() => ({ data: { data: {} } }));
      const companyInfo = companyRes.data.data || {};
      openPayslipPrintPage({
        navigate,
        payslip,
        companyInfo,
      });

      setDownloadingId(null);
    } catch (error) {
      console.error('Print page error:', error);
      console.error('Error details:', error.message);
      alert(error.message || 'Unable to open payslip page.');
      setDownloadingId(null);
    }
  };

  const filteredData = payrollData;

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
            <strong>Debug:</strong> Payroll Records: {payrollData.length} | Loading: {isLoading ? 'Yes' : 'No'}
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
                ? "No payroll data found" 
                : `Showing ${filteredData.length} record${filteredData.length !== 1 ? 's' : ''}`}
            </p>
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
                            {downloadingId === `${item.month}-${item.year}` ? 'Opening...' : 'Open Print Page'}
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