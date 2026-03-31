import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Download,
  Eye,
  TrendingUp,
  CreditCard,
  FileText,
} from 'lucide-react';

// Mock employee data (should come from context)
const employee = {
  name: 'Olivia Chen',
  id: 'E-10245',
  department: 'Product Design',
  organization: 'TechCorp Inc.',
  position: 'Senior Product Designer',
  joinDate: '2022-06-15',
};

// Mock current month payslip
const currentPayslip = {
  month: 'March 2025',
  grossPay: 5250.0,
  netPay: 4250.0,
  deductions: {
    tax: 750.0,
    insurance: 150.0,
    retirement: 100.0,
  },
  paymentDate: 'March 31, 2025',
  status: 'Processed',
};

// Mock recent pay history
const payHistory = [
  {
    id: 1,
    month: 'February 2025',
    grossPay: 5250.0,
    netPay: 4250.0,
    paymentDate: 'Feb 28, 2025',
    status: 'Paid',
    pdfUrl: '#',
  },
  {
    id: 2,
    month: 'January 2025',
    grossPay: 5250.0,
    netPay: 4250.0,
    paymentDate: 'Jan 31, 2025',
    status: 'Paid',
    pdfUrl: '#',
  },
  {
    id: 3,
    month: 'December 2024',
    grossPay: 5250.0,
    netPay: 4250.0,
    paymentDate: 'Dec 31, 2024',
    status: 'Paid',
    pdfUrl: '#',
  },
];

// Year-to-date totals
const ytdTotals = {
  gross: 15750.0,
  net: 12750.0,
  tax: 2250.0,
  insurance: 450.0,
  retirement: 300.0,
};

export default function EmployeePayroll() {
  const [selectedMonth, setSelectedMonth] = useState(currentPayslip);
  const [showDetails, setShowDetails] = useState(false);

  const handleDownload = (month, pdfUrl) => {
    alert(`Downloading payslip for ${month}...`);
    // In real app, trigger PDF download
  };

  const handleViewDetails = (payslip) => {
    setSelectedMonth(payslip);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with employee info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Payroll</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {employee.organization} · {employee.department} · {employee.position}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Current Payslip + Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Month Payslip Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-linear-to-r from-teal-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Current Payslip: {currentPayslip.month}
                  </h2>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {currentPayslip.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Pay</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${currentPayslip.netPay.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Payment Date: {currentPayslip.paymentDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gross Pay</p>
                    <p className="text-xl font-semibold text-gray-800 dark:text-white">
                      ${currentPayslip.grossPay.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleViewDetails(currentPayslip)}
                      className="mt-3 inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>

                {/* Deductions (simple) */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Deductions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Tax</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        ${currentPayslip.deductions.tax.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Insurance</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        ${currentPayslip.deductions.insurance.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Retirement</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        ${currentPayslip.deductions.retirement.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
                <button
                  onClick={() => handleDownload(currentPayslip.month, '#')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Recent Pay History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Pay History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {payHistory.map((pay) => (
                      <tr key={pay.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                          {pay.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          ${pay.grossPay.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">
                          ${pay.netPay.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {pay.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDownload(pay.month, pay.pdfUrl)}
                            className="text-gray-400 hover:text-teal-600 transition"
                            title="Download"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">No pay history available.</div>
              )}
            </div>
          </div>

          {/* Right Column: Summary & Direct Deposit */}
          <div className="space-y-6">
            {/* Year-to-Date Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-500" />
                Year-to-Date Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Gross Earnings</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    ${ytdTotals.gross.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Net Pay</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    ${ytdTotals.net.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Tax Deducted</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    ${ytdTotals.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Insurance</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    ${ytdTotals.insurance.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-300">Retirement Contribution</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    ${ytdTotals.retirement.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Deposit Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                Direct Deposit
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Bank</span>
                  <span className="font-medium text-gray-800 dark:text-white">Chase Bank</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Account Type</span>
                  <span className="font-medium text-gray-800 dark:text-white">Checking</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Account Number</span>
                  <span className="font-medium text-gray-800 dark:text-white">****1234</span>
                </div>
                <div className="pt-3">
                  <button className="text-sm text-teal-600 hover:underline font-medium">
                    Update Bank Details →
                  </button>
                </div>
              </div>
            </div>

            {/* Tax Form Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Tax Forms
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Access your annual tax documents and W-2 forms.
              </p>
              <button className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium">
                Download W-2 (2024)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
          © 2025 Employee Management System · {employee.organization}
        </div>
      </div>

      {/* Simple Modal for Payslip Details (optional) */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Payslip Details - {selectedMonth.month}
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Gross Pay</span>
                <span className="font-semibold">${selectedMonth.grossPay?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax</span>
                <span>${selectedMonth.deductions?.tax?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Insurance</span>
                <span>${selectedMonth.deductions?.insurance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Retirement</span>
                <span>${selectedMonth.deductions?.retirement?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between py-2 border-b font-bold">
                <span className="text-gray-800">Net Pay</span>
                <span className="text-teal-600">${selectedMonth.netPay?.toFixed(2)}</span>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => handleDownload(selectedMonth.month, '#')}
                  className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}