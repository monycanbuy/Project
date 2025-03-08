const jwt = require('jsonwebtoken');
const logger = require('../middlewares/logger');

exports.identifier = (req, res, next) => {
    let token;

    if (req.headers.client === 'not-browser') {
        token = req.headers.authorization;
    } else {
        token = req.cookies['Authorization'];
    }

    if (!token) {
        const errorMessage = 'Unauthorized: No token provided!';
        logger.error(`[AUTHORIZATION] ${errorMessage}`);
        return res.status(403).json({ 
            success: false, 
            message: errorMessage 
        });
    }

    try {
        const userToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
        req.user = jwtVerified;
        return next();
    } catch (error) {
        logger.error(`[AUTHORIZATION] Token verification error: ${error.message}`, { stack: error.stack });
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized: Invalid or expired token!' 
        });
    }
};
