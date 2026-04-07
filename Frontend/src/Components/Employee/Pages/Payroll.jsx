import React, { useState } from "react";
import { Download, Filter } from "lucide-react";

const PayrollPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const payrollData = [
    {
      month: "March",
      year: "2026",
      gross: "₹50,000",
      deduction: "₹8,000",
      bonus: "₹2,500",
      net: "₹44,500",
      status: "Paid",
    },
    {
      month: "February",
      year: "2026",
      gross: "₹50,000",
      deduction: "₹7,500",
      bonus: "₹2,000",
      net: "₹44,500",
      status: "Paid",
    },
    {
      month: "January",
      year: "2026",
      gross: "₹50,000",
      deduction: "₹9,000",
      bonus: "₹3,000",
      net: "₹44,000",
      status: "Paid",
    },
  ];

  const filteredData = payrollData.filter(
    (item) =>
      item.month === selectedMonth &&
      item.year === selectedYear &&
      (selectedStatus === "All" || item.status === selectedStatus)
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100  py-8 px-4">
      <div className="w-full px-4">

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payroll Dashboard</h1>
          <p className="text-gray-600 text-sm">Manage and track your salary payments</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">💼 Payroll History</h2>
            <p className="text-gray-600 text-xs mt-1">
              {filteredData.length === 0 
                ? "No records found for the selected filters" 
                : `Showing ${filteredData.length} record${filteredData.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Filters Section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
              Filter Options
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  placeholder="Enter year (e.g., 2026)"
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
                  <option>Processing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
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
          {/* <div className="px-6 py-3 border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-600 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default PayrollPage;