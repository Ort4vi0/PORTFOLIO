const mongoose = require('mongoose')

const SchemaProject = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Description:{
        type: String,
        required: true
    },
    CreatedAt:{
        type: Date,
        default: Date.now
    }
})

const ProjectMGS = mongoose.model("Project", SchemaProject)
module.exports = ProjectMGS