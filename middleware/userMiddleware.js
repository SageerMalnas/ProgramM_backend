const jwt = require('jsonwebtoken');
const User = require('../schema/userModel')

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }
    } else {
        return res.status(401).json({ message: "No token provided" });
    }
};

module.exports = { protect };