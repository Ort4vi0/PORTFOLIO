const express = require('express')

const { AddProject } = require('../Functions/Projects/PostProject')
const { GetProject } = require('../Functions/Projects/GetProject')
const { EditProject } = require('../Functions/Projects/PutProject')
const { DeleteProject } = require('../Functions/Projects/DeleteProject')

const { PostTask } = require('../Functions/Tasks/PostTask')
const { GetTask } = require('../Functions/Tasks/GetTask')
const { EditTask } = require('../Functions/Tasks/PutTask')
const { DeleteTask } = require('../Functions/Tasks/DeleteTask')



const route = express.Router()

route.post("/Project", AddProject)
route.get("/Project", GetProject)
route.put("/Project/:id", EditProject)
route.delete("/Project/:id", DeleteProject)

route.post("/Task/:id", PostTask)
route.get("/Task", GetTask)
route.put("/Task/:id", EditTask)
route.delete("/Task/:id", DeleteTask)

module.exports = route