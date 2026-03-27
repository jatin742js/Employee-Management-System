import React, { useState } from 'react';
import { DollarSign, Download, Calendar } from 'lucide-react';

export default function EmployeePayroll() {
  const [selectedMonth, setSelectedMonth] = useState('march-2025');

  const payslips = [
    { id: 1, month: 'March 2025', baseSalary: '$4,000', deductions: '$500', bonus: '$200', netSalary: '$3,700', date: '2025-03-28' },
    { id: 2, month: 'February 2025', baseSalary: '$4,000', deductions: '$450', bonus: '$150', netSalary: '$3,700', date: '2025-02-28' },
    { id: 3, month: 'January 2025', baseSalary: '$4,000', deductions: '$500', bonus: '$200', netSalary: '$3,700', date: '2025-01-31' },
  ];

  const currentPayslip = {
    month: 'March 2025',
    baseSalary: 4000,
    allowances: 500,
    deductions: 800,
    tax: 300,
    bonus: 200,
    netSalary: 3700,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Payroll</h1>
          <p className="text-gray-600 dark:text-gray-400">View salary details and download payslips</p>
        </div>

        {/* Current Payslip */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-lg border border-blue-200 dark:border-blue-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Payslip - {currentPayslip.month}</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Base Salary</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${currentPayslip.baseSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allowances</p>
              <p className="text-2xl font-bold text-green-600">${currentPayslip.allowances}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deductions</p>
              <p className="text-2xl font-bold text-red-600">-${currentPayslip.deductions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tax</p>
              <p className="text-2xl font-bold text-red-600">-${currentPayslip.tax}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bonus</p>
              <p className="text-2xl font-bold text-green-600">${currentPayslip.bonus}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Salary</p>
              <p className="text-3xl font-bold text-blue-600">${currentPayslip.netSalary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payslip History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payslip History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Month</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Base Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Deductions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Bonus</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Net Salary</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payslips.map((payslip) => (
                  <tr key={payslip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{payslip.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{payslip.baseSalary}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{payslip.deductions}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{payslip.bonus}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">{payslip.netSalary}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
