const { Alumno } = require("../modelos.schema/schemaAlumno")
const { Profesor } = require("../modelos.schema/schemaProfesor")
const { Administrativo } = require("../modelos.schema/shemaAdministrativo")
const { Usuario } = require("../modelos.schema/schemaUsuario")
const { Materia } = require("../modelos.schema/schemaMateria")
const { Curso } = require("../modelos.schema/schemaCurso")


const models = {
    "alumno": Alumno,
    "administrativo": Administrativo,
    "profesor": Profesor
}

const validateTable = (table)=>{
    const model = models[table]
    if(!model){
        throw {status: 400, message: `Tabla no válida: ${table}`}
    }
    return model
}

/* Miembro */
const getAllMembersRepo = async (table)=>{
    try {
        const model = validateTable(table)
        return await model.find()
    } catch (error) {
        console.error(`MONGODB_Error al obtener todos los ${table}/s del repositorio`, error)
        throw {status: 500, message: `Error interno del servidor_OBTENER TODOS LOS ${table}/s REPO_ADMIN`}
    }
}

const findMemberRepo = async (table, searchType, value)=>{
    try {
        const model = validateTable(table)
        if(searchType === 'email'){
            return await model.findOne({email: value})
        }
        if (searchType === 'id') {
            return await model.findById(value)
        }
        return null
    } catch (error) {
        console.error(`MONGODB_Error al buscar ${table} en el repositorio por ${searchType}`, error)
        throw {status: 500, message: `Error interno del servidor BUSCAR MIEMBRO POR ${searchType} REPO_ADMIN`}
    }
}

const addMemberDataRepo = async (table, member)=>{
    try {
        const model = validateTable(table)
        const newMember = new model(member)
        return await newMember.save()
    } catch (error) {
        if(error.status) throw error
        console.error(`MONGODB_Error al agregar ${table} en el repositorio`, error)
        throw {status: 500, message: `Error interno del servidor en AGEGAR ${table} REPO_ADMIN`}
    }
}

const updateMemberRepo = async (table, memberId, updateData)=>{
    try {
        const model = validateTable(table)
        return await model.findByIdAndUpdate(memberId, updateData, {new: true})
    } catch (error) {
        if(error.status) throw error
        console.error(`MONGODB_Error al actualizar ${table} en el repositorio`, error)
        throw {status: 500, message: `Error interno del servidor en ACTUALIZAR ${table} REPO_ADMIN`}
    }
}

const deleteMemberRepo = async (table, memberId)=>{
    try {
        const model = validateTable(table)
        return await model.findByIdAndDelete(memberId)
    } catch (error) {
        if(error.status) throw error
        console.error(`MONGODB_Error al eliminar ${table} en el repositorio`, error)
        throw {status: 500, message: `Error interno del servidor en ELIMINAR ${table} REPO_ADMIN`}
    }
}

const assignStatusRepo = async (email, status)=>{
    try {
        await Usuario.updateOne({email: email}, {$set:{status: status}})
    } 
    catch (error) {
        console.error('MONGODB_Error al Asignar Status en el reposotorio', error)
        throw {status: 500, message: 'Error interno en el servidor al ASIGNAR STATUS REPO_ADMIN'}
    }
}

/* PROFESOR */

const updateHoursInRepo = async (professorId, subjectId, newHours, role)=>{
    try {
        return await Profesor.findOneAndUpdate(
            {_id: professorId, [`horas_docencia.${role}.materia`]: subjectId},
            {$set: {[`horas_docencia.${role}.$.horas`]: newHours}},
            {new: true}
        )
    } catch (error) {
        console.error('MONGODB_Error al actualizar horas del profesor', error)
        throw {status: 500, message: 'Error interno del servidor ACTUALIZAR HORAS DEL PROFESOR REPO_ADMIN'}
    }
   
}

const getSubjectsByProfessorRepo = async (professorId)=>{
    try {

        return await Materia.find({
            $or: [{'profesorTitular': professorId},{'profesorSuplente': professorId}]
        })        
        
    } catch (error) {
        console.error('MONGODB_Error al obtener materias del profesor', error)
        throw {status: 500, message: 'Error interno del servidor OBTENER MATERIAS DEL PROFESOR REPO_ADMIN'}
    }
}

const getSubjectHoursFromProfessorRepo = async (professorId, subjectId, role) =>{
    const rolePath = `horas_docencia.${role}`
    const result = await Profesor.aggregate([
        { 
            $match: {_id: new mongoose.Types.ObjectId(professorId)} 
        },
        {
            $unwind: `$${rolePath}`
        },
        {
            $match: {[`${rolePath}.materia`]: new mongoose.Types.ObjectId(subjectId)}
        },
        {
            $project: {
                _id: 0,
                horas: `$${rolePath}.horas`
            }
        }
    ])
    if (result.length > 0){
        return result[0].horas
    } else {
        return 0
    }
}

