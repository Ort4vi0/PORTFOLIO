const ProjectMGS = require("../../Schemas/ProjectSchema")
const { RetornarSucesso, RetornarErro } = require("../../Utils/utils")

async function DeleteProject(req,res) {
    try{
        const id = req.params.id
        const Verify = await ProjectMGS.findById(id)
        if(!Verify){
            return RetornarErro(res, "Não foi possivel deletar esse projeto, pois ele não existe", 404)
        }
        const Delete = await ProjectMGS.findByIdAndDelete(id)
        RetornarSucesso(res, "Projeto deletado com sucesso",200, Delete)
    } catch(error){
        console.error(error)
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {DeleteProject}