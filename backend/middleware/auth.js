const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes: Verifies the JWT and attaches user data (id, role) to the request.
 */
const protect = (req, res, next) => {
    let token;
    
    // Check for token in the 'Authorization: Bearer <token>' format
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Safety check: Ensure JWT_SECRET is loaded
            if (!process.env.JWT_SECRET) {
                console.error("JWT_SECRET environment variable is missing.");
                throw new Error('Server configuration error.');
            }
            
            // Verify and decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach decoded user payload ({ id, role }) to the request object
            req.user = decoded; 
            
            next();

        } catch (error) {
            // Log the error (e.g., token expired, invalid signature)
            console.error(error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired.' });
        }
    } else {
        // No token provided in the headers
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

/**
 * Middleware for role-based authorization: Restricts access to specific roles.
 * @param {string[]} roles - An array of roles allowed to access the route (e.g., ['Admin', 'StoreOwner']).
 */
const restrictTo = (roles) => (req, res, next) => {
    // req.user is populated by the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }
    next();
};

module.exports = { protect, restrictTo };