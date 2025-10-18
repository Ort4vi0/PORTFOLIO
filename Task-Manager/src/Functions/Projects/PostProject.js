const ProjectMGS = require("../../Schemas/ProjectSchema")
const { RetornarErro, RetornarSucesso } = require("../../Utils/utils")

async function AddProject(req,res){
    try{
        const Dados = req.body
        if(!Dados){
            return RetornarErro(res, "Dados incompletos! (Name e Description) Obrigatórios")
        }

        const NewProject = await ProjectMGS.create(Dados)
        RetornarSucesso(res, `Projeto ${Dados.Name} Criado!`, 200, NewProject)

    } catch(error){
        console.error(error)
        return RetornarErro(res, "Não foi possivel criar o projeto")
    }
}

module.exports = {AddProject}