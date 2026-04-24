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
    const parseTimeToMinutes = (timeValue) => {
      if (!timeValue) return null;
      const value = String(timeValue).trim();

      // 12-hour format, optional seconds: 09:15 AM / 09:15:22 PM
      const meridiemMatch = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
      if (meridiemMatch) {
        let hour = Number(meridiemMatch[1]);
        const minute = Number(meridiemMatch[2]);
        const meridiem = meridiemMatch[3].toUpperCase();

        if (meridiem === "PM" && hour !== 12) hour += 12;
        if (meridiem === "AM" && hour === 12) hour = 0;

        return hour * 60 + minute;
      }

      // 24-hour format, optional seconds: 17:45 / 17:45:10
      const twentyFourMatch = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
      if (twentyFourMatch) {
        const hour = Number(twentyFourMatch[1]);
        const minute = Number(twentyFourMatch[2]);
        if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
          return hour * 60 + minute;
        }
      }

      return null;
    };

    const checkInMinutes = parseTimeToMinutes(checkInTime);
    const checkOutMinutes = parseTimeToMinutes(checkOutTime);

    if (checkInMinutes === null || checkOutMinutes === null) {
      return 0;
    }

    let diffMinutes = checkOutMinutes - checkInMinutes;
    if (diffMinutes < 0) {
      // Guard for day boundary edge-case
      diffMinutes += 24 * 60;
    }

    const diffHours = diffMinutes / 60;
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
