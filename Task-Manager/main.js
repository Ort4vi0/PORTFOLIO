const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const route = require('./src/Routes/route')
require("dotenv").config();

const app = express()
const port = process.env.port

async function MainServer(){
    try{
        await mongoose.connect(process.env.db)
        console.log('Conectado com sucesso ao MONGODB')
        mongoose.connection.on("error", (err) => {
            console.error(`Erro de conexão ${err.message}`)
        })
        
        app.use(cors())
        app.use(express.json())
        
        // Servir arquivos estáticos do frontend
        app.use(express.static('frontend'))
        
        app.use(route)

        app.listen(port, () => {
            console.log(`Servidor inciado na porta ${port}`)
            console.log(`Frontend disponível em: http://localhost:${port}`)
        })
    }catch(error){
        console.error("Falha na conexao", error)
        process.exit(1)
    }
}

MainServer()