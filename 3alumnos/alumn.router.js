const express = require('express')
const { getEnrolledSubjectsController, getSubjectsByCourseController, enrollSubjectController, unenrollSubjectController } = require("./alumn.contoller")

const alumnRouter = express.Router()


alumnRouter.post('/obtener_materias_alistadas', getEnrolledSubjectsController)
alumnRouter.post('/obtener_materias_por_curso', getSubjectsByCourseController)
alumnRouter.post('/alistar_materia', enrollSubjectController)
alumnRouter.post('/eliminar_materia_alistada', unenrollSubjectController)



module.exports = { alumnRouter }