const { getAllEnrolledSubjectsService, getSubjectsByCourseService, enrollSubjectService, unenrollSubjectService } = require("./alumn.service")



const getEnrolledSubjectsController = async (req, res)=> {
    try {
        const result = await getAllEnrolledSubjectsService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getEnrolledSubjectsController'
        res.status(status).json({ error: message })
    }
}

const getSubjectsByCourseController = async (req, res)=> {
    try {
        const result = await getSubjectsByCourseService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getSubjectsByCourseController'
        res.status(status).json({ error: message })
    }
}

const enrollSubjectController = async (req, res)=> {
    try {
        const result = await enrollSubjectService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor enrollSubjectController'
        res.status(status).json({ error: message })
    }
}

const unenrollSubjectController = async (req, res)=> {
    try {
        const result = await unenrollSubjectService(req.body)
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor unenrollSubjectController'
        res.status(status).json({ error: message })
    }
}


module.exports = {getEnrolledSubjectsController, getSubjectsByCourseController, enrollSubjectController, unenrollSubjectController}