const express = require('express');
const { updateUser, getUser,getUserByEmail } = require('../controllers/updateUserController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/update', protect, updateUser);
router.get('/', protect, getUser);
router.get('/:email', getUserByEmail);

module.exports = router;