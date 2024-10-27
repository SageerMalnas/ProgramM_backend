const express = require('express');
const { updateUser, getUser,getUserByEmail, addUserToBoard } = require('../controllers/updateUserController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/update', protect, updateUser);
router.get('/', getUser);
router.get('/:email', getUserByEmail);
router.post('/adduser',protect,addUserToBoard);

module.exports = router;