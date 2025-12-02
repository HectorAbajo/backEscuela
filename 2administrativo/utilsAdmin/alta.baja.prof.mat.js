const { unenrollSubjectRepo } = require("../../3alumnos/alumn.repository")
const { unassignSubjectFromProfessorRepo, assignTitularInSubjectRepo, unassignSubjectTitularInProfRepo, unassignTitularInSubjectRepo, unassignSubjectSuplenteInProfRepo, unassignSuplenteInSubjectRepo, assignOrUpdateHoursInProfRepo, assignSuplenteInSubjectRepo } = require("../admin.repository")
const { getAllMembersService, findMemberService, findSubjectByIdService } = require("../../utilsEscuela/escuela")



const updateStudentSubjectInfo = async (subjectId) =>{
  try {
    const students = await getAllMembersService({tabla: "alumno"})
    if(students.ok){
      const updatedStudents = students.filter(student =>
      student.materiasAlistadas.some(enrolledSubject =>
      enrolledSubject.materia._id.equals(subjectId)
      ))
    await Promise.all(updatedStudents.map(async (student)=>{
      const index = student.materiasAlistadas.findIndex((e) => e.materia._id.equals(subjectId))
      const subjectToDelete = student.materiasAlistadas[index]
      await unenrollSubjectRepo(student.email, subjectToDelete)
    }))
    }

    return {ok: true, message: "Información de materia de los alumnos actualizada correctamente"}

  } catch (error){
    if(error.status){throw error}
    throw {status: 500, message: "Error interno del servidor en UTILS_UPDATE_STUDENT_SUBJECT_INFO"}
  }
}

const unassignSubjecFromtAllProfessors = async (subjectId) =>{
    try {
        const result = await getAllMembersService({tabla: "profesor"})
        if(result.ok){
            const professors = result.users
            const professorsToUpdate = professors.filter(prof =>
                prof.horas_docencia.titular.some(t => t.materia.equals(subjectId)) ||
                prof.horas_docencia.suplente.some(s => s.materia.equals(subjectId))
            )
            await Promise.all(professorsToUpdate.map(async (prof) =>{
                await unassignSubjectFromProfessorRepo(prof._id, subjectId)
            }))
        }
        return {ok: true, message: "Información de materia de los profesores actualizada correctamente"}
    } catch (error){
        if (error.status){throw error}
        throw {status: 500, message: "Error interno del servidor en UTILS_UNASSIGN_PROFESSORS_FROM_SUBJECT"}
    }
}


// const manageProfessorRole = {

//   _existenceSubject: async (subjectId) =>{ return await findSubjectByIdService({subjectId: subjectId._id})},
//   _existenceProfesor: async (professorId) =>{ 
//     const result = await findMemberService({tabla: "profesor", id: professorId._id}) 
//     if(!result){throw {status: result.status, message: result.message}} 
//     return result
//   },

//   _isTuitular: async (profesorId, subject) =>{return subject.profesorTitular.some(prof => prof._id.equals(profesorId))},
//   _isSuplente: async (profesorId, subject) =>{return subject.profesorSuplente.some(prof => prof._id.equals(profesorId))},

// addTitular: async (professor, subject, hours) =>{
//     try {
//       await manageProfessorRole._existenceProfesor(professor._id)
//       await manageProfessorRole._existenceSubject(subject._id)
//       const isTitular = await manageProfessorRole._isTuitular(professor._id, subject)
//       const isSuplente = await manageProfessorRole._isSuplente(professor._id, subject)

//       if(isTitular){
//         throw {status: 400, message: "Ya eres Titular de esta Materia"}
//       }
//       if(isSuplente){
//         await manageProfessorRole.removeSuplente(professor, subject)
//       }
//       await assignTitularInSubjectRepo(subject._id, professor._id)
//       const newSubjectHours = {materia: subject._id, horas: hours}
//       await assignOrUpdateHoursInProfRepo(professor._id, newSubjectHours, "titular")

//       return {ok: true, message: "Se dio de alta a un Profesor Titular en la Materia"}

//     } catch (error){
//       if (error.status) throw error
//       throw {status: 500, message: 'Error interno del servidor en UTILS_ADD_TITULAR'}
//     }
//   },

//   removeTitular: async (professor, subject) =>{
//     try {
//       await manageProfessorRole._existenceProfesor(professor._id)
//       await manageProfessorRole._existenceSubject(subject._id)
//       const isTitular = await manageProfessorRole._isTuitular(professor._id, subject)

//       if(!isTitular){
//         throw {status: 404, message: "No eres Titular de esta Materia"}
//       }

//       await unassignSubjectTitularInProfRepo(professor._id, subject._id)
//       await unassignTitularInSubjectRepo(subject.id, professor._id)

//       return {ok: true , message :"Se dio de baja a un Profesor Titular en la Materia"}

//     } catch (error){
//       if(error.status) throw error
//       throw {status: 500, message: 'Error interno del servidor en UTILS_REMOVE_TITULAR'}
//     }
//   },

//    addSuplente: async (professor, subject, hours) =>{
//     try {
//       await manageProfessorRole._existenceProfesor(professor._id)
//       await manageProfessorRole._existenceSubject(subject._id)

//       const isTitular = await manageProfessorRole._isTuitular(professor._id, subject)
//       const isSuplente = await manageProfessorRole._isSuplente(professor._id, subject)

//       if(isTitular){
//         await manageProfessorRole.removeTitular(professor, subject)
//       }
//       if(isSuplente){
//         throw {status: 400, message: "Ya eres Suplente de esta Materia"}
//       }
//       await assignSuplenteInSubjectRepo(subject._id, professor._id)
//       const newSubjectHours = {materia: subject._id, horas: hours}
//       await assignOrUpdateHoursInProfRepo(professor._id, newSubjectHours, "suplente")

//       return {ok: true, message: "Se dio de alta a un Profesor Suplente en la Materia"}

//     } catch (error){
//       if(error.status) throw error
//       throw {status: 500, message: 'Error interno del servidor en UTILS_ADD_SUPLENTE'}
//     }
//   },

//   removeSuplente: async (professor, subject) =>{
//     try {
//       await manageProfessorRole._existenceProfesor(professor._id)
//       await manageProfessorRole._existenceSubject(subject._id)
//       const isSuplente = await manageProfessorRole._isSuplente(professor._id, subject)

//       if(!isSuplente){
//         throw {status: 404, message: "No eres Suplente de esta Materia"}
//       }
//       await unassignSubjectSuplenteInProfRepo(professor._id, subject._id)
//       await unassignSuplenteInSubjectRepo(subject.id, professor._id)

//       return {ok: true , message :"Se dio de baja a un Profesor Suplente en la Materia"}

//     } catch (error) {
//       if(error.status) throw error
//       throw {status: 500, message: 'Error interno del servidor en UTILS_REMOVE_SUPLENTE'}
//     }
//   }
// }


module.exports = {updateStudentSubjectInfo, unassignSubjecFromtAllProfessors}