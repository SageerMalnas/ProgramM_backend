const jwt = require('jsonwebtoken');

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn:'6d',
    })
};

module.exports = generateToken;