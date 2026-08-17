const { validateExistence } = require("../../1autentificacion/utilsAuth/validation")
const { verifyExistenceCourse } = require("./verifyExistenceCourse")
const { findSubjectByIdService, findMemberService } = require("../../utilsEscuela/escuela")

const validateClase = (classData) => {
    const { curso, materia, dia_semana, hora_ordinal } = classData
    
    if (!validateExistence(curso)) {
        throw { status: 400, message: 'El ID del curso es requerido' }
    }
    if (!validateExistence(materia)) {
        throw { status: 400, message: 'El ID de la materia es requerido' }
    }
    if (!validateExistence(dia_semana)) {
        throw { status: 400, message: 'El día de la semana es requerido' }
    }
    if (!validateExistence(hora_ordinal)) {
        throw { status: 400, message: 'La hora ordinal es requerida' }
    }

    const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    if (!diasValidos.includes(dia_semana.toLowerCase())) {
        throw { status: 400, message: `El día debe ser uno de: ${diasValidos.join(', ')}` }
    }

    if (typeof hora_ordinal !== 'number' || hora_ordinal < 1) {
        throw { status: 400, message: 'La hora ordinal debe ser un número positivo' }
    }

    return true
}

const validateProfessorRole = (role) => {
    const rolesValidos = ['titular', 'suplente']
    if (!rolesValidos.includes(role)) {
        throw { status: 400, message: `El rol del profesor debe ser: ${rolesValidos.join(' o ')}` }
    }
    return true
}

module.exports = { validateClase, validateProfessorRole }
