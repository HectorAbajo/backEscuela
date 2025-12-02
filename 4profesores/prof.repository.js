const { Alumno } = require("../modelos.schema/schemaAlumno")



const studentBySubjectRepo = async (subjectId)=>{
    try {
        const result = await Alumno.find({
            'materiasAlistadas.materia' : subjectId
        })

        return result
    } catch (error) {
         console.error('MONGODB_Error al obtener estudiantes por materia', error)
        throw {status: 500, message: 'Error interno en el servidor al OBTENER ESTUDIANTE POR MATERIA REPO_PROFE'}
    }
} 

const getAllMyStudentsRepo = async (subjectsId)=>{
        try {
        const result = await Alumno.find({
            'materiasAlistadas.materia': {$in: subjectsId}
        })
        return result
    } catch (error) {
         console.error('MONGODB_Error al obtener estudiantes por materia', error)
        throw {status: 500, message: 'Error interno en el servidor al OBTENER ESTUDIANTES POR PROFESOR REPO_PROFE'}
    }
}

const assigsGradesRepo = async (data)=>{
    try {
        const { studentId, subjectId, newGrade } = data
        const updatedStudent = await Alumno.findOneAndUpdate(
            { _id: studentId, "materiasAlistadas.materia": subjectId },
            { $push: { "materiasAlistadas.$.notas": newGrade } },
            { new: true }
        )
        if (!updatedStudent) {
            console.error('MONGODB_Error: No se pudo encontrar el alumno o la materia para actualizar la nota')
            throw {status: 404, message: 'No se encontró el alumno o la materia'}
        }

        return updatedStudent

    } catch (error) {
        console.error('MONGODB_Error al asignar notas en el repositorio:', error)
        throw {status: 500, message: 'Error interno del servidor al ASIGNAR NOTAS EN REPO_PROFE'}
    }
};

module.exports = {studentBySubjectRepo, getAllMyStudentsRepo}