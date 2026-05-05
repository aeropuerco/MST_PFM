import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './styles/variables.css'
import './styles/base.css'

import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'
import { Home } from './components'
import { Login, Register, PostEditor, EditorList, Post } from './pages'

// No hace falta con el contexto de AuthProvider
// import {authStore } from './utils/authStore'

import { storage } from './utils/storage'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout/Layout'
import { NotFound } from './components/NotFound/NotFound'



// Si ya no tenemos el token guardado, requerimos autenticación
// con un redirect, redirigimos al login

const requireAuth = () => {
 
  const tokenAuth = storage.get('token')
  if(!tokenAuth) throw redirect('/login')
    return null;


}


// rutas
const routes = [
  {
    path:'/',
    element: <Layout />, // componente
    children: [
      {  index:true, element: <Home/> } ,
      {  path: '/register',  element: <Register /> },
      {  path: '/login',  element: <Login /> },
      {  path: '/editorlist',  element: <EditorList /> },
      {  path: '/post/:id',  element: <Post /> },
      {  path: '/createpost',  element: <PostEditor />, loader:requireAuth },   // ruta protegida, especie de middleware para comprobar autenticación antes de dar paso al componente Profile
      {  path: '/post/edit/:id',  element: <PostEditor />, loader:requireAuth },   // ruta protegida, especie de middleware para comprobar autenticación antes de dar paso al componente Profile
      {  path: '/404',  element: <NotFound /> },   // 404
      {  path: '*',  element: <NotFound /> }   // 404

    ]
  }
]

// enrutado
const router = createBrowserRouter(routes)



// Renderizado de la App

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
