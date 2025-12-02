const { searchCourseRepo } = require("../admin.repository")


const verifyExistenceCourse = async (query)=> {
    try {
        let result
        if(query.id){
            result = await searchCourseRepo({_id: query.id})
        }else if(query.nombre && query.turno){
            result = await searchCourseRepo({nombre: query.nombre, turno: query.turno})
        }else {
            throw {status: 400, message: 'Parametros de busqueda insuficientes'}
        }

        if(!result){
            return {status:409, message: 'Curso inexistente'}
        }
        
        return {ok: true, course: result}

    } catch (error){
        console.error('Error en la verificación de existencia del curso:', error)
        throw {status: 500, message: 'Error en la utilidad de verificar curso'}
    }
}

module.exports = {verifyExistenceCourse}