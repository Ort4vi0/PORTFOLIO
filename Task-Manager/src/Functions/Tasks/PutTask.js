const { default: mongoose } = require("mongoose")
const TaskMGS = require("../../Schemas/TaskSchema")
const { RetornarErro, RetornarSucesso } = require("../../Utils/utils")

async function EditTask(req,res) {
    try{
        const id = req.params.id
        const Dados = req.body

        const Verify = mongoose.Types.ObjectId.isValid(id)
        if(!Verify){
            return RetornarErro(res, "ID de Task invalido", 404)
        }

        const TaskEdit = await TaskMGS.findByIdAndUpdate(id, Dados)
        RetornarSucesso(res, "Task editada", 200, TaskEdit)
    } catch(error){
        console.error(error);
        return RetornarErro(res, "Erro interno")
    }
}

module.exports = {EditTask}