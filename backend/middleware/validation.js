const { body } = require('express-validator');

// Regex for Password: 8-16 characters, must include at least one uppercase letter ([A-Z]) 
// and one special character ([!@#$%^&*]).
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

/**
 * Validation rules for the User signup route.
 */
const validateSignup = [
    // Name: Min 20 characters, Max 60 characters.
    body('name')
        .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters.'),
    
    // Email: Must follow standard email validation rules.
    body('email')
        .isEmail().withMessage('Invalid email format.'),
    
    // Address: Max 400 characters.
    body('address')
        .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters.'),
    
    // Password: 8-16 characters, uppercase, and special character.
    body('password')
        .matches(passwordRegex).withMessage('Password must be 8-16 characters, include one uppercase letter, and one special character (!@#$%^&*).'),
];

/**
 * Validation rules for password update.
 */
const validatePasswordUpdate = [
    // New Password: 8-16 characters, uppercase, and special character.
    body('newPassword')
        .matches(passwordRegex).withMessage('New password must be 8-16 characters, include one uppercase letter, and one special character (!@#$%^&*).'),
];

module.exports = { validateSignup, validatePasswordUpdate };