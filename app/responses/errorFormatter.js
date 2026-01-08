/**
 * Formats Joi validation errors into a consistent API response format
 * 
 * @param {Object} joiError - The error object returned by Joi validation
 * @returns {Object} Formatted error response
 */
export const formatValidationError = (joiError) => {
  // Default error response structure
  const errorResponse = {
    status: 'error',
    message: 'Validation error',
    errors: []
  };

  // No error provided
  if (!joiError || !joiError.details) {
    return errorResponse;
  }

  // Transform Joi error details into a more readable format
  errorResponse.errors = joiError.details.map(error => {
    return {
      field: error.path.join('.'),
      message: error.message.replace(/['"]/g, ''),
      key: error.context?.key,
      type: error.type
    };
  });

  return errorResponse;
};

/**
 * Creates a middleware for handling validation errors
 * Useful for frameworks like Express
 */
export const validationErrorHandler = (err, req, res, next) => {
  if (err && err.isJoi) {
    return res.status(400).json(formatValidationError(err));
  }
  
  // Pass error to next middleware if it's not a Joi error
  return next(err);
};