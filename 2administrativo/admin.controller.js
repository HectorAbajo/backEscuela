const { getAllMembersService, findMemberService } = require("../utilsEscuela/escuela")
const {updateMemberDataService, addMemberDataService, deleteMemberService, manageAssignSubjectInProfessorService, getSubjectsByProfessorService, createCourseService, deleteCourseService, getAllSubjectsService, createSubjectService, updateSubjectService, deleteSubjectService, testService, updateHoursFromSubjectService} = require("./admin.service")


const testController = async (req,res)=>{
    try{
        const result = await testService(req.body)
        
        res.status(result.status).json(result)
    }
    catch(error){
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getMemberByEmailController'
        res.status(status).json({ error: message })
    }
}


/* Miembro */
const getAllMembersController = async (req, res)=>{
    try {
        const result = await getAllMembersService()
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllMembersController'
        res.status(status).json({ error: message })
    }
}

const getMemberByIdController = async (req, res)=>{
    try{
        const {id} = req.params
        const {tabla} = req.query
        const data = {tabla: tabla, memberId: id}

        const result = await findMemberService(data)
        if(!result.ok){
            throw {status: result.status, message: result.message}
        }
        res.status(result.status).json(result)
    }
    catch(error){
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getMemberByEmailController'
        res.status(status).json({ error: message })
    }
}

const getMemberByEmailController = async (req,res)=>{
    try{
        const {email} = req.params
        const {tabla} = req.query
        const data = {tabla: tabla, email: email}

        const result = await findMemberService(data)
        if(!result.ok){
            throw {status: result.status, message: result.message}
        }
        res.status(result.status).json(result)
    }
    catch(error){
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getMemberByEmailController'
        res.status(status).json({ error: message })
    }
}

const updateMemberDataController = async (req, res)=>{
    try {
        const {id} = req.params
        const dataToUpdate = req.body
        const data = {membreId: id, data: dataToUpdate}

        const result = await updateMemberDataService(data)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor updateMemberDataController'
        res.status(status).json({ error: message })
    }
}

const addMemberDataController = async (req, res)=>{
    try {
        const result = await addMemberDataService(req.body)
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor addMemberDataController'
        res.status(status).json({ error: message })
    }
}

const deleteMemberController = async (req, res)=>{
    try {
        const {id} = req.params

        const result = await deleteMemberService(id)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteMemberController'
        res.status(status).json({ error: message })
    }
}

/* Administrativo a Profesores */
const updateHoursFromSubjectController = async (req, res)=>{
    try {
        const {id} = req.params
        const dataToUpdate = req.body
        const data = {memberId: id, data: dataToUpdate}

        const result = await updateHoursFromSubjectService(data)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor assignProfessorController'
        res.status(status).json({ error: message })
    }
}

/* Profesor */
const getAllSubjectsByProfessorController = async (req, res)=>{
    try {
        const {id} = req.params
        
        const result = await getAllSubjectsByProfessorService(id)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectsByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getSubjectByCourseByProfessorController = async (req, res)=>{
    try {
        const {id, idCourse} = req.params
        const data = {memberId: id, courseId: idCourse}

        const result = await getSubjectByCourseByProfessorService(data)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectsByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getCurrentHoursByProfessorController = async (req, res)=>{
    try {
        const {id} = req.params

        const result = await getCurrentHoursByProfessorService(id)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectsByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getAllStudentsByProfessorController = async (req, res)=>{
    try {
        const {id} = req.params

        const result = await getAllStudentsByProfessorService(id)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectsByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getAllStudentsByCourseByProfessorController = async (req, res)=>{
    try {
        const {id, idCourse} = req.params
        const data = {id: id, courseId: idCourse}

        const result = await getAllStudentsByCourseByProfessorService(data)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectsByProfessorController'
        res.status(status).json({ error: message })
    }
}


/* Curso */
const getAllCourseController = async (req, res)=>{
    try {
        const result = await getAllCourseService()
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createCourseController'
        res.status(status).json({error: message})
    }
}

const getCourseByIdController = async (req, res)=>{
    try {
        const {id} = req.params

        const result = await getCourseByIdService(id)
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createCourseController'
        res.status(status).json({error: message})
    }
}

const updatedCourseController = async (req, res)=>{
    try {
        const {id} = req.params
        const updateData = req.body
        const data = {courseId: id, data: updateData}

        const result = await createCourseService(data)
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createCourseController'
        res.status(status).json({error: message})
    }
}

const createCourseController = async (req, res)=>{
    try {
        const result = await createCourseService(req.body)
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createCourseController'
        res.status(status).json({error: message})
    }
}

const deleteCourseController = async (req, res)=>{
    try {
        const {id} = req.params
        
        const result = await deleteCourseService(id)
        res.status(200).json(result)
    } catch (error){
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteCourseController'
        res.status(status).json({error: message})
    }
}

/* Materia */

const getAllSubjectsController = async (req, res)=>{
    try {
        const result = await getAllSubjectsService()
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllSubjectsController'
        res.status(status).json({ error: message })
    }
}

const createSubjectController = async (req, res)=>{
    try {
        const result = await createSubjectService(req.body)
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createSubjectController'
        res.status(status).json({ error: message })
    }
}

const updateSubjectController = async (req, res)=>{
    try {
        const {id} = req.params
        const dataToUpdate = req.body
        const data = {subjectId: id, data: dataToUpdate}

        const result = await updateSubjectService(data)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor updateSubjectController'
        res.status(status).json({ error: message })
    }
}

const deleteSubjectController = async (req, res) =>{
    try {
        const {id} = req.params

        const result = await deleteSubjectService(id)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteSubjectController'
        res.status(status).json({ error: message })
    }
}

const getAllClassesController = async (req, res) =>{
    try {
        const filters = req.query

        const result = await getAllClassesService(filters)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor al obtener las clases'
        res.status(status).json({ error: message })
    }
}

const createClassController = async (req, res) =>{
    try {
        
        const result = await createClassService(req.body)
        
        res.status(201).json(result);
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor al crear una clase'
        res.status(status).json({ error: message })
    }
}


module.exports = {getAllMembersController, getMemberByIdController, getMemberByEmailController, updateMemberDataController, addMemberDataController, deleteMemberController, }