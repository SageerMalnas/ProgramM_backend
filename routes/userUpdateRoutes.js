const express = require('express');
const { updateUser, getUser } = require('../controllers/updateUserController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/update', protect, updateUser);
router.get('/', protect, getUser);

module.exports = router;