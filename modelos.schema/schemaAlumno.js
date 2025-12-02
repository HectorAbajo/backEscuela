const mongoose = require("mongoose")
const { personaSchema } = require('./schemasPersona')

const alumnoSchema = new mongoose.Schema({
    ...personaSchema.obj,
    materiasAlistadas: [{
        materia: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Materia',
            required: true
        },
        notas: [{ 
            periodo: {
                type: String,
                required: true,
                trim: true,
            },
            valor: {
                type: Number,
                required: true 
            }
        }]
    }],
})

const Alumno = mongoose.model('Alumno', alumnoSchema)

module.exports = { Alumno }