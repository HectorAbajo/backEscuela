const { findMemberService, findSubjectByIdService } = require("../utilsEscuela/escuela")
const { verifyExistenceCourse } = require("../2administrativo/utilsAdmin/verifyExistenceCourse")
const { getSubjectsByCourseRepo, unenrollSubjectRepo, enrollSubjectRepo } = require("./alumn.repository")



const getAllEnrolledSubjectsService = async (data)=>{
    try {
        const {email} = data
        const result = await findMemberService({tabla: "alumno", email: email})
        const student = result.user 
        const enrolledSubjects = student.materiasAlistadas
        if(enrolledSubjects.length === 0){
            throw { status: 404, message: `${student.nombre} ${student.apellido} No tienes materias alistadas` }
        }

        return {ok: true, enrolledSubjects: enrolledSubjects}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al OBTENER TODAS LAS MATERIAS ALISTADAS SERVICE_ALUMNO'}
    }
}

const getSubjectsByCourseService  = async (datos)=> {
    try {
        const { curso } = datos
        await verifyExistenceCourse({id: curso})
        const result = await getSubjectsByCourseRepo(curso)
        if(result.length === 0){
            throw {status: 404, message: `No hay materias para CURSO: ${curso}`}
        }

        return {ok: true, subjects: result}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al OBTENER MATERIA POR CURSO'}
    }
}

const enrollSubjectService = async (datos)=>{
    try {
        const {email, subjectId} = datos
        const resultSubjectExisting = await findSubjectByIdService({subjectId: subjectId})
        const subjectExisting = resultSubjectExisting.subject
        const result = await findMemberService({tabla: "alumno", email: email}) 
        if(!result.ok){
            throw {status: 409, message: result.message}
        }
        const student = result.user
        const existingErrolled = student.materiasAlistadas.some(subject => subject.materia._id.equals(subjectId))
        if (existingErrolled){
           throw { status:409, message: `El Alumno ${student.nombre} ${student.apellido} ya tiene la Materia ${subjectExisting.nombre} Curso: ${subjectExisting.curso}` }
        }    
        await enrollSubjectRepo(email, subjectExisting)

        return {ok: true, message: "Materia alistada exitosamente" }

    } catch (error) {
        if(error.status){throw error}
        throw { status: 500, message: 'Error interno del servidor al ALISTAR MATERIA SERVICE_ALUMNO' }
    }
}

const unenrollSubjectService = async (datos)=>{
    try {
        const { email, subjectId } = datos
        const result = await findMemberService({ tabla: "alumno", email: email })
        const student = result.user
        const subjectToUnenroll = student.materiasAlistadas.find(subject => subject.materia._id.equals(subjectId))
        if(!subjectToUnenroll){
            throw {status: 404, message: "El alumno no tiene dicha materia alistada"}
        }
        await unenrollSubjectRepo(email, subjectToUnenroll._id)
        
        return {ok: true, message: "Materia eliminada exitosamente"}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor_unenrollSubjectService'}
    }
}


module.exports = {getAllEnrolledSubjectsService, getSubjectsByCourseService, enrollSubjectService, unenrollSubjectService}