const mongoose = require("mongoose");
const { Curso } = require("./schemaCurso");


const materiaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 15,
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 25,
    }
})

const Materia = mongoose.model('Materia', materiaSchema);

module.exports = { Materia };