const { Clase } = require("../modelos.schema/schemaClase")
const mongoose = require("mongoose")

/* CREATE */
const createClassRepo = async (classData) => {
    try {
        const newClass = new Clase(classData)
        return await newClass.save()
    } catch (error) {
        console.error('MONGODB_Error al crear clase en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al CREAR CLASE REPO_ADMIN' }
    }
}

/* READ */
const getAllClassesRepo = async (filters = {}) => {
    try {
        let query = {}
        
        if (filters.curso) {
            query.curso = new mongoose.Types.ObjectId(filters.curso)
        }
        if (filters.materia) {
            query.materia = new mongoose.Types.ObjectId(filters.materia)
        }
        if (filters.dia_semana) {
            query.dia_semana = filters.dia_semana
        }
        if (filters.profesor_actual) {
            query.profesor_actual = new mongoose.Types.ObjectId(filters.profesor_actual)
        }

        return await Clase.find(query)
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al obtener todas las clases en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al OBTENER TODAS LAS CLASES REPO_ADMIN' }
    }
}

const getClassByIdRepo = async (classId) => {
    try {
        return await Clase.findById(classId)
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al buscar clase por ID en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al BUSCAR CLASE POR ID REPO_ADMIN' }
    }
}

const getClassesByCourseRepo = async (courseId) => {
    try {
        return await Clase.find({ curso: new mongoose.Types.ObjectId(courseId) })
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al obtener clases por curso en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR CURSO REPO_ADMIN' }
    }
}

const getClassesBySubjectRepo = async (subjectId) => {
    try {
        return await Clase.find({ materia: new mongoose.Types.ObjectId(subjectId) })
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al obtener clases por materia en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR MATERIA REPO_ADMIN' }
    }
}

const getClassesByProfessorRepo = async (professorId) => {
    try {
        return await Clase.find({
            $or: [
                { profesores_titulares: new mongoose.Types.ObjectId(professorId) },
                { profesores_suplentes: new mongoose.Types.ObjectId(professorId) },
                { profesor_actual: new mongoose.Types.ObjectId(professorId) }
            ]
        })
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al obtener clases por profesor en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR PROFESOR REPO_ADMIN' }
    }
}

const getClassesByDayRepo = async (dia_semana) => {
    try {
        return await Clase.find({ dia_semana: dia_semana })
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al obtener clases por día en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al OBTENER CLASES POR DÍA REPO_ADMIN' }
    }
}

/* UPDATE */
const updateClassRepo = async (classId, updateData) => {
    try {
        return await Clase.findByIdAndUpdate(classId, updateData, { new: true })
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al actualizar clase en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al ACTUALIZAR CLASE REPO_ADMIN' }
    }
}

const assignProfessorToClassRepo = async (classId, professorId, role = 'titular') => {
    try {
        const fieldName = role === 'titular' ? 'profesores_titulares' : 'profesores_suplentes'
        return await Clase.findByIdAndUpdate(
            classId,
            { $push: { [fieldName]: new mongoose.Types.ObjectId(professorId) } },
            { new: true }
        )
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al asignar profesor a clase en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al ASIGNAR PROFESOR A CLASE REPO_ADMIN' }
    }
}

const removeProfessorFromClassRepo = async (classId, professorId, role = 'titular') => {
    try {
        const fieldName = role === 'titular' ? 'profesores_titulares' : 'profesores_suplentes'
        return await Clase.findByIdAndUpdate(
            classId,
            { $pull: { [fieldName]: new mongoose.Types.ObjectId(professorId) } },
            { new: true }
        )
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al remover profesor de clase en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al REMOVER PROFESOR DE CLASE REPO_ADMIN' }
    }
}

const setCurrentProfessorRepo = async (classId, professorId) => {
    try {
        return await Clase.findByIdAndUpdate(
            classId,
            { profesor_actual: new mongoose.Types.ObjectId(professorId) },
            { new: true }
        )
            .populate('curso', 'nombre turno')
            .populate('materia', 'nombre horas')
            .populate('profesores_titulares', 'nombre apellido email')
            .populate('profesores_suplentes', 'nombre apellido email')
            .populate('profesor_actual', 'nombre apellido email')
    } catch (error) {
        console.error('MONGODB_Error al asignar profesor actual en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al ASIGNAR PROFESOR ACTUAL REPO_ADMIN' }
    }
}

/* DELETE */
const deleteClassRepo = async (classId) => {
    try {
        return await Clase.findByIdAndDelete(classId)
    } catch (error) {
        console.error('MONGODB_Error al eliminar clase en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al ELIMINAR CLASE REPO_ADMIN' }
    }
}

const deleteClassesByCourseRepo = async (courseId) => {
    try {
        return await Clase.deleteMany({ curso: new mongoose.Types.ObjectId(courseId) })
    } catch (error) {
        console.error('MONGODB_Error al eliminar clases por curso en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al ELIMINAR CLASES POR CURSO REPO_ADMIN' }
    }
}

const deleteClassesBySubjectRepo = async (subjectId) => {
    try {
        return await Clase.deleteMany({ materia: new mongoose.Types.ObjectId(subjectId) })
    } catch (error) {
        console.error('MONGODB_Error al eliminar clases por materia en el repositorio', error)
        throw { status: 500, message: 'Error interno del servidor al ELIMINAR CLASES POR MATERIA REPO_ADMIN' }
    }
}

module.exports = {
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
}
