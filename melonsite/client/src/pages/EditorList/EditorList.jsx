import { useEffect, useState} from "react"
import { useAuth } from "../../contexts/AuthContext"
//SERVICIOS
import { UserService } from "../../services/user.service"

//Componentes mios
import { UserItem } from "../../components/UserItem/UserItem"


export const EditorList = () => {
  
  const [form, setForm] = useState({name:'', email:'', password:''})

  const [ resEditorList, setEditorList ] = useState([])
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)
  const [loading,setLoading] = useState(false)
  const { token , user } = useAuth()


  useEffect(() => {

    UserService.getEditors()
        .then(setEditorList)
        .catch(err => setError(err.message))


  },[])


  /* FUNCION DE ELIMINAR UN EDITOR - A */
  const deleteEditor = async (id) => {
        setError(null) //limpiamos mensajes de error y de ok
        setOk(null)
        setLoading(true) //empieza la llamada a la API

        try {

            // llamamos a la API

            const data = await UserService.deleteEditor(id, token)   /// LINEA DE EJECUCION

            const listaActualizada = resEditorList.filter(item => item._id !== id)
            setEditorList(listaActualizada)
            setOk('Editor eliminado')
            console.log(ok," - ", data);
            
        } catch (err) {
            setError(err.message || 'Error en el registro')
        } finally {
            setLoading(false) // termina el proceso de llamada a la API
        }
    }
  
  /* FUNCION DE ELIMINAR UN EDITOR - Z */


  /* ENVIAR MINI-FORMULARIO DE REGISTRO DE EDITORES, SOLO VISIBLE PARA ADMINS - A */

    // Gestión de los input del formulario
    const formularioReset = {
      name: "",
      email: "",
      password: ""
    };



    const onChange = (e) => {
        const { name, value  } = e.target;
        setForm ((prev)=>({...prev, [name]: value}))

    }

    // Envío del formulario - Coger los datos y llamar a la API
    const validate = () => {
      if(!form.name.trim()) return 'El nombre es obligatorio'
      if(!form.email.includes('@')) return 'Email no valido'
      if(!form.password || form.password.length < 6) return 'Contra al menos 6 digitos'
      return null
  }

    const onSubmit = async (e) => {
        e.preventDefault() // evita la recarga despues del submit
        setError(null) //limpiamos mensajes de error y de ok
        setOk(null)

        const intValidate = validate()  //comprueba errores del formulario con la validacion
        if(intValidate) {setError(intValidate);return}  //si hay error lo setea, si no, no hace nada

        setLoading(true) //empieza la llamada a la API

        try {
            //cogemos el payload, lo que nos da el usuario
            const payload = {
                name: form.name.trim(),  //para que no coja espacios
                email: form.email.trim().toLowerCase(),
                password: form.password
            }

            // llamamos a la API


            const data = await UserService.registerEditor(payload, token)   /// LINEA DE EJECUCION

            setOk('Registro de editor completado!, Ya puede hacer login')

            const nuevoEditor = data;
            setEditorList([ ...resEditorList, nuevoEditor])
            
            setForm(formularioReset)


        } catch (err) {
            setError(err.message || 'Error en el registro')
        } finally {
            setLoading(false) // termina el proceso de llamada a la API
        }
    }


  /* ENVIAR MINI-FORMULARIO DE REGISTRO DE EDITORES, SOLO VISIBLE PARA ADMINS - Z */



  
  return (
    <>
        {error && <p style={{color: 'red'}}>{error}</p>}

        <h2>EDITORS LIST //</h2>

        {resEditorList.map((editor) => (
          < UserItem name={editor.name} id={editor._id} action={deleteEditor} key={editor._id} />

        ))}

        {user?.role === "admin" && (
          <form onSubmit={onSubmit}>  
            <div style={{display: 'flex', flexDirection:'column'}}>
                  <input id="name" name="name" value={form.name} onChange={onChange} autoComplete="name" placeholder="nombre"/>
                  <input id="email" name="email" value={form.email} onChange={onChange} autoComplete="email" placeholder="email"/>
                  <input id="password" name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" placeholder="contraseña"/>
                <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Alta Nuevo Editor'}</button>
            </div>
          </form>
       )}





    </>
    
  )
}