const assignOrUpdateHoursInProfRepo = async (data) =>{
    try {
        const {professorId, subjectId, hours, action, role} = data
        const rolePath = `horas_docencia.${role}`

        const existingAssignment = await Profesor.findOne(
            {_id: professorId, [`${rolePath}.materia`]: subjectId},
            {[`${rolePath}.$`]: 1}
        )
        
        if(!existingAssignment){
            await Profesor.findByIdAndUpdate(
                professorId,
                {$push: {[rolePath]: { materia: subjectId, horas: hours }}},
                {new: true}
            )
            return {status: 'assigned'}
        } 
        
        const currentHours = existingAssignment.horas_docencia[role][0].horas
        let newHours = currentHours
        if(action === 'sumar'){
            newHours += hours
        } else if(action === 'restar'){
            newHours -= hours
        }

        if(newHours <= 0){
            await Profesor.findByIdAndUpdate(
                professorId,
                {$pull: {[rolePath]: {materia: subjectId}}},
                {new: true}
            )
            return {status: 'removed'}
        } else {
            await Profesor.findOneAndUpdate(
                {_id: professorId, [`${rolePath}.materia`]: subjectId},
                {$set: {[`${rolePath}.$.horas`]: newHours}},
                {new: true}
            )
            return {status: 'updated'}
        }

    } catch (error) {
        console.error('MONGODB_Error en el repositorio al ASIGNAR/ACTUALIZAR HORAS:', error)
        throw {status: 500, message: 'Error interno en el servidor'}
    }
}

const unassignSubjectInProfRepo = async (profesorId, subjectId, role) =>{
    try {
        const rolePath = `horas_docencia.${role}`
        return await Profesor.findOneAndUpdate(
            profesorId,
            {$pull: {[rolePath]: {materia: subjectId}}},
            {new: true}
        )

    } catch (error) {
        console.error(`MONGODB_Error al desasignar ${role} de Horas_Docencia en el repositorio`, error)
        throw {status: 500, message: `Error interno en el servidor al DESASIGNAR ${role.toUpperCase()} HORAS_DOCENCIA REPO`}
    }
}

const unassignSubjectFromProfessorRepo = async (professorId, subjectId)=>{
    try {
        await Profesor.updateOne(
            {_id: professorId},
            {
                $pull: {
                    "horas_docencia.titular": {materia: subjectId},
                    "horas_docencia.suplente": {materia: subjectId}
                }
            }
        )
    } catch (error) {
        console.error('MONGODB_Error al desvincular materia al profesor en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al DESVINCULAR MATERIA A PROFESOR REPO_ADMIN'}
    }
}

const unassignSubjectFromAllProfessorsRepo = async (subjectId) => {
    try {
        const result = await Profesor.updateMany(
            {
                $or: [
                    { 'horas_docencia.titular.materia': subjectId },
                    { 'horas_docencia.suplente.materia': subjectId }
                ]
            },
            {
                $pull: {
                    'horas_docencia.titular': { materia: subjectId },
                    'horas_docencia.suplente': { materia: subjectId }
                }
            }
        )
        if (result.modifiedCount > 0) {
            return {ok: true, message: `Se desasignó la materia de ${result.modifiedCount} profesores`}    
        } else {
            return {ok: true, message: `La materia no estaba asignada a ningún profesor`}
        }
        
    } catch (error){
        console.error('Error al desasignar materia de todos los profesores:', error);
        throw {status: 500, message: "Error interno del servidor al desasignar materia de los profesores"}
    }
}


/* Curso */

const createCourseRepo = async (nombre, turno, carga_horaria)=>{
    try {
        const newCourse = new Curso({
            nombre: nombre,
            turno: turno,
            carga_horaria: carga_horaria
        })
        const savedCourse = await newCourse.save()
        return savedCourse
    } catch (error){
        console.error('MONGODB_Error Crear Curso en el repositorio', error)
        throw {status: error.status || 500, message: error.message || 'Error interno en el servidor al CREAR CURSO REPO_ADMIN'}
    }
}

const deleteCourseRepo = async (idCurso)=>{
    try { 
        const result = await Curso.deleteOne({_id: idCurso})
        return result
    } catch (error) {
        console.error('MONGODB_Error Eliminar Curso en el repositorio', error)
        throw {status: 500, message: 'Error interno en el servidor al ELIMINAR CURSO REPO_ADMIN'}
    }
}

/* Materia */

