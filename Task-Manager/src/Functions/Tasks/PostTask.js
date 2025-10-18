const ProjectMGS = require("../../Schemas/ProjectSchema")
const TaskMGS = require("../../Schemas/TaskSchema")
const { RetornarSucesso, RetornarErro } = require("../../Utils/utils")

async function PostTask(req,res) {
    try {
        const projectid = req.params.id
        const Project = await ProjectMGS.findById(projectid)
        const Dados = req.body
        const newTask = TaskMGS.create({
            ...Dados,
            Project: projectid
        })
        RetornarSucesso(res, `Task Adicionada no Projeto: ${Project.Name}`,200, newTask)
    } catch (error) {
        console.error(error)
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {PostTask}