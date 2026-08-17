const {
    createClassRepo,
    getAllClassesRepo,
    getClassByIdRepo,
    getClassesByCourseRepo,
    getClassesBySubjectRepo,
    getClassesByProfessorRepo,
    getClassesByDayRepo,
    updateClassRepo,
    assignProfessorToClassRepo,
    removeProfessorFromClassRepo,
    setCurrentProfessorRepo,
    deleteClassRepo,
    deleteClassesByCourseRepo,
    deleteClassesBySubjectRepo
} = require('./clases.repository')
const { validateClase, validateProfessorRole } = require('./utilsAdmin/validateClase')
const { verifyExistenceCourse } = require('./utilsAdmin/verifyExistenceCourse')
const { findSubjectByIdService, findMemberService } = require('../utilsEscuela/escuela')

/* CREATE */
const createClassService = async (data) => {
    try {
        const { curso, materia, dia_semana, hora_ordinal } = data
        
        validateClase(data)
        
        const courseExists = await verifyExistenceCourse({ id: curso })
        if (!courseExists.ok) {
            throw { status: courseExists.status, message: courseExists.message }
        }

        const subjectExists = await findSubjectByIdService({ subjectId: materia })
        if (!subjectExists.ok) {
            throw { status: subjectExists.status, message: subjectExists.message }
        }

        const newClass = await createClassRepo(data)
        return { ok: true, class: newClass, message: 'Clase creada exitosamente' }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al CREAR CLASE SERVICE_ADMIN' }
    }
}

/* READ */
const getAllClassesService = async (filters = {}) => {
    try {
        const classes = await getAllClassesRepo(filters)
        
        if (classes.length === 0) {
            throw { status: 404, message: 'No se encontraron clases' }
        }

        return { ok: true, classes: classes, total: classes.length }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al OBTENER TODAS LAS CLASES SERVICE_ADMIN' }
    }
}

const getClassByIdService = async (data) => {
    try {
        const { classId } = data
        
        const classData = await getClassByIdRepo(classId)
        if (!classData) {
            throw { status: 404, message: `No se encontró clase con ID: ${classId}` }
        }

        return { ok: true, class: classData }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASE POR ID SERVICE_ADMIN' }
    }
}

const getClassesByCourseService = async (data) => {
    try {
        const { courseId } = data
        
        const courseExists = await verifyExistenceCourse({ id: courseId })
        if (!courseExists.ok) {
            throw { status: courseExists.status, message: courseExists.message }
        }

        const classes = await getClassesByCourseRepo(courseId)
        if (classes.length === 0) {
            throw { status: 404, message: `No hay clases para el curso ID: ${courseId}` }
        }

        return { ok: true, classes: classes, total: classes.length }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR CURSO SERVICE_ADMIN' }
    }
}

const getClassesBySubjectService = async (data) => {
    try {
        const { subjectId } = data
        
        const subjectExists = await findSubjectByIdService({ subjectId: subjectId })
        if (!subjectExists.ok) {
            throw { status: subjectExists.status, message: subjectExists.message }
        }

        const classes = await getClassesBySubjectRepo(subjectId)
        if (classes.length === 0) {
            throw { status: 404, message: `No hay clases para la materia ID: ${subjectId}` }
        }

        return { ok: true, classes: classes, total: classes.length }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR MATERIA SERVICE_ADMIN' }
    }
}

const getClassesByProfessorService = async (data) => {
    try {
        const { professorId } = data
        
        const professorExists = await findMemberService({ tabla: 'profesor', id: professorId })
        if (!professorExists.ok) {
            throw { status: professorExists.status, message: professorExists.message }
        }

        const classes = await getClassesByProfessorRepo(professorId)
        if (classes.length === 0) {
            throw { status: 404, message: `No hay clases asignadas al profesor ID: ${professorId}` }
        }

        return { ok: true, classes: classes, total: classes.length }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR PROFESOR SERVICE_ADMIN' }
    }
}

const getClassesByDayService = async (data) => {
    try {
        const { dia_semana } = data
        
        const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        if (!diasValidos.includes(dia_semana.toLowerCase())) {
            throw { status: 400, message: `El día debe ser uno de: ${diasValidos.join(', ')}` }
        }

        const classes = await getClassesByDayRepo(dia_semana.toLowerCase())
        if (classes.length === 0) {
            throw { status: 404, message: `No hay clases para el día: ${dia_semana}` }
        }

        return { ok: true, classes: classes, total: classes.length }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR DÍA SERVICE_ADMIN' }
    }
}

