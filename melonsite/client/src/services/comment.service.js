import { http } from './http'

// Objeto con propiedades que dentro tienen funciones, son metodos.
// payload es la información que llega del usuario en el body

export const CommentService = {
    overview : (id) => http(`/api/comment/post/${id}`, { method: 'GET'}),
    create : (payload, token) => http('/api/comment/createcomment', { method: 'POST', body:payload, token}),
    delete : (id, token) => http(`/api/comment/delete/${id}`, { method: 'DELETE', token})
}

