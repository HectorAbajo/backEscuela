const { Alumno } = require("../modelos.schema/schemaAlumno");
const { Materia } = require("../modelos.schema/schemaMateria");


const getSubjectsByCourseRepo = async (curso)=>{
    try {
        return await Materia.find({ curso: curso })
    } catch (error) {
        console.error('MONGODB_Error al obtener materias por curso y turno', error)
        throw { status: 500, message: 'Error interno en el servidor al OBTENER MATERIAS POR CURSO Y TURNO REPO_ALUMNO' }
    }
}

const enrollSubjectRepo = async (email, subjectToEnroll)=>{
    try {
        const result = await Alumno.updateOne(
            { email: email },
            { $push: { materiasAlistadas: { materia: subjectToEnroll }}}
        )
        return result
    } catch (error) {
        console.error('MONGODB_Error al alistar materia en el repositorio', error)
        throw { status: 500, message: 'Error interno en el servidor al ALISTAR MATERIA EN ALUMNO REPO_ALUMNO' }
    }
}

const unenrollSubjectRepo = async (email, subjectToUnenroll)=>{
    try {
        const result = await Alumno.updateOne(
            { email: email },
            { $pull: { materiasAlistadas: { _id: subjectToUnenroll._id }}}
        )
            return result
    } catch (error) {
        console.error('MONGODB_Error al eliminar materia del repositorio', error)
        throw { status: 500, message: 'Error interno en el servidor al DESALISTAR MATERIA EN ALUMNO REPO_ALUMNO' }
    }
}

const getGradesRepo = async ()=>{
    try {
        // Lógica para obtener notas
    } catch (error) {
        console.error('MONGODB_Error al consultar notas en el repositorio', error)
        throw { status: 500, message: 'Error interno en el servidoR al OBTENER NOTAS REPO_ALUMNO' }
    }
}


module.exports = {getSubjectsByCourseRepo, enrollSubjectRepo, unenrollSubjectRepo, getGradesRepo}