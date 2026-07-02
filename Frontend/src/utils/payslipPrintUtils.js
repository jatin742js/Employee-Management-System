const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PAYSLIP_PRINT_STORAGE_KEY = 'payslipPrintPayload';
export const PAYSLIP_PRINT_ROUTE = '/payslip-print';

const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  const convert = (n) => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ` ${ones[n % 10]}` : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ` ${convert(n % 100)}` : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ` ${convert(n % 1000)}` : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ` ${convert(n % 100000)}` : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ` ${convert(n % 10000000)}` : '');
  };

  return convert(Math.floor(num));
};

const formatAddress = (address, fallbackAddress) => {
  if (address && typeof address === 'object') {
    const line = [address.street, address.city, address.state, address.zip, address.country]
      .filter(Boolean)
      .join(', ');
    if (line) return line;
  }

  if (typeof address === 'string' && address.trim()) {
    return address;
  }

  return fallbackAddress || 'Pune, India';
};

const resolvePeriod = (monthValue) => {
  if (!monthValue || !monthValue.includes('-')) {
    const now = new Date();
    return {
      monthName: MONTH_NAMES[now.getMonth()],
      yearStr: `${now.getFullYear()}`,
    };
  }

  const [yearStr, monthStr] = monthValue.split('-');
  const monthNum = parseInt(monthStr, 10);

  return {
    monthName: MONTH_NAMES[monthNum - 1] || 'Unknown',
    yearStr,
  };
};

const renderBreakdownRows = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return '';

  return items
    .map((item) => `
      <tr>
        <td>${item.name || 'Item'}</td>
        <td class="amount">INR ${(item.amount || 0).toLocaleString('en-IN')}</td>
      </tr>
    `)
    .join('');
};

