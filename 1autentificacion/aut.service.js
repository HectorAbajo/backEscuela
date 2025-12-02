const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validateUser, validateStatus } = require('./utilsAuth/validation')
const { insertUserRepo } = require('./aut.repository')
const { assignStatusService } = require('../2administrativo/admin.service')
const { findUserByEmailService, findMemberService } = require('../utilsEscuela/escuela')


const registerService = async (userData) =>{
    try {
        const {email, password, rol} = userData
        validateUser({email, password})
        const existingUser = await findUserByEmailService({email: email})
        if(existingUser.ok){
            throw {status: 400, message: `El email ${email} ya está registrado`}
        }
        const passwordHash = await bcrypt.hash(password, 10)
        await insertUserRepo({email: email, password: passwordHash, rol: rol, status: ""})   
        const isMember = await findMemberService({tabla: rol, email: email})
        if(isMember.ok){
            await assignStatusService({email: email, status: rol})
        } 
        
        return {ok: true, message: 'Se insertó un nuevo usuario'}

    } catch (error) {
        if(error.status){throw error}
          throw {status: 500, message: 'Error interno del servidor al REGISTAR USUARIO SERVICE_AUTH'}  
    }
}

const loginService = async (userData)=> {
    try {
        const {email, password} = userData
        validateUser(userData)
        const result = await findUserByEmailService({email: email})
        if(!result.ok){
            throw {status: 409, messaje: result.message}
        }
        const existingUser = result.user
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect){
            throw {status: 400, message: 'Contraseña incorrecta'}
        }
        const hasStatus = validateStatus(existingUser.status)
        if (hasStatus){
            const token = jwt.sign({email, user_id: existingUser._id, rol: existingUser.rol, status: existingUser.status}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
            return {token, status: existingUser.status, email: existingUser.email, rol: existingUser.rol}
        }
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al LOGEAR USUARIO SERVICE_AUTH'}
    }
}



const verifyStatusService = async (data)=> {
    try {
        const {email} = data
        const result = await findUserByEmailService({email: email})
        const existingUser = result.user
        const hasStatus = validateStatus(existingUser.status)
        if(!hasStatus){
            throw {status: 400, message: 'Todavía no tienes autorización'}
        }

        return {ok: true, message: 'Estado verificado'}

    } catch (error){
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al VERIFICAR STATUS SERVICE_AUTH'}
    }
}

module.exports = {registerService, loginService, verifyStatusService}