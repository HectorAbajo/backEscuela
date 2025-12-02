const { studentBySubjectService, getAllMyStudentsService, subjectsHoursService, assigsGradesService } = require("./prof.service")

const studentBySubjectController = async (req, res)=> {
    try {
        const result = await studentBySubjectService(req.body)
        res.status(200).json(result)
    } catch (error) {
       const status = error.status || 500
        const message = error.message || 'Error interno del servidor studentBySubjectController'
        res.status(status).json({ error: message })
    }
}

const getAllMyStudentsController = async (req, res)=> {
    try {
        const result = await getAllMyStudentsService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getAllMyStudentsController'
        res.status(status).json({ error: message })
    }
}

const subjectsHoursController = async (req, res)=> {
    try {
        const result = await subjectsHoursService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor subjectsHoursController'
        res.status(status).json({ error: message })
    }
}

const assigsGradesContoller = async (req, res)=> {
    try {
        const result = await assigsGradesService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor assigsGradesContoller'
        res.status(status).json({ error: message })
    }
}


module.exports = {studentBySubjectController, getAllMyStudentsController, subjectsHoursController, assigsGradesContoller}