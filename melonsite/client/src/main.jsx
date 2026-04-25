import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider, NavLink, Outlet, redirect } from 'react-router-dom'
import { Home } from './components'
import { Login, Register, PostEditor, EditorList, Post } from './pages'

// No hace falta con el contexto de AuthProvider
// import {authStore } from './utils/authStore'

import { storage } from './utils/storage'
import { AuthProvider, useAuth } from './contexts/AuthContext'



// layout general

const Layout = () => {

  const {token, logout, user } = useAuth();

  return(
    <div>
      <nav style={{backgroundColor:'beige', padding: '20px'}}>
        <strong>mel_onsite /// content editor</strong>
        <div>
            <NavLink to='/'>Inicio | </NavLink>
            <NavLink to='/editorlist'>VerEditores | </NavLink>
            { !token ?  
            <>
                <NavLink to='/login'>Login | </NavLink> 
                <NavLink to='/register'>Registro | </NavLink>
                
            </>
            : 
              <>
                {user?.role === "editor" && (
                    <NavLink to='/createpost'>CreatePost | </NavLink>
                )}
                

                <button onClick={logout}>Logout</button>
                <div>{user?.name}///{user?.role}</div>
              </>
            }
           


        </div>
      </nav>
      <main>
          <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

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
      {  index:true, element: <Home /> } ,
      {  path: '/register',  element: <Register /> },
      {  path: '/login',  element: <Login /> },
      {  path: '/editorlist',  element: <EditorList /> },
      {  path: '/post/:id',  element: <Post /> },
      {  path: '/createpost',  element: <PostEditor />, loader:requireAuth },   // ruta protegida, especie de middleware para comprobar autenticación antes de dar paso al componente Profile
      {  path: '/post/edit/:id',  element: <PostEditor />, loader:requireAuth }   // ruta protegida, especie de middleware para comprobar autenticación antes de dar paso al componente Profile

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
