import { http } from './http'

// Objeto con propiedades que dentro tienen funciones, son metodos.
// payload es la información que llega del usuario en el body

export const PostService = {
    overview : () => http('/api/post', { method: 'GET'}),
    fullpost : (id) => http(`/api/post/${id}`, { method: 'GET'}),
    create : (payload, token) => http('/api/post/createpost', { method: 'POST', body:payload, token}),
    update : (id, payload, token) => http(`/api/post/update/${id}`, { method: 'PUT', body:payload, token}),
    delete : (id, token) => http(`/api/post/delete/${id}`, { method: 'DELETE', token})


   // profile : (token) => http('/api/auth/profile', { method: 'GET', token})
}
