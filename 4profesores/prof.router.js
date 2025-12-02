const express = require('express')
const { studentBySubjectController, getAllMyStudentsController, subjectsHoursController, assigsGradesContoller } = require('./prof.controller')


const profRouter = express.Router()

profRouter.post('/alumnos_por_materia', studentBySubjectController)
profRouter.post('/todos_mis_alumnos', getAllMyStudentsController)
profRouter.post('/materias_horas', subjectsHoursController)
profRouter.post('/colocar_nota', assigsGradesContoller)


module.exports = {profRouter}