const getAllSubjectsRepo = async ()=>{
    try {
        return await Materia.find()
    } catch (error) {
        console.error('MONGODB_Error al obtener todas las materias en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al OBTENER TODAS LAS MATERIAS REPO_ADMIN'}
    }
}

const findSubjectRepo = async (nombre, curso )=>{
    try {
        return await Materia.findOne({
            nombre: nombre,
            curso: curso,
        })
    } catch (error) {
        console.error('MONGODB_Error al buscar la materia en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al BUSCAR MATERIA REPO_ADMIN'}
    }
}

const findSubjectByIdRepo = async (subjectId)=>{
    try {
        return await Materia.findById(subjectId)
    } catch (error) {
        console.error('MONGODB_Error al buscar la materia por ID en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al BUSCAR MATERIA POR ID REPO_ADMIN'}
    }
}

const findSubjectByCourseRepo = async (courseId)=>{
    try {
        return await Materia.find({curso: courseId})
    } catch (error) {
        console.error('MONGODB_Error al buscar la materia por CURSO en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al BUSCAR MATERIA POR CURSO REPO_ADMIN'}
    }
}

const createSubjectRepo = async (newSubjectData)=>{
    try {
        const newSubject = new Materia(newSubjectData)
        return await newSubject.save()
    } catch (error){
        if(error._message){
            throw {status: 409, message: "La carga Horaria de la Materia no debe superar la carga del curso  " +error._message}
        }
        console.error('MONGODB_Error al crear la materia en el repositorio', error._message)
        throw {status: 500, message: 'Error interno del servidor al CREAR MATERIA REPO_ADMIN'}
    }
}

const assignTitularInSubjectRepo = async (subjectId, profesorId)=>{    
    try {
        return await Materia.findByIdAndUpdate( 
            subjectId,
            {$push: {profesorTitular: profesorId}},
            {new: true}
        )

    } catch (error) {
        console.error('MONGODB_Error al asignar titular en el repositorio', error);
        throw {status: 500, message: 'Error interno del servidor al ASIGNAR TITULAR REPO_ADMIN'}
    }
}

const unassignTitularInSubjectRepo = async (subjectId, professorId)=>{
    try {
        return await Materia.findByIdAndUpdate(
            subjectId,
            {$pull: {profesorTitular: professorId}},
            {new: true}
        )
        
    } catch (error) {
        console.error('MONGODB_Error al desasignar titular en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor DESASIGNAR TITULAR REPO_ADMIN'}
    }
}

const assignSuplenteInSubjectRepo = async (subjectId, newSuplenteList)=>{
    try {
        return await Materia.findByIdAndUpdate(
            subjectId, 
            {profesorSuplente: newSuplenteList}, 
            {new: true}
        )

    } catch (error) {
        console.error('MONGODB_Error al asignar suplente en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor ASIGNAR SUPLENTE REPO_ADMIN'}
    }
}

const unassignSuplenteInSubjectRepo = async (subjectId, professorId)=>{
    try {
        return await Materia.findByIdAndUpdate(
            subjectId, 
            {$pull: {profesorSuplente: professorId}},
            {new: true}
        )

    } catch (error) {
        console.error('MONGODB_Error al desasignar suplente en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al DESASIGNAR SUPLENTE REPO_ADMIN'}
    }
}

const updateSubjectRepo = async (subjectId, updatedData)=>{
    try {
        return await Materia.findByIdAndUpdate(subjectId, updatedData, { new: true })
    } catch (error) {
        console.error('MONGODB_Error al modificar la materia en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al ACTUALIZAR MATERIA REPO_ADMIN'}
    }
}

const deleteSubjectRepo = async (subjectId)=>{
    try {
        return await Materia.findByIdAndDelete(subjectId)
    } catch (error) {
        console.error('MONGODB_Error al eliminar la materia en el repositorio', error)
        throw {status: 500, message: 'Error interno del servidor al ELIMINAR MATERIA REPO_ADMIN'}
    }
}





module.exports = {getAllMembersRepo, findMemberRepo, addMemberDataRepo, updateMemberRepo, deleteMemberRepo, assignStatusRepo, updateHoursInRepo, getSubjectsByProfessorRepo, getSubjectHoursFromProfessorRepo, assignOrUpdateHoursInProfRepo, unassignSubjectInProfRepo, unassignSubjectFromProfessorRepo, unassignSubjectFromAllProfessorsRepo, createCourseRepo, deleteCourseRepo, getAllSubjectsRepo, findSubjectRepo, findSubjectByIdRepo, findSubjectByCourseRepo, createSubjectRepo, assignTitularInSubjectRepo, unassignTitularInSubjectRepo, assignSuplenteInSubjectRepo, unassignSuplenteInSubjectRepo, updateSubjectRepo, deleteSubjectRepo}