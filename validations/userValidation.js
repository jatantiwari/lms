const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  
  role: Joi.string()
    .valid('admin', 'librarian', 'member')
    .required()
    .messages({
      'any.only': 'Role must be either admin, librarian, or member',
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
    }),
  
  isActive: Joi.boolean()
    .default(false),
});

const updateUserSchema = userSchema.fork(
  ['email', 'role'], 
  (schema) => schema.optional()
);

module.exports = {
  userSchema,
  updateUserSchema,
}; 