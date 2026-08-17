const { addMemberDataRepo, updateMemberRepo, deleteMemberRepo, assignStatusRepo,getSubjectsByProfessorRepo, getAllSubjectsRepo, findSubjectRepo, findSubjectByCourseRepo, createSubjectRepo,updateSubjectRepo, assignOrUpdateHoursInProfRepo, unassignTitularInSubjectRepo, unassignSuplenteInSubjectRepo, deleteSubjectRepo, createCourseRepo, deleteCourseRepo, unassignSubjectFromAllProfessorsRepo} = require("./admin.repository")
const { verifyExistenceCourse } = require("./utilsAdmin/verifyExistenceCourse")
const { updateStudentSubjectInfo, manageProfessorRole} = require("./utilsAdmin/alta.baja.prof.mat")
const { findUserByEmailService, findMemberService, findSubjectByIdService } = require("../utilsEscuela/escuela")


const testService = async (data)=>{
    try {
        const {professorId, subjectId, hours, action} = data
        const professorExisting = await findMemberService({tabla: "profesor", id: professorId})        
        const subjectExisting = await findSubjectByIdService({subjectId: subjectId})
        if(!professorExisting.ok) throw {status: professorExisting.status, message: professorExisting.message}
    
        const hoursExisting = professorExisting.user.horas_docencia.titular.find((e)=> e.materia.equals(subjectId))
        
        
        return {status:200, ok: true, horas: currentHours}
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: `Error interno del servidor  TESTSERVICE_ADMIN`}
    }
}


/* MIEMBRO */


const addMemberDataService = async (data)=>{
    try {
        const {tabla, nombre, apellido, dni, email, fecha_de_nacimiento} = data
        const existingMember = await findMemberService({tabla: tabla, email: email})
        if(existingMember.ok){
            throw {status: 409, message: `${email} ya está Registrado`}
        }
        const member = {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            email: email,
            fecha_de_nacimiento: fecha_de_nacimiento,
        }
        const newMember = await addMemberDataRepo(tabla, member)
        const result = await findUserByEmailService({email: email})
        if(result.ok){
            const userExisting = result.user
            await assignStatusService({email: email, status: userExisting.rol}) 
        }

        return {ok: true, user: newMember}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: `Error interno del servidor al AGREGAR ${tabla} SERVICE_ADMIN`}
    }
}

const updateMemberDataService = async (data)=>{
    try {
        const {tabla, memberId, datosActualizar} = data
        const resultFindMember = await findMemberService({tabla: tabla, id: memberId})
        if(!resultFindMember.ok){
            throw {status: resultFindMember.status, message: resultFindMember.message}
        }
        const member = await updateMemberRepo(tabla, id, datosActualizar)
        
        return {ok: true, user: member}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: `Error interno del servidor al ACTUALIZAR ${tabla} SERVICE_ADMIN`}
    }
}

const deleteMemberService = async (data) => {
    try {
        const {tabla, email} = data
        const resultFindMember = await findMemberService({tabla: tabla, email: email})
        if(!resultFindMember.ok){
            throw { status: resultFindMember.status, message: resultFindMember.message}
        }
        const member = resultFindMember.user
        if(tabla === "profesor"){
            const result = await getSubjectsByProfessorService({professorId: member.id})
            const subjectsToUpdate = result.subjects
            await Promise.all(subjectsToUpdate.map(async (subject)=>{
                await unassignTitularInSubjectRepo(subject._id, member.id)
                await unassignSuplenteInSubjectRepo(subject._id, member.id)
            }))
        }
        await deleteMemberRepo(tabla, member.id)
        await assignStatusService({email: member.email, status: ""})

        return {ok: true, message: `${tabla}  eliminado correctamente`}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: `Error interno del servidor al ELIMINAR ${tabla} SERVICE_ADMIN`}
    }
}

const assignStatusService = async (data)=>{
    try {  
        const {email, status}= data
        const existingUser = await findUserByEmailService({email: email})
        if(!existingUser.ok){
            return {status: existingUser.status, message: existingUser.message}
        }
        await assignStatusRepo(existingUser.user.email, status)

        return {ok:true, status:200, message: "Status Asignado correctamente"} 

    } 
    catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al ASIGNAR STATUS SERVICE_ADMIN'}
    }
}

/* PROFESOR */

const updateHoursFromSubjectService = async (data) =>{
    try {
        const {professorId, subjectId} = data
        const subject = await findSubjectByIdService({subjectId: subjectId})
        const professor = await findMemberService({tabla: 'profesor', id: professorId})
        if(!professor){
            throw {status: 400, message: 'Faltan IDs de profesor'}
        }
        const result = await assignOrUpdateHoursInProfRepo(data)

        let message = ''
        if (result.status === 'assigned'){
            message = `Se asignaron las horas de la materia: ${subject.subject.nombre} al profesor: ${professor.user.email}`
        } else if(result.status === 'updated'){
            message = `Se actualizaron las horas de la materia: ${subject.subject.nombre} para el profesor:${professor.user.email} `
        } else if(result.status === 'removed'){
            message = `Se eliminó la materia: ${subject.subject.nombre} del profesor: ${professor.user.email} ya que sus horas llegaron a 0`
        }

        return {ok: true, message: message}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al ACTUALIZAR HORAS DE MATERIA'}
    }
}


