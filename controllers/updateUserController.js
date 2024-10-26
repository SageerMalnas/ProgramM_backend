const User = require('../schema/userModel');
const bcrypt = require('bcrypt');
const Task = require('../schema/taskModel');

exports.getUser = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found',
        });
    }

    res.status(200).json, ({
        status: 'success',
        data: {
            info: {
                name: user.name,
                email: user.email,
                _id: user._id,
            }
        }
    })
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        // console.log('Email ',email)
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                info: {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching the user',
            error: error.message,
        });
    }
};


exports.updateUser = async (req, res) => {
    const { name, email, newPassword, oldPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found',
        });
    }

    if (newPassword) {
        if (!oldPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Old password is required to update the password.',
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                status: 'fail',
                message: 'Old password is incorrect.',
            });
        }

        // user.password = await bcrypt.hash(newPassword, 12);
        user.password = newPassword;
    }

    
    if(name) user.name = name;
    if (email) {
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already in use by another user.',
            });
        }
        user.email = email;
    }

    const updatedUser = await user.save();
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                _id: updatedUser._id,
            }
        }
    })
}


exports.addUserToBoard = async (req, res) => {
    const { email } = req.body;
    const currentUserId = req.user._id;

    try {
        const addedUser = await User.findOne({ email });
        if (!addedUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User does not exist',
            });
        }

        const tasks = await Task.find({ createdBy: currentUserId });


        tasks.forEach(task => task.assignedTo = addedUser._id);
        await Promise.all(tasks.map(task => task.save()));

        res.status(200).json({
            status: 'success',
            message: `${addedUser.email} added to the board.`,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while adding the user to the board.',
            error: error.message,
        });
    }
};