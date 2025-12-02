const express = require('express')
const { loginController, registerController } = require('./aut.controller')

const authRouter = express.Router()

authRouter.post('/registro', registerController)
authRouter.post('/login', loginController)

module.exports = {authRouter}