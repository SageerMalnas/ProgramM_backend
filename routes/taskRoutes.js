const express = require('express');
const { createTask,getTasks,getTask,updateTask,deleteTask,analytics} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);


module.exports = router;