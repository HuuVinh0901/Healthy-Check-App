const jwt = require('jsonwebtoken');

const getToken = (req) => {
    const authHeader = req.headers.authorization;
    return authHeader?.split(' ')[1] || null;
};

const authorize = (requiredRole) => (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (requiredRole && decoded.role !== requiredRole) {
            return res.status(403).json({ message: `Forbidden: Requires ${requiredRole} role` });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Đảm bảo xuất đúng kiểu
module.exports = authorize;
