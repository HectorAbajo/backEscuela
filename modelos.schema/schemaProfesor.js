const mongoose = require("mongoose")
const { personaSchema } = require('./schemasPersona')

const profesorSchema = new mongoose.Schema({
    ...personaSchema.obj, 
    fechas_de_actividad: [{
        fecha_inicio: {
            type: Date,
            required: true
        },
        fecha_fin: {
            type: Date,
            required: false 
        }
    }]
})

const Profesor = mongoose.model('Profesor', profesorSchema)

module.exports = { Profesor }