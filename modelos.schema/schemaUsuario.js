const mongoose = require("mongoose")

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default: "",
        trim: true,
    }
});
const Usuario = mongoose.model('Usuario', usuarioSchema)

module.exports = { Usuario }