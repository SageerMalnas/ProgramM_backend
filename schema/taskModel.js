const mongoose = require('mongoose');

const checklist = new mongoose.Schema({
    title: { type: String, required: true },
    checked: { type: Boolean, default: false },
});


const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        priority: { type: String, enum: ['high', 'moderate', 'low'], required: true },
        checklists: [checklist],
        status: { type: String, enum: ['backlog', 'inProgress', 'todo', 'done'], default: 'todo' },
        dueDate: Date,
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {timestamps: true}
);

taskSchema.virtual('isExpired').get(function () {
    return this.dueDate && new Date() > this.Date;
})

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;