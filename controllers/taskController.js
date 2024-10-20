const Task = require('../schema/taskModel');
const User = require('../schema/userModel');

// Get task with filter
exports.getTasks = async (req, res) => {
  try {
    const { range = 7 } = req.query;
    const today = new Date();
    const pastDate = new Date(today.getTime() - range * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id },
      ],
      createdAt: { $gte: pastDate },
    });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};


// Create a task and assign to users
exports.createTask = async (req, res) => {
  try {
    const { title, priority, checklists, dueDate, status, assignedTo } = req.body;
    if (!title || !priority || !checklists || checklists.length === 0) {
        return res.status(400).json({ message: "Title, priority, and at least one checklist are required." });
      }
  
      const usersExist = await User.find({ _id: { $in: assignedTo } });
    //   if (usersExist?.length !== assignedTo?.length) {
    //     return res.status(400).json({ message: "Some assigned users do not exist." });
    //   }

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
    res.status(201).json({ success: true, message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Task creation failed" });
    console.log(error)
  }
};

