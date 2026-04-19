// API Response formatter
const successResponse = (res, status, message, data = null) => {
  const response = {
    success: true,
    message,
    status,
  };

  if (data) {
    response.data = data;
  }

  res.status(status).json(response);
};

const errorResponse = (res, status, message, errors = null) => {
  const response = {
    success: false,
    message,
    status,
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(status).json(response);
};

// Validation error formatter
const formatValidationErrors = (errors) => {
  return errors.array().map((error) => ({
    field: error.param,
    message: error.msg,
    value: error.value,
  }));
};

module.exports = {
  successResponse,
  errorResponse,
  formatValidationErrors,
};
