const Joi = require('joi');

const registerValidator = Joi.object({
    fullName: Joi.string().required().messages({
        'string.empty': 'Full name is required',
        'any.required': 'Full name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});

module.exports = registerValidator;