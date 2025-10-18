const mongoose = require('mongoose')

const SchemaTask = new mongoose.Schema({
    Title:{
        required: true,
        type: String
    },
    Completed:{
        required: true,
        type: Boolean,
        default: false
    },
    Project:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    }
})

const TaskMGS = mongoose.model("Task", SchemaTask)
module.exports = TaskMGS