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

/* CREATE */
const createClassController = async (req, res) => {
    try {
        const result = await createClassService(req.body)
        res.status(201).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor createClassController'
        res.status(status).json({ error: message })
    }
}

/* READ */
const getAllClassesController = async (req, res) => {
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

const getClassByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await getClassByIdService({ classId: id })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getClassByIdController'
        res.status(status).json({ error: message })
    }
}

const getClassesByCourseController = async (req, res) => {
    try {
        const { courseId } = req.params
        const result = await getClassesByCourseService({ courseId })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getClassesByCourseController'
        res.status(status).json({ error: message })
    }
}

const getClassesBySubjectController = async (req, res) => {
    try {
        const { subjectId } = req.params
        const result = await getClassesBySubjectService({ subjectId })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getClassesBySubjectController'
        res.status(status).json({ error: message })
    }
}

const getClassesByProfessorController = async (req, res) => {
    try {
        const { professorId } = req.params
        const result = await getClassesByProfessorService({ professorId })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getClassesByProfessorController'
        res.status(status).json({ error: message })
    }
}

const getClassesByDayController = async (req, res) => {
    try {
        const { dia_semana } = req.params
        const result = await getClassesByDayService({ dia_semana })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor getClassesByDayController'
        res.status(status).json({ error: message })
    }
}

/* UPDATE */
const updateClassController = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body
        const result = await updateClassService({ classId: id, updateData })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor updateClassController'
        res.status(status).json({ error: message })
    }
}

const assignProfessorToClassController = async (req, res) => {
    try {
        const { classId } = req.params
        const { professorId, role = 'titular' } = req.body
        const result = await assignProfessorToClassService({ classId, professorId, role })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor assignProfessorToClassController'
        res.status(status).json({ error: message })
    }
}

const removeProfessorFromClassController = async (req, res) => {
    try {
        const { classId } = req.params
        const { professorId, role = 'titular' } = req.body
        const result = await removeProfessorFromClassService({ classId, professorId, role })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor removeProfessorFromClassController'
        res.status(status).json({ error: message })
    }
}

const setCurrentProfessorController = async (req, res) => {
    try {
        const { classId } = req.params
        const { profesorId } = req.body
        const result = await setCurrentProfessorService({ classId, profesorId })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor setCurrentProfessorController'
        res.status(status).json({ error: message })
    }
}

/* DELETE */
const deleteClassController = async (req, res) => {
    try {
        const { id } = req.params
        const result = await deleteClassService({ classId: id })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteClassController'
        res.status(status).json({ error: message })
    }
}

const deleteClassesByCourseController = async (req, res) => {
    try {
        const { courseId } = req.params
        const result = await deleteClassesByCourseService({ courseId })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteClassesByCourseController'
        res.status(status).json({ error: message })
    }
}

const deleteClassesBySubjectController = async (req, res) => {
    try {
        const { subjectId } = req.params
        const result = await deleteClassesBySubjectService({ subjectId })
        res.status(200).json(result)
    } catch (error) {
        const status = error.status || 500
        const message = error.message || 'Error interno del servidor deleteClassesBySubjectController'
        res.status(status).json({ error: message })
    }
}

module.exports = {
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
}
