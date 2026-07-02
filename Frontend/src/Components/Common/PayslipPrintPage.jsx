import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildPayslipHtml, readPayslipPrintPayload } from '../../utils/payslipPrintUtils';

export default function PayslipPrintPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const payload = useMemo(() => {
    if (location.state?.payslip) return location.state;
    return readPayslipPrintPayload();
  }, [location.state]);

  const html = useMemo(() => {
    if (!payload?.payslip) return '';
    return buildPayslipHtml({
      payslip: payload.payslip,
      companyInfo: payload.companyInfo || {},
    });
  }, [payload]);

  const handlePrint = () => {
    const frame = document.getElementById('payslip-print-frame');
    const frameWindow = frame?.contentWindow;

    if (!frameWindow) {
      alert('Print preview is not ready yet. Please try again.');
      return;
    }

    frameWindow.focus();
    frameWindow.print();
  };

  if (!payload?.payslip) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Payslip data not found</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please go back to payroll and open the print page again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
        >
          Back
        </button>

        <h1 className="text-sm sm:text-base font-semibold text-gray-900">Payslip Print Preview</h1>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
        >
          Print
        </button>
      </div>

      <iframe
        id="payslip-print-frame"
        title="Payslip Print Preview"
        srcDoc={html}
        className="w-full h-[calc(100vh-57px)] border-0"
      />
    </div>
  );
}