export const buildPayslipHtml = ({ payslip, companyInfo = {} }) => {
  const { monthName, yearStr } = resolvePeriod(payslip?.month);
  const employeeName = payslip?.employee?.name || 'Employee';
  const employeeId = payslip?.employee?.employeeId || 'N/A';
  const department = payslip?.employee?.department || 'N/A';
  const designation = payslip?.employee?.position || 'Employee';
  const paymentStatus = payslip?.paymentStatus?.toUpperCase() || 'PENDING';
  const paymentDate = payslip?.paymentDate
    ? new Date(payslip.paymentDate).toLocaleDateString('en-IN')
    : new Date().toLocaleDateString('en-IN');

  const baseSalary = payslip?.baseSalary || 0;
  const allowances = payslip?.allowances || 0;
  const bonus = payslip?.bonus || 0;
  const deductions = payslip?.deductions || 0;
  const grossSalary = baseSalary + allowances + bonus;
  const netSalary = payslip?.netSalary || (grossSalary - deductions);
  const salaryInWords = `${numberToWords(Math.floor(netSalary))} Rupees Only`;

  const companyName = companyInfo.organization || 'EMPLOYEE MANAGEMENT SYSTEM';
  const companyAddressLine = formatAddress(
    companyInfo.address,
    companyInfo.companyAddress || companyInfo.addressLine || 'Pune, India'
  );
  const companyEmail = companyInfo.email || 'hr@company.com';

  const allowancesRows = renderBreakdownRows(payslip?.allowancesBreakdown);
  const deductionsRows = renderBreakdownRows(payslip?.deductionsBreakdown);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payslip ${employeeId} ${monthName} ${yearStr}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #e8edf2;
          color: #2c3e50;
          padding: 18px;
        }

        .salary-slip {
          max-width: 900px;
          margin: 0 auto;
          background-color: #ffffff !important;
          color: #2c3e50;
          padding: 40px 50px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 4px solid #0b3954;
          padding-bottom: 30px;
        }

        .company-header h1 {
          font-size: 32px;
          font-weight: 900;
          color: #0b3954 !important;
          margin-bottom: 8px;
        }

        .company-header .subtitle {
          font-size: 14px;
          color: #7a92a8 !important;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .company-header p {
          font-size: 12px;
          color: #7a92a8 !important;
          margin: 3px 0;
          line-height: 1.8;
          font-weight: 500;
        }

        .month-header {
          text-align: right;
        }

        .month-header .month-year {
          font-size: 26px;
          font-weight: 900;
          color: #0b3954 !important;
          margin-bottom: 10px;
        }

        .month-header .pay-date {
          font-size: 13px;
          color: #7a92a8 !important;
          font-weight: 600;
        }

        .emp-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid #d0dce5;
        }

        .info-column {
          flex: 1;
        }

        .info-row {
          display: flex;
          margin-bottom: 14px;
          font-size: 13px;
          align-items: baseline;
        }

        .info-label {
          font-weight: 800;
          color: #0b3954 !important;
          width: 140px;
          min-width: 140px;
          font-size: 12px;
        }

        .info-value {
          color: #2c3e50 !important;
          font-weight: 600;
          font-size: 13px;
        }

        .tables-section {
          display: flex;
          gap: 50px;
          margin-bottom: 35px;
        }

        .table-box {
          flex: 1;
        }

        .table-title {
          font-size: 15px;
          font-weight: 900;
          color: #0b3954 !important;
          margin-bottom: 18px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        table tbody tr {
          border-bottom: 1px solid #e8eef6;
        }

        table td {
          padding: 12px 0;
          text-align: left;
          color: #2c3e50 !important;
          font-weight: 600;
          font-size: 13px;
        }

        table td.amount {
          text-align: right;
          font-weight: 700;
          color: #0b3954 !important;
        }

        .total-row {
          border-top: 3px solid #0b3954 !important;
          font-weight: 900;
          color: #0b3954 !important;
          padding-top: 14px !important;
          padding-bottom: 12px !important;
          font-size: 13px;
        }

        .summary-section {
          background-color: #f0f5fb !important;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 35px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #dce6f0;
        }

        .summary-item {
          flex: 1;
          text-align: center;
        }

        .summary-label {
          font-size: 12px;
          color: #5a7285 !important;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .summary-amount {
          font-size: 20px;
          font-weight: 900;
          color: #0b3954 !important;
          margin-top: 8px;
        }

        .net-salary-box {
          background-color: #f0f5fb !important;
          border: 3px solid #0b3954 !important;
          border-radius: 8px;
          padding: 35px;
          text-align: center;
          margin-bottom: 25px;
        }

        .net-label {
          font-size: 13px;
          font-weight: 900;
          color: #0b3954 !important;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .net-amount {
          font-size: 42px;
          font-weight: 900;
          color: #0b3954 !important;
          margin: 15px 0;
        }

        .net-in-words {
          font-size: 13px;
          color: #5a7285 !important;
          font-weight: 600;
        }

        .net-amount-line {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #c0cfe0;
          font-size: 13px;
          color: #5a7285 !important;
          font-weight: 600;
        }

        .compliance {
          font-size: 11px;
          color: #8da1b3 !important;
          text-align: center;
          margin-top: 20px;
          border-top: 1px solid #d0dce5;
          padding-top: 15px;
          font-weight: 500;
        }

        @media print {
          body {
            background: #ffffff;
            padding: 0;
          }

          .salary-slip {
            max-width: 100%;
            box-shadow: none;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="salary-slip">
        <div class="header">
          <div class="company-header">
            <h1>${companyName}</h1>
            <p class="subtitle">Professional Payroll & HR Solution</p>
            <p>${companyAddressLine}</p>
            <p>Email: ${companyEmail}</p>
          </div>
          <div class="month-header">
            <div class="month-year">${monthName} ${yearStr}</div>
            <div class="pay-date">Pay Date: ${paymentDate}</div>
          </div>
        </div>

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

        <div class="tables-section">
          <div class="table-box">
            <div class="table-title">Earnings & Allowances</div>
            <table>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td class="amount">INR ${baseSalary.toLocaleString('en-IN')}</td>
                </tr>
                ${allowancesRows}
                <tr class="total-row">
                  <td>TOTAL EARNINGS</td>
                  <td class="amount total-row">INR ${(baseSalary + allowances).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-box">
            <div class="table-title">Deductions</div>
            <table>
              <tbody>
                ${deductionsRows}
                <tr class="total-row">
                  <td>TOTAL DEDUCTIONS</td>
                  <td class="amount total-row">INR ${deductions.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-item">
            <div class="summary-label">Gross Earnings</div>
            <div class="summary-amount">INR ${grossSalary.toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Deductions</div>
            <div class="summary-amount">INR ${deductions.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div class="net-salary-box">
          <div class="net-label">NET SALARY (IN HAND)</div>
          <div class="net-amount">INR ${netSalary.toLocaleString('en-IN')}</div>
          <div class="net-in-words">${salaryInWords}</div>
          <div class="net-amount-line">|| Net Amount: INR ${netSalary.toLocaleString('en-IN')}</div>
        </div>

        <div class="compliance">
          This is system generated salary slip for the month of ${monthName} ${yearStr}. Valid for banking / statutory purposes.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const savePayslipPrintPayload = (payload) => {
  sessionStorage.setItem(PAYSLIP_PRINT_STORAGE_KEY, JSON.stringify(payload));
};

export const readPayslipPrintPayload = () => {
  const raw = sessionStorage.getItem(PAYSLIP_PRINT_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Invalid payslip payload in storage:', error);
    return null;
  }
};

export const openPayslipPrintPage = ({ navigate, payslip, companyInfo }) => {
  if (!navigate) {
    throw new Error('Navigation helper is required to open payslip page.');
  }

  const payload = { payslip, companyInfo };
  savePayslipPrintPayload(payload);
  navigate(PAYSLIP_PRINT_ROUTE, { state: payload });
};
