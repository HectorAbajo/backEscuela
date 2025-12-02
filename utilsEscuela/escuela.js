const { findUserByEmailRepo } = require("../1autentificacion/aut.repository")
const { getAllMembersRepo, findSubjectByIdRepo, findMemberRepo } = require("../2administrativo/admin.repository")

const findUserByEmailService = async(data)=>{
    try {
        const {email} = data
        const user = await findUserByEmailRepo(email)
        if(user === null){
            return {status: 404, message: `No existe usuario con el email: ${email} proporcionado`}
        }

        return {ok:true, user: user}

    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al BUSCAR USUARIO POR EMAIL SERVICE_AUTH'}
    }
}

const findMemberService = async (data)=>{
    try {
        const {tabla, email, id} = data
        let tipoDeBusqueda, valorDeBusqueda
        if(email){
            tipoDeBusqueda = 'email'
            valorDeBusqueda = email
        } else if(id){
            tipoDeBusqueda = 'id'
            valorDeBusqueda = id
        } else{
            throw {status: 400, message: 'Se debe proporcionar un email o un id para la búsqueda.'}
        }
        const integrante = await findMemberRepo(tabla, tipoDeBusqueda, valorDeBusqueda)
        if(!integrante){
            return {status: 404, message: `No se encontró un integrante para la tabla ${tabla} con el ${tipoDeBusqueda} proporcionado.`}
        }

        return {ok: true, user: integrante}

    } catch (error) {
        if(error.status){throw error}
        throw { status: 500, message: `Error interno del servidor al BUSCAR ${tabla} SERVICE_ADMIN.` }
    }
}

const getAllMembersService = async (data)=>{
    try {
        const { tabla } = data
        const members = await getAllMembersRepo(tabla)
        if(members.length === 0){
            return {status: 404, message: `No se encontraron integrantes para ${tabla}`}
        }
        return {ok: true, users: members}
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: `Error interno del servidor AL OBTENER TODOS LOS ${tabla}/s SERVICE_ADMIN`}
    }
}

const findSubjectByIdService = async (data)=>{
    try {
        const {subjectId} = data
        const subject = await findSubjectByIdRepo(subjectId)
        if(!subject){
            throw{status: 404, message: `No se encontro Materia con ID: ${subjectId}`}
        }
        return {ok: true, subject: subject}
    } catch (error) {
        if(error.status){throw error}
        throw {status: 500, message: 'Error interno del servidor al BUSCAR MATERIA POR ID SERVICE_ADMIN'}
    }
}

module.exports = {findUserByEmailService, findMemberService, getAllMembersService, findSubjectByIdService}