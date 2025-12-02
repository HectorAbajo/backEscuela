const mongoose = require("mongoose")

const cursoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 10
    },
    turno: {
        type: String,
        enum: ["mañana", "tarde", "noche"],
        default: "mañana",
        required: true,
        trim: true,
    },
    carga_horaria: {
        type: Number,
        min: 1,
        max: 40
    }
})
const Curso = mongoose.model('Curso', cursoSchema)

module.exports = { Curso }