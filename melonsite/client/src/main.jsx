import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider, NavLink, Outlet, redirect } from 'react-router-dom'
import { Home } from './components'
import { Login, Register, CreatePost, EditorList, Post } from './pages'

import {authStore } from './utils/authStore'
import { AuthProvider } from './contexts/AuthContext'


// layout general

const Layout = () => {

  const hasToken = !!authStore.get()  // comprobamos si hay token en el localStorage

  const logout = () => {  // cerrar sesión del usuario
    authStore.clear()
    location.href='/'
  }

  return(
    <div>
      <nav style={{backgroundColor:'beige', padding: '20px'}}>
        <strong>mel_onsite /// content editor</strong>
        <div>
            <NavLink to='/'>Inicio | </NavLink>
            <NavLink to='/editorlist'>VerEditores | </NavLink>
            { !hasToken ?  
            <>
                <NavLink to='/login'>Login | </NavLink> 
                <NavLink to='/register'>Registro | </NavLink>
                <div>Usuario///ROL</div>
            </>: 
              <>
                <NavLink to='/createpost'>CreatePost | </NavLink>

                <button onClick={logout}>Logout</button>
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
  if(!authStore.get()) throw new redirect('./login')
    return null
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
      {  path: '/createpost',  element: <CreatePost />, loader:requireAuth }   // ruta protegida, especie de middleware para comprobar autenticación antes de dar paso al componente Profile

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
