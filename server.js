const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()

const { authRouter } = require('./1autentificacion/aut.router')
const { adminRouter } = require('./2administrativo/admin.router.js')
const { clasesRouter } = require('./2administrativo/clases.router.js')
const { alumnRouter } = require('./3alumnos/alumn.router.js')
const { profRouter } = require("./4profesores/prof.router.js")

const { connectToDatabase } = require("./config/coneccion.mongodb.js");


const PORT = process.env.PORT || 4000
const app = express()

// Conecta a la base de datos de MongoDB
connectToDatabase();

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/clases', clasesRouter)
app.use('/api/alumno', alumnRouter)
app.use('/api/profesor', profRouter)

app.listen(PORT, () =>{
    console.log('Nuestra aplicacion se ejecuta en el puerto: ' + PORT)
})
