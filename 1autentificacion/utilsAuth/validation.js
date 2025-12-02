
const validateExistence = (value)=> {
    return Boolean(value)
}

const validateEmail = (email)=> {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)){
        throw { status: 400, message: "Formato de correo electrónico inválido" }
    }
    return true
}

const validateDni = (dni)=> {
    const dniRegex = /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/
    if (!dniRegex.test(dni)){
        throw { status: 400, message: "Formato de DNI inválido. Debe ser numérico y sin puntos" }
    }
    return true
}

const validateUser = (user) =>{
    if (!validateExistence(user.email)){
        throw { message: 'Email inexistente', status: 400 }
    }
    if (!validateExistence(user.password)){
        throw { message: 'Contraseña inexistente', status: 400 }
    }
    if (!validateEmail(user.email)){
        throw { message: 'Email incorrecto', status: 400 }
    }
    return true
}

const validateStatus = (status) =>{
    const validStatuses = ["director", "alumno", "profesor", "administrativo"]
    if (!validStatuses.includes(status)){
        throw { status: 400, message: 'Todavía no tienes autorización' }
    }
    return true
}

module.exports = { validateExistence, validateEmail, validateDni, validateUser, validateStatus }