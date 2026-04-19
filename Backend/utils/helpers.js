// Common validation rules and messages
const validationRules = {
  name: {
    rule: (value) => value && value.trim().length >= 2,
    message: "Name must be at least 2 characters",
  },
  email: {
    rule: (value) =>
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
    message: "Invalid email format",
  },
  password: {
    rule: (value) => value && value.length >= 6,
    message: "Password must be at least 6 characters",
  },
  phone: {
    rule: (value) => !value || /^[0-9]{10}$/.test(value),
    message: "Phone must be 10 digits",
  },
  salary: {
    rule: (value) => !value || (Number(value) > 0 && Number(value) < 10000000),
    message: "Salary must be between 0 and 10000000",
  },
};

// Calculate working hours between two times
const calculateWorkingHours = (checkInTime, checkOutTime) => {
  try {
    const checkIn = new Date(`2024-01-01 ${checkInTime}`);
    const checkOut = new Date(`2024-01-01 ${checkOutTime}`);
    const diffMs = checkOut - checkIn;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 2) / 2; // Round to nearest 0.5
  } catch (error) {
    return 0;
  }
};

// Calculate number of days between dates
const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
};

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  let month = String(d.getMonth() + 1).padStart(2, "0");
  let day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Get today's date range
const getTodayRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    $gte: today,
    $lt: tomorrow,
  };
};

// Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return now.toISOString().slice(0, 7);
};

module.exports = {
  validationRules,
  calculateWorkingHours,
  calculateDaysBetween,
  formatDate,
  getTodayRange,
  getCurrentMonth,
};
