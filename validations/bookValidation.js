const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 100 characters',
    }),
  
  author: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Author name must be at least 2 characters long',
      'string.max': 'Author name cannot exceed 50 characters',
    }),
  
  isbn: Joi.string()
    .pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid ISBN (10 or 13 digits)',
    }),
  
  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.min': 'Quantity cannot be negative',
    }),
  
  availableQuantity: Joi.number()
    .integer()
    .min(0)
    .max(Joi.ref('quantity'))
    .required()
    .messages({
      'number.min': 'Available quantity cannot be negative',
      'number.max': 'Available quantity cannot exceed total quantity',
    }),
});

const updateBookSchema = bookSchema.fork(['isbn'], (schema) => schema.optional());

module.exports = {
  bookSchema,
  updateBookSchema,
}; 