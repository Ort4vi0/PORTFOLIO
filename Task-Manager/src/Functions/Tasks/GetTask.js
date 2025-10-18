const TaskMGS = require("../../Schemas/TaskSchema");
const { RetornarErro, RetornarSucesso } = require("../../Utils/utils");

async function GetTask(req,res) {
    try{
        const Tasks = await TaskMGS.find(req.query)
        RetornarSucesso(res, Tasks)
    } 
    catch(error){
        console.error(error)
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {GetTask}