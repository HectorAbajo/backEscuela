const mongoose = require("mongoose")
const { personaSchema } = require('./schemasPersona')

const administrativoSchema = new mongoose.Schema({
    ...personaSchema.obj, 
    cargo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cargo',
        required: true
    },
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

const Administrativo = mongoose.model('Administrativo', administrativoSchema)

module.exports = { Administrativo }