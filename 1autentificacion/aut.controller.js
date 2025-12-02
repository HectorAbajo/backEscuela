const jwt = require('jsonwebtoken')
const { registerService, loginService } = require('./aut.service')

const registerController = async (req,res)=> {
    try {
        const result = await registerService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ error: error.message || 'Error interno del servidor_registerController' })
    }
}

const loginController = async (req,res)=> { 
    try {
        const result = await loginService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ error: error.message || 'Error interno del servidor_loginController' })
    }
}

const verifyTokenController = (req, res)=> {
    const token = req.headers['authorization']
    try {
        if (!token){
            throw { status: 400, message: 'Debes proporcionar un token válido' }
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY)
        res.status(200).json({ status: 200, message: 'Token válido, usuario logueado' })
    } catch (error) {
        const status = error.name === 'JsonWebTokenError' ? 401 : error.status || 500
        const message = error.name === 'JsonWebTokenError' ? 'Sin autorización, token inválido' : error.message || 'Error interno del servidor_verifyTokenController'
        res.status(status).json({ error: message })
    }
}

const verifyStatusController = async (req, res)=> {
    try {
        const result = await verifyStatusService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ error: error.message || 'Error interno del servidor_verifyStatusController' })
    }
}


module.exports = {verifyStatusController, verifyTokenController, registerController, loginController}