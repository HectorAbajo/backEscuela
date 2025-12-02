const { Usuario } = require('../modelos.schema/schemaUsuario')

const findUserByEmailRepo = async (email)=> {
    try {
        return await Usuario.findOne({email: email})
    } catch (error) {
        console.error('MONGODB_Error al buscar usuario por email en el repositorio', error)
        throw { status: 500, message: 'Error interno en el servidor al BUSCAR USUARIOS POR EMAIL REPO_AUTH' }
    }
}

const insertUserRepo = async (userData)=> {
    try {
        const newUser = new Usuario(userData)
        await newUser.save()
        return newUser
    } catch (error) {
        console.error('MONGODB_Error al insertar un usuario en el repositorio', error)
        throw { status: 500, message: 'Error interno en el servidor al INSERTAR USUARIO REPO_AUTH' }
    }
}



module.exports = {findUserByEmailRepo, insertUserRepo}