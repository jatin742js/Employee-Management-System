import employeeApi from './employeeApi';

// Employee Payroll Services
const employeePayrollService = {
  // Get my payroll records
  getMyPayroll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await employeeApi.get(`/employee/payroll${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payroll details by ID
  getPayrollDetails: async (id) => {
    try {
      const response = await employeeApi.get(`/employee/payroll/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download payslip PDF
  downloadPayslip: async (month, year) => {
    try {
      console.log(`Downloading payslip for ${month}/${year} from /employee/payroll/download`);
      const response = await employeeApi.get(`/employee/payroll/download`, {
        params: { month, year },
        responseType: 'blob'
      });
      console.log('Payslip downloaded successfully:', response);
      return response.data;
    } catch (error) {
      console.error('Download error details:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to download payslip';
      throw new Error(errorMsg);
    }
  },
};

export default employeePayrollService;
