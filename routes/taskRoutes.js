const express = require('express');
const { createTask,getTasks,getTask,editTask,deleteTask,analytics} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.get('/analytics', protect, analytics);
router.get('/:taskId', getTask);
router.patch('/:taskId', protect, editTask);
router.delete('/:taskId', protect, deleteTask);


module.exports = router;