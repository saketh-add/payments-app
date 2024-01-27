const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];

    if (!header) {
        return res.status(403).json({
            message: "Protected route is not accessible to unautorized user"
        })
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token error"
        })
    }

}

module.exports = {
    authMiddleware
}