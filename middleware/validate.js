const Joi = require('joi');

// Custom error messages
const customMessages = {
  'string.base': '{#label} should be a string',
  'string.empty': '{#label} cannot be empty',
  'string.email': '{#label} must be a valid email',
  'number.base': '{#label} should be a number',
  'number.min': '{#label} must be at least {#limit}',
  'any.required': '{#label} is required',
  'string.pattern.base': '{#label} fails to match the required pattern',
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      messages: customMessages,
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      console.log("error",error.message)
      return res.status(400).json({ 
        status: 'error',
        message: 'Validation failed',
        errors: errorMessage 
      });
    }
    next();
  };
};

module.exports = validate; 