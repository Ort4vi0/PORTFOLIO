const ProjectMGS = require("../../Schemas/ProjectSchema");
const { RetornarSucesso, RetornarErro } = require("../../Utils/utils");

async function GetProject(req,res) {
    try{
    const Projects = await ProjectMGS.find(req.query)
    RetornarSucesso(res, Projects)
    } catch(error){
        console.error(error)
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {GetProject}