const getSubjectsByProfessorService = async (data)=>{
    try {
        const {professorId} = data
        const subjectsByprofessor = await getSubjectsByProfessorRepo(professorId)
        if(subjectsByprofessor.length === 0){
            throw {status: 404, message:`No se encontraron Materis Asignadas a este Profesor ID:${professorId}`}
        }

        return {ok: true, subjects: subjectsByprofessor}
        
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del dervidor al OBTENER MATERIAS POR PROFESOR SERVICE_ADMIN'}
    }
}

/* MATERIA */

const getAllSubjectsService = async ()=>{
    try {
        const subjects = await getAllSubjectsRepo()
        if(subjects.length === 0){
            throw { status: 404, message: 'No se encontraron materias' }
        }

        return {ok: true, subjects: subjects}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al OBTENER TODAS LA MATERIAS SERVICE_ADMIN'}
    }
}

const findSubjectService = async (data)=>{
    try {
        const {nombre, curso} = data
        const subject = await findSubjectRepo(nombre, curso)
        if(!subject){
            return {status: 404, message:`No hay Materia con Nombre: ${nombre}, Curso: ${curso}`}
        }

        return {ok: true, subject: subject}

    } catch (error) {
        if(error.status) throw{error}
        throw {status:500, message: 'Error interno del servidor al BUSCAR MATERIA POR NOMBRE/CURSO/TURNO SERVICE_ADMIN'}
    }
}

const findSubjectByCourseService = async (data)=>{
    try {
        const {courseId} = data
        const result = await findSubjectByCourseRepo(courseId)
        if(!result){
            throw {status: 404, message: `No se encontraron Materias con el CURSO_ID: ${courseId} `}
        }

        return {ok: true, subjects: result}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al BUSCAR MATERIA POR CURSO SERVICE_ADMIN'}
    }
}

const createSubjectService = async (data)=>{
    try {
        const {nombre, curso} = data
        const existingSubject = await findSubjectService({nombre: nombre, curso: curso})
        if(existingSubject.ok){
            throw {status: 409, message: `La materia ya existe con estos parámetros NOMBRE: ${nombre}, CURSO: ${curso}`}
        }
        const newSubject = await createSubjectRepo(data)
    
        return {ok: true, subject: newSubject, message: `Se creo la materia NOMBRE: ${nombre}, CURSO: ${curso}`}

    } catch (error) {
        if(error.status){throw error}
        throw { status: 500, message: 'Error interno del servidor al CREAR MATERIA SERVICE_ADMIN' }
    }
}

const updateSubjectService = async (data)=>{
    try {
        const { subjectId, updatedData } = data
        await findSubjectByIdService({subjectId: subjectId})
        const updatedSubject = await updateSubjectRepo(subjectId, updatedData)

        return {ok: true, subject: updatedSubject}

    } catch (error) {
        if(error.status){
            throw error
        }
        throw { status: 500, message: 'Error interno del servidor_updateSubjectService' }
    }
}

const deleteSubjectService = async (data)=>{
    try {
        const { subjectId } = data
        await findSubjectByIdService({subjectId: subjectId})
        const deletedSubject = await deleteSubjectRepo(subjectId)
        await updateStudentSubjectInfo(subjectId)
        await unassignSubjectFromAllProfessorsRepo(subjectId)

        return {ok:true, message: "Materia eliminada exitosamente", materia_eliminada: deletedSubject}

    } catch (error) {
        if (error.status) {throw error}
        throw {status: 500, message: 'Error interno del servidor al ELIMINAR MATERIA SERVICE_ADMIN'}
    }
}


/* CURSO */

const createCourseService = async (data)=>{
    try {
        const {nombre, turno, carga_horaria} = data
        const cursoExistente = await verifyExistenceCourse({nombre: nombre, turno: turno})
        if(cursoExistente.ok){
            throw {status: 409, message: `El curso ya existe con ese NOMBRE: ${nombre}  y TURNO: ${turno}`}
        }
        const newCourse = await createCourseRepo(nombre, turno, carga_horaria)
        
        return {ok:true, course: newCourse}

    } catch (error){
        if (error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al CREAR CURSO SERVICE_ADMIN'}
    }
}

const deleteCourseService = async (data)=>{
    try {
        const {courseId} = data
        const resultFind = await findSubjectByCourseService({courseId: courseId})
        const existenceCourse = await verifyExistenceCourse({id: courseId})
        if(!existenceCourse.ok){
            throw {status: 409, message: `No existe curso con ID: ${courseId}`}
        }
        if(resultFind.ok){
            const subjectsForDelete = resultFind.subjects
            subjectsForDelete.map(async (subject)=> await deleteSubjectService(subject._id))
        }

        await deleteCourseRepo(courseId)
        
        return {ok: true, status: 200, message: "Curso eliminado con éxito"}
        
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al ELIMINAR CURSO SERVICE_ADMIN'}
    }
}






module.exports = {addMemberDataService, updateMemberDataService, deleteMemberService, assignStatusService, updateHoursFromSubjectService, getSubjectsByProfessorService, getAllSubjectsService, findSubjectService, findSubjectByCourseService, createSubjectService, updateSubjectService, deleteSubjectService, createCourseService, deleteCourseService, testService}