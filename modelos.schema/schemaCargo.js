const mongoose = require("mongoose")

const cargoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 15,
    },
})
const Cargo = mongoose.model('Cargo', cargoSchema)

module.exports = { Cargo }
