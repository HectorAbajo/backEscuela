const express = require('express')
const {
    createClassController,
    getAllClassesController,
    getClassByIdController,
    getClassesByCourseController,
    getClassesBySubjectController,
    getClassesByProfessorController,
    getClassesByDayController,
    updateClassController,
    assignProfessorToClassController,
    removeProfessorFromClassController,
    setCurrentProfessorController,
    deleteClassController,
    deleteClassesByCourseController,
    deleteClassesBySubjectController
} = require('./clases.controller')

const clasesRouter = express.Router()

/* CREATE */
clasesRouter.post('/', createClassController)

/* READ */
clasesRouter.get('/', getAllClassesController)
clasesRouter.get('/:id', getClassByIdController)
clasesRouter.get('/curso/:courseId', getClassesByCourseController)
clasesRouter.get('/materia/:subjectId', getClassesBySubjectController)
clasesRouter.get('/profesor/:profesorId', getClassesByProfessorController)
clasesRouter.get('/dia/:dia_semana', getClassesByDayController)

/* UPDATE */
clasesRouter.put('/:id', updateClassController)
clasesRouter.post('/:classId/asignar-profesor', assignProfessorToClassController)
clasesRouter.post('/:classId/remover-profesor', removeProfessorFromClassController)
clasesRouter.post('/:classId/profesor-actual', setCurrentProfessorController)

/* DELETE */
clasesRouter.delete('/:id', deleteClassController)
clasesRouter.delete('/curso/:courseId', deleteClassesByCourseController)
clasesRouter.delete('/materia/:subjectId', deleteClassesBySubjectController)

module.exports = { clasesRouter }
