const mongoose = require("mongoose")


const personaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String,
        required: true,
        trim: true,
    },
    dni: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fecha_de_nacimiento: {
        type: Date,
        required: true,
    },
})

module.exports = { personaSchema }


