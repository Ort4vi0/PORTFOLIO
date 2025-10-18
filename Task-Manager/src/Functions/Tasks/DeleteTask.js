const TaskMGS = require("../../Schemas/TaskSchema")
const { RetornarErro, RetornarSucesso } = require("../../Utils/utils")

async function DeleteTask(req,res) {
    try{
    const id = req.params.id
    const Verify = await TaskMGS.findById(id)
    if(!Verify){
        return RetornarErro(res, "Não foi possivel deletar a task pois ela nao existe")
    }
    const Delete = await TaskMGS.findByIdAndDelete(id)
    RetornarSucesso(res, "Task Removida", 200, Delete)
    } catch(error){
        console.error(error);
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {DeleteTask}