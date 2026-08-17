const express = require('express')
const {
    getAllMembersController, getMemberByIdController, getMemberByEmailController, updateMemberDataController,
    addMemberDataController, deleteMemberController, updateHoursFromSubjectController,
    getAllSubjectsByProfessorController, getSubjectByCourseByProfessorController, getCurrentHoursByProfessorController,
    getAllStudentsByProfessorController, getAllStudentsByCourseByProfessorController, assignGradeByStudentsController,
    getAllCourseController, getCourseByIdController, updatedCourseController, createCourseController, deleteCourseController,
    getAllSubjectsController, getSubjectByIdController, createSubjectController, updateSubjectController, deleteSubjectController,
    getAllClassesController, getClassByIdController, createClassController, updateClassController, deleteClassController,
    testController
} = require('./admin.controller')

const adminRouter = express.Router()



/* Miembros */
adminRouter.get('/members', getAllMembersController) 
adminRouter.get('/members/:id', getMemberByIdController) 
adminRouter.get('/members/by-email/:email', getMemberByEmailController) 
adminRouter.post('/members', addMemberDataController) 
adminRouter.put('/members/:id', updateMemberDataController) 
adminRouter.delete('/members/:id', deleteMemberController) 

/* Administrativo a Profesores */
adminRouter.post('/assignments/subject-hours/:id', updateHoursFromSubjectController)

/* Profesores */
adminRouter.get('/professors/:id/subjects', getAllSubjectsByProfessorController)
adminRouter.get('/professors/:id/courses/:courseId/subjects', getSubjectByCourseByProfessorController)
adminRouter.get('/professors/:id/current-hours', getCurrentHoursByProfessorController)
adminRouter.get('/professors/:id/students', getAllStudentsByProfessorController)
adminRouter.get('/professors/:id/courses/:courseId/students', getAllStudentsByCourseByProfessorController)

/* Profesores a Alumnos */
// adminRouter.post('/students/:id/grades', assignGradeByStudentsController)

/* Cursos */
adminRouter.get('/courses', getAllCourseController)
adminRouter.get('/courses/:id', getCourseByIdController)
adminRouter.post('/courses', createCourseController)
adminRouter.put('/courses/:id', updatedCourseController)
adminRouter.delete('/courses/:id', deleteCourseController)

/* Materias */
adminRouter.get('/subjects', getAllSubjectsController)
adminRouter.get('/subjects/:id', getSubjectByIdController)
adminRouter.post('/subjects', createSubjectController)
adminRouter.put('/subjects/:id', updateSubjectController)
adminRouter.delete('/subjects/:id', deleteSubjectController)

/* Clases */
adminRouter.get('/classes', getAllClassesController)
adminRouter.get('/classes/:id', getClassByIdController)
adminRouter.post('/classes', createClassController)
adminRouter.put('/classes/:id', updateClassController)
adminRouter.delete('/classes/:id', deleteClassController)

module.exports = {adminRouter}