import React, { useState } from 'react';
import { DollarSign, Search, Download, Filter, TrendingUp } from 'lucide-react';

export default function Payroll() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const payrollData = [
    { id: 1, name: 'Cody Fisher', position: 'Web Designer', baseSalary: '$4000', deductions: '$500', bonus: '$200', netSalary: '$3700', status: 'Paid' },
    { id: 2, name: 'Wade Wilson', position: 'Product Designer', baseSalary: '$3500', deductions: '$400', bonus: '$150', netSalary: '$3250', status: 'Paid' },
    { id: 3, name: 'Albert Flores', position: 'Lead Designer', baseSalary: '$5000', deductions: '$600', bonus: '$300', netSalary: '$4700', status: 'Processing' },
    { id: 4, name: 'Bruce Wayne', position: 'Motion Designer', baseSalary: '$3800', deductions: '$450', bonus: '$180', netSalary: '$3530', status: 'Paid' },
    { id: 5, name: 'Diana Prince', position: 'Graphic Designer', baseSalary: '$3200', deductions: '$380', bonus: '$100', netSalary: '$2920', status: 'Pending' },
  ];

  const getStatusStyle = (status) => {
    const styles = {
      'Paid': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payroll Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor salary and compensation details</p>
        </div>

        {/* Top Bar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Months</option>
            <option value="march">March 2025</option>
            <option value="february">February 2025</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$18,100</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$2,330</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid this Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$17,100</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Employee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Position</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Base Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Deductions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Bonus</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Net Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payrollData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{record.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{record.baseSalary}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.deductions}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.bonus}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">{record.netSalary}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(record.status)}`}>
                        {record.status}
                      </span>
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
