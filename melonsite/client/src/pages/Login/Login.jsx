import { useState } from "react"
import { useNavigate } from "react-router-dom"/* 
import { AuthService } from "../../services/auth.service"
import { authStore } from "../../utils/authStore"
import { storage } from "../../utils/storage" */
// Estos van ya en el contexto
import { useAuth } from "../../contexts/AuthContext"


export const Login = () => {

    const navigate = useNavigate()

    const { login } = useAuth()
    
    // ESTADOS DEL FORMULARIO Y ESTADOS DE CARGA Y ERROR (UI)


    const [form, setForm] = useState({ email:'', password:''})
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    

    // Gestión de los input del formulario

    const onChange = (e) => {
      
        setForm ((prev)=>({...prev, [e.target.name]: e.target.value}))
    }

// funcion que envía el formulario
    const onSubmit = async (e) => {
      e.preventDefault() // evita la recarga despues del submit
      setError(null) //limpiamos mensajes de error y de ok
      setOk(null)
      setLoading(true) //empieza la llamada a la API

      try {
        //llamamos a la funcion login DEL CONTEXTO (YA NO DE LA API)

          await login(form.name.trim().toLowerCase(), form.password)
          navigate('/')

      } catch (err) {
        setError(err.message || 'Error al iniciar sesión')
      } finally {
        setLoading(false)
      }

    }

  return (
    <section className="card">
      <h2>INICIAR SESIÓN CON CONTEXTO</h2>
      <form className="space-y" onSubmit={onSubmit}>

        <div className="field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} />
        </div>

        <div className="field">
          <label>Contraseña</label>
          <input type="password" name="password" value={form.password} onChange={onChange} />
          
        </div>

        {error && <div className="error">{error}</div>}

        <div className="row" style={{justifyContent:'flex-end'}}>
          <button className="btn" disabled={loading}>{loading?'Iniciando sesión ...':'Iniciar sesión'}</button>
        </div>

      </form>
    </section>
  )
}
