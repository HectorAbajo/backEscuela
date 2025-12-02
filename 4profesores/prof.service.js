const { getSubjectsByProfessorService } = require("../2administrativo/admin.service")
const { studentBySubjectRepo, getAllMyStudentsRepo } = require("./prof.repository")


const studentBySubjectService = async (data)=>{
    try {
        const {profesorId, subjectId} = data
        const subjectThisProfessor = await getSubjectsByProfessorService({profesorId: profesorId})
        const subjectAsignedExisting = subjectThisProfessor.subjects.find(subject => subject._id.equals(subjectId))
        if(!subjectAsignedExisting){
            throw {status: 403, message: `La materia ${subjectId} no te a sido Asignada aun`}
        }
        const students = await studentBySubjectRepo(subjectId)
        if(students.length === 0){
            throw {status: 404, message: 'No tienes estudiantes Alistados'}
        }

        return {ok: true, students: students} 
        
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al OBTENER ESTUDIANTES ALISTADOS SERVICE_PROFE' }
    }
}

const getAllMyStudentsService = async (data)=>{
    try {
        const {professorId} = data
        const mySubjects = await getSubjectsByProfessorService({profesorId: professorId})
        if(mySubjects.length === 0){
            throw {status: 404, message:'No tienes materias asigandas todavia'}
        }
        const myStudents = await getAllMyStudentsRepo(mySubjects)
        if(myStudents.length === 0){
            throw {status: 404, students: []}
        }

        return {ok: true, students: myStudents} 
             
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al OBTENER ESTUDIANTES POR PROFESOR SERVICE_PROFE'}
    }
}

const subjectsHoursService = async (data)=>{
    try {
        const {professorId} = data
        const mySubjects = await getSubjectsByProfessorService({professorId: professorId})
        if(mySubjects.length === 0){
            return {ok: true, totalHours: 0}
        }
        const myTotalHours = mySubjects.reduce((accumulator, subject)=>{
            return accumulator + subject.horas
        }, 0)

        return {ok: true, totalHours: myTotalHours}

    } catch (error) {
       if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al OBTENER HORAS DE MATERIAS SERVICE_PROFE'} 
    }
}

const assigsGradesService = async (data)=>{
    try {
        const {studentId, subjectId, periodo, valor} = data
        const result = await findStudentByIdService({ studentId: studentId })
        const student = result.user
        const subjectToUpdate = student.materiasAlistadas.find((subject) => subject.materia._id.equals(subjectId))
        if (!subjectToUpdate) {
            throw {status: 404, message: `El alumno no está alistado en la materia con ID: ${subjectId}`}
        }
        const newGrade = {
            periodo: periodo,
            valor: valor,
        }
        const updateResult = await assigsGradesRepo({studentId, subjectId, newGrade})
           
        return { ok: true, message: 'Nota asignada exitosamente.', updatedStudent: updateResult };

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al asignar notas'}
    }
}

module.exports = {studentBySubjectService, getAllMyStudentsService, subjectsHoursService, assigsGradesService}