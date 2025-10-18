const { default: mongoose } = require("mongoose")
const ProjectMGS = require("../../Schemas/ProjectSchema")
const { RetornarSucesso, RetornarErro } = require("../../Utils/utils")

async function EditProject(req,res) {
    try{
        const id = req.params.id
        const Dados = req.body

        const Verify = mongoose.Types.ObjectId.isValid(id)
        if(!Verify){
            return RetornarErro(res, "ID de Projeto invalido", 404)
        }

        const ProjectModify = await ProjectMGS.findByIdAndUpdate(id, Dados, {
            new: true,
            runValidators: true
        })
        RetornarSucesso(res, "Projeto modificado", 200, ProjectModify)
    } catch(error){
        console.error(error)
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {EditProject}