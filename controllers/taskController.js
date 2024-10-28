const Task = require('../schema/taskModel');
const User = require('../schema/userModel');

exports.getTasks = async (req, res) => {
  try {
    const { range = 7 } = req.query;
    const today = new Date();

    const startDate = new Date(today.setHours(0, 0, 0, 0));
    let endDate = new Date(today.setHours(23, 59, 59, 999));

    if (range === '1') {
      endDate = new Date(today.setHours(23, 59, 59, 999));
    } else if (range === '7') {
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)); 
    } else if (range === '30') {
      startDate.setDate(1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999); 
    }

    const tasks = await Task.find({
      $and: [
        {
          $or: [
            { createdBy: req.user._id },
            { assignedTo: req.user._id }
          ]
        },
        {
          $or: [
            { dueDate: { $gte: startDate, $lte: endDate } }, // Tasks within date range
            { dueDate: null }
          ]
        }
      ]
    }).populate({
      path: 'assignedTo',
      select: '_id email'
    });

    return res.status(200).json({ success: true, data: { tasks } });
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }
};


// Create a task and assign to users
exports.createTask = async (req, res) => {
  try {
    const { title, priority, checklists, dueDate, status, assignedTo } = req.body;
    if (!title || !priority  || !checklists || checklists.length === 0) {
      return res.status(400).json({ message: "Title, priority, and at least one checklist are required." });
    }

    const usersExist = await User.find({ _id: { $in: assignedTo } });
      // if (usersExist?.length !== assignedTo?.length) {
      //   return res.status(400).json({ message: "Some assigned users do not exist." });
      // }

    const validChecklists = Array.isArray(checklists) ? checklists : [];

    const newTask = new Task({
      title,
      priority,
      checklists: validChecklists,
      dueDate,
      status: status || 'todo',
      createdBy: req.user._id,
      assignedTo: assignedTo || [],
    });

    await newTask.save();
    const populatedTask = await Task.findById(newTask._id).populate({
      path: 'assignedTo',
      select: 'email' 
    });

    res.status(201).json({ success: true, message: "Task created successfully", data: {task: populatedTask} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Task creation failed" });
    console.log(error)
  }
};

// Get a specific task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId).populate({
      path: 'assignedTo',
      select: '_id email' 
    });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: {task} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch the task" });
  }
};

//update task
exports.editTask = async (req, res) => {
  try {
    const { title, priority, checklists, dueDate, status, assignedTo } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    if (task.createdBy.toString() !== req.user._id.toString() && !task.assignedTo.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: "You do not have permission to edit this task" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      // req.params.taskId,
      // { _id: req.params.taskId, createdBy: req.user._id },
      {
        _id: req.params.taskId,
        $or: [
          { createdBy: req.user._id },
          { assignedTo: req.user._id }
        ]
      },
      { title, priority, checklists, dueDate, status, assignedTo },
      { new: true, runValidators: true }
    ).populate({
      path: 'assignedTo',
      select: '_id email'
    });

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task updated successfully", data: {task: updatedTask} });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Task update failed" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  
  try {
    const task = await Task.findById(req.params.taskId);

    // Check if the user is either the creator or an assigned user
    if (!task || (task.createdBy.toString() !== req.user._id.toString() && !task.assignedTo.includes(req.user._id))) {
      return res.status(403).json({ success: false, message: "You do not have permission to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(204).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};

// Task analytics
exports.analytics = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });

    const status = {
      backlog: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    const priorities = {
      low: 0,
      moderate: 0,
      high: 0,
      due: 0,
    };

    tasks.forEach((t) => {
      status[t.status]++;
      priorities[t.priority]++;
      if (t.dueDate) {
        priorities.due++;
      }
    });

    res.status(200).json({ success: true, data: { status, priorities } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get analytics" });
  }
};
