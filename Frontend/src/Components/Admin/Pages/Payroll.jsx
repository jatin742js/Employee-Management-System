import React, { useState, useEffect } from 'react';
import { Download, Plus, X, Upload, Eye } from 'lucide-react';
import adminPayrollService from '../../../services/adminPayrollService';
import adminEmployeeService from '../../../services/adminEmployeeService';

export default function Payroll() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

      if (payrollRes && payrollRes.payroll) {
        setPayslips(payrollRes.payroll);
      }
      if (employeeRes && employeeRes.employees) {
        setEmployees(employeeRes.employees);
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
    console.log('Downloaded payslip for', payslip.employeeName || payslip.name);
  };

  const handleGeneratePayslip = async () => {
    if (selectedEmployee && basicSalary) {
      try {
        const employee = employees.find(emp => emp._id === selectedEmployee);
        const payrollData = {
          employeeId: selectedEmployee,
          month: parseInt(month),
          year: parseInt(year),
          basicSalary: parseInt(basicSalary),
          allowances: parseInt(allowances),
          deductions: parseInt(deductions),
        };

        const response = await adminPayrollService.createPayroll(payrollData);
        if (response) {
          alert('Payslip generated successfully!');
          setShowModal(false);
          await loadPayrollData();
          
          // Reset form
          setSelectedEmployee('');
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

  const handleEmployeeSelect = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    const employee = employees.find(emp => emp._id === empId);
    if (employee) {
      setBasicSalary(employee.basicSalary || '0');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-7 py-6">
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {payslips.map((payslip) => (
              <tr key={payslip._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{payslip.employeeName || payslip.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {monthNames[payslip.month - 1]} {payslip.year}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">₹{payslip.basicSalary?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setSelectedPayslip(payslip);
                        setShowPayslipModal(true);
                      }}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </button>
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
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Empty State */}
      {payslips.length === 0 && !isLoading && (
        <div className="bg-white shadow-sm border border-gray-200 text-center py-12">
          <p className="text-gray-500 font-medium">No payslips found</p>
        </div>
      )}

      {/* Generate Payslip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Generate Monthly Payslip</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                <select 
                  value={selectedEmployee}
                  onChange={handleEmployeeSelect}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm transition duration-150"
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.position || emp.role})
                    </option>
                  ))}
                </select>
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
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setShowModal(false)}
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
            <div className="px-6 py-6">
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                {/* Header */}
                <div className="border-b border-gray-300 pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedPayslip.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPayslip.fullDetails.position}</p>
                </div>

                {/* Payslip Details */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Period</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayslip.period}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Year</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayslip.fullDetails.year}</p>
                  </div>
                </div>

                {/* Salary Details */}
                <div className="border-t border-gray-300 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Salary Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Basic Salary</span>
                      <span className="text-sm font-medium text-gray-900">${selectedPayslip.fullDetails.basicSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Allowances</span>
                      <span className="text-sm font-medium text-gray-900">${selectedPayslip.fullDetails.allowances}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700">Deductions</span>
                      <span className="text-sm font-medium text-gray-900">${selectedPayslip.fullDetails.deductions}</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="border-t border-gray-300 pt-4 bg-indigo-50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-900">Net Salary</span>
                    <span className="text-lg font-bold text-indigo-600">${selectedPayslip.fullDetails.netSalary}</span>
                  </div>
                </div>

                {/* Document Info */}
                {selectedPayslip.uploadedDoc && (
                  <div className="border-t border-gray-300 mt-4 pt-4">
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Uploaded Document</p>
                    <div className="bg-white p-2 rounded border border-gray-200 text-xs text-gray-700">
                      <p>📄 {selectedPayslip.uploadedDoc.name}</p>
                      <p className="text-gray-500">{selectedPayslip.uploadedDoc.size} KB</p>
                    </div>
                  </div>
                )}
              </div>
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