/* UPDATE */
const updateClassService = async (data) => {
    try {
        const { classId, updateData } = data
        
        const classExists = await getClassByIdRepo(classId)
        if (!classExists) {
            throw { status: 404, message: `No se encontró clase con ID: ${classId}` }
        }

        if (updateData.curso) {
            const courseExists = await verifyExistenceCourse({ id: updateData.curso })
            if (!courseExists.ok) {
                throw { status: courseExists.status, message: courseExists.message }
            }
        }

        if (updateData.materia) {
            const subjectExists = await findSubjectByIdService({ subjectId: updateData.materia })
            if (!subjectExists.ok) {
                throw { status: subjectExists.status, message: subjectExists.message }
            }
        }

        if (updateData.dia_semana) {
            const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
            if (!diasValidos.includes(updateData.dia_semana.toLowerCase())) {
                throw { status: 400, message: `El día debe ser uno de: ${diasValidos.join(', ')}` }
            }
        }

        const updatedClass = await updateClassRepo(classId, updateData)
        return { ok: true, class: updatedClass, message: 'Clase actualizada exitosamente' }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al ACTUALIZAR CLASE SERVICE_ADMIN' }
    }
}

const assignProfessorToClassService = async (data) => {
    try {
        const { classId, professorId, role = 'titular' } = data
        
        validateProfessorRole(role)
        
        const classExists = await getClassByIdRepo(classId)
        if (!classExists) {
            throw { status: 404, message: `No se encontró clase con ID: ${classId}` }
        }

        const professorExists = await findMemberService({ tabla: 'profesor', id: professorId })
        if (!professorExists.ok) {
            throw { status: professorExists.status, message: professorExists.message }
        }

        const updatedClass = await assignProfessorToClassRepo(classId, professorId, role)
        return { ok: true, class: updatedClass, message: `Profesor asignado como ${role} exitosamente` }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al ASIGNAR PROFESOR A CLASE SERVICE_ADMIN' }
    }
}

const removeProfessorFromClassService = async (data) => {
    try {
        const { classId, professorId, role = 'titular' } = data
        
        validateProfessorRole(role)
        
        const classExists = await getClassByIdRepo(classId)
        if (!classExists) {
            throw { status: 404, message: `No se encontró clase con ID: ${classId}` }
        }

        const updatedClass = await removeProfessorFromClassRepo(classId, professorId, role)
        return { ok: true, class: updatedClass, message: `Profesor removido como ${role} exitosamente` }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al REMOVER PROFESOR DE CLASE SERVICE_ADMIN' }
    }
}

const setCurrentProfessorService = async (data) => {
    try {
        const { classId, profesorId } = data
        
        const classExists = await getClassByIdRepo(classId)
        if (!classExists) {
            throw { status: 404, message: `No se encontró clase con ID: ${classId}` }
        }

        const profesorExists = await findMemberService({ tabla: 'profesor', id: profesorId })
        if (!profesorExists.ok) {
            throw { status: profesorExists.status, message: profesorExists.message }
        }

        const updatedClass = await setCurrentProfessorRepo(classId, profesorId)
        return { ok: true, class: updatedClass, message: 'Profesor actual asignado exitosamente' }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al ASIGNAR PROFESOR ACTUAL SERVICE_ADMIN' }
    }
}

/* DELETE */
const deleteClassService = async (data) => {
    try {
        const { classId } = data
        
        const classExists = await getClassByIdRepo(classId)
        if (!classExists) {
            throw { status: 404, message: `No se encontró clase con ID: ${classId}` }
        }

        await deleteClassRepo(classId)
        return { ok: true, message: 'Clase eliminada exitosamente' }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al ELIMINAR CLASE SERVICE_ADMIN' }
    }
}

const deleteClassesByCourseService = async (data) => {
    try {
        const { courseId } = data
        
        const courseExists = await verifyExistenceCourse({ id: courseId })
        if (!courseExists.ok) {
            throw { status: courseExists.status, message: courseExists.message }
        }

        const result = await deleteClassesByCourseRepo(courseId)
        return { ok: true, message: `Se eliminaron ${result.deletedCount} clases del curso`, deletedCount: result.deletedCount }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al ELIMINAR CLASES POR CURSO SERVICE_ADMIN' }
    }
}

const deleteClassesBySubjectService = async (data) => {
    try {
        const { subjectId } = data
        
        const subjectExists = await findSubjectByIdService({ subjectId: subjectId })
        if (!subjectExists.ok) {
            throw { status: subjectExists.status, message: subjectExists.message }
        }

        const result = await deleteClassesBySubjectRepo(subjectId)
        return { ok: true, message: `Se eliminaron ${result.deletedCount} clases de la materia`, deletedCount: result.deletedCount }

    } catch (error) {
        if (error.status) { throw error }
        throw { status: 500, message: 'Error interno del servidor al ELIMINAR CLASES POR MATERIA SERVICE_ADMIN' }
    }
}

module.exports = {
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
}
