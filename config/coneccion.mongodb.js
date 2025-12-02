const mongoose = require('mongoose')

// Se construye el URI de conexión utilizando las variables de entorno para mayor seguridad
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xcha8ak.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`

// Se encapsula la lógica de conexión en una función asíncrona
const connectToDatabase = async () =>{
    try {
        await mongoose.connect(URI)
        console.log('Conexión exitosa a MongoDB')
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message)
        // Si hay un error, el proceso se cierra con un código de error
        process.exit(1)
    }
}

module.exports = { connectToDatabase }
