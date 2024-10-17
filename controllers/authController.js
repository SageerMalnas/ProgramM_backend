const User = require('../schema/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

const registerUser = async(req,res) =>{
    const {name, email, password, confirmPassword} = req.body;

    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({message: "All fields are required"});
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
    }

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error, please try again later" });
    }
}

module.exports = {registerUser};