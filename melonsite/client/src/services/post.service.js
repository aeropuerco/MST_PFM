import { http } from './http'

// Objeto con propiedades que dentro tienen funciones, son metodos.
// payload es la información que llega del usuario en el body

export const PostService = {
    overview : () => http('/api/post', { method: 'GET'}),
    fullpost : (id) => http(`/api/post/${id}`, { method: 'GET'})

   // profile : (token) => http('/api/auth/profile', { method: 'GET', token})
}
