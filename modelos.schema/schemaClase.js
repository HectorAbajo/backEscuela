const mongoose = require("mongoose")

const claseSchema = new mongoose.Schema({
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },
    materia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },
    profesores_titulares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor'
    }],
    profesores_suplentes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor'
    }],
    profesor_actual: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesor'
    },
    dia_semana: {
        type: String,
        required: true,
        enum: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    },
    hora_ordinal: {
        type: Number,
        required: true,
        min: 1
    }
})

const Clase = mongoose.model('Clase', claseSchema)
module.exports = {Clase}