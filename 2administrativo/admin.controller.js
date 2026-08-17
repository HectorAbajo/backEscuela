const { getAllMembersService, findMemberService } = require("../utilsEscuela/escuela")
const {updateMemberDataService, addMemberDataService, deleteMemberService, updateHoursFromSubjectService, getSubjectsByProfessorService, createCourseService, deleteCourseService, getAllSubjectsService, findSubjectService, findSubjectByCourseService, createSubjectService, updateSubjectService, deleteSubjectService} = require('./admin.service')
const {
    createClassService,
    getAllClassesService,
    getClassByIdService,
    getClassesByCourseService,
    getClassesBySubjectService,
    getClassesByProfessorService,
    getClassesByDayService,
    updateClassService,
    assignProfessorToClassService,
    removeProfessorFromClassService,
    setCurrentProfessorService,
    deleteClassService,
    deleteClassesByCourseService,
    deleteClassesBySubjectService
} = require('./clases.service')


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
        const data = {tabla: tabla, id: id}

        const result = await findMemberService(data)
        if(!result.ok){
            throw {status: result.status, message: result.message}
        }
        res.status(200).json(result)
    }
    catch(error){
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getMemberByIdController'
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
        res.status(200).json(result)
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
        const data = {memberId: id, updateData: dataToUpdate}

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
        const {tabla} = req.query

        const result = await deleteMemberService({tabla: tabla, email: id})
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

        const result = await updateHoursFromSubjectService({...dataToUpdate, professorId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor updateHoursFromSubjectController'
        res.status(status).json({ error: message })
    }
}

/* Profesor */
const getAllSubjectsByProfessorController = async (req, res)=>{
    try {
        const {id} = req.params
        
        const result = await getSubjectsByProfessorService({professorId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllSubjectsByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getSubjectByCourseByProfessorController = async (req, res)=>{
    try {
        const {id, courseId} = req.params

        const result = await getSubjectByCourseService({courseId: courseId})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectByCourseByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getCurrentHoursByProfessorController = async (req, res)=>{
    try {
        const {id} = req.params

        const result = await getSubjectsByProfessorService({professorId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getCurrentHoursByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getAllStudentsByProfessorController = async (req, res)=>{
    try {
        const {id} = req.params

        const result = await getSubjectsByProfessorService({professorId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllStudentsByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getAllStudentsByCourseByProfessorController = async (req, res)=>{
    try {
        const {id, courseId} = req.params

        const result = await getSubjectByCourseService({courseId: courseId})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllStudentsByCourseByProfessorController'
        res.status(status).json({ error: message })
    }
}

const assignGradeByStudentsController = async (req, res)=>{
    try {
        const {id} = req.params

        res.status(200).json({message: "Endpoint no implementado aún"})
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor assignGradeByStudentsController'
        res.status(status).json({ error: message })
    }
}

/* Curso */
const getAllCourseController = async (req, res)=>{
    try {
        const result = await getAllSubjectsService()
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllCourseController'
        res.status(status).json({error: message})
    }
}

const getCourseByIdController = async (req, res)=>{
    try {
        const {id} = req.params

        res.status(200).json({message: "Endpoint no implementado aún"})
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getCourseByIdController'
        res.status(status).json({error: message})
    }
}

const updatedCourseController = async (req, res)=>{
    try {
        const {id} = req.params
        const updateData = req.body

        const result = await updateSubjectService({subjectId: id, updateData: updateData})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor updatedCourseController'
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
        
        const result = await deleteCourseService({courseId: id})
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

const getSubjectByIdController = async (req, res)=>{
    try {
        const {id} = req.params

        res.status(200).json({message: "Endpoint no implementado aún"})
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectByIdController'
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

        const result = await updateSubjectService({subjectId: id, updatedData: dataToUpdate})
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

        const result = await deleteSubjectService({subjectId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteSubjectController'
        res.status(status).json({ error: message })
    }
}

/* Clases */

const getAllClassesController = async (req, res) =>{
    try {
        const filters = req.query

        const result = await getAllClassesService(filters)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllClassesController'
        res.status(status).json({ error: message })
    }
}

const getClassByIdController = async (req, res) =>{
    try {
        const {id} = req.params

        const result = await getClassByIdService({classId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getClassByIdController'
        res.status(status).json({ error: message })
    }
}

const createClassController = async (req, res) =>{
    try {
        const result = await createClassService(req.body)
        res.status(201).json(result);
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createClassController'
        res.status(status).json({ error: message })
    }
}

const updateClassController = async (req, res) =>{
    try {
        const {id} = req.params
        const updateData = req.body

        const result = await updateClassService({classId: id, updateData: updateData})
        res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor updateClassController'
        res.status(status).json({ error: message })
    }
}

const deleteClassController = async (req, res) =>{
    try {
        const {id} = req.params

        const result = await deleteClassService({classId: id})
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteClassController'
        res.status(status).json({ error: message })
    }
}

module.exports = {
    getAllMembersController, 
    getMemberByIdController, 
    getMemberByEmailController, 
    updateMemberDataController, 
    addMemberDataController, 
    deleteMemberController,
    updateHoursFromSubjectController,
    getAllSubjectsByProfessorController,
    getSubjectByCourseByProfessorController,
    getCurrentHoursByProfessorController,
    getAllStudentsByProfessorController,
    getAllStudentsByCourseByProfessorController,
    assignGradeByStudentsController,
    getAllCourseController,
    getCourseByIdController,
    updatedCourseController,
    createCourseController,
    deleteCourseController,
    getAllSubjectsController,
    getSubjectByIdController,
    createSubjectController,
    updateSubjectController,
    deleteSubjectController,
    getAllClassesController,
    getClassByIdController,
    createClassController,
    updateClassController,
    deleteClassController,
    testController
}
