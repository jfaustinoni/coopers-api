require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const taskRoutes = require('./routes/taskRoutes')
const emailRoutes = require('./routes/emailRoutes')

const app = express()

app.use(express.json())
app.use(cors());

app.use('/auth', authRoutes) 
app.use('/user', userRoutes) 
app.use('/tasks', taskRoutes)
app.use('/email', emailRoutes)

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-coopers.gzdwyhv.mongodb.net/`
)
.then(() => { 
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000')
    })
})
.catch((err) => console.error('Erro ao conectar ao banco de dados:', err))