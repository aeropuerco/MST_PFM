import { useEffect, useState, useCallback} from "react"
import { useAuth } from "../../contexts/AuthContext"
import { UserService } from "../../services/user.service"


export const EditorList = () => {

  const [ resEditorList, setEditorList ] = useState([])
  const [error, setError] = useState(null)

  
  useEffect(() => {

    UserService.getEditors()
        .then(setEditorList)
        .catch(err => setError(err.message))


  },[])


  return (
    <>
        {error && <p style={{color: 'red'}}>{error}</p>}

        <h2>EDITORS LIST //</h2>

        {resEditorList.map((editor) => (
          <div style={{display: 'flex'}}>
            <div className='editorList'>{editor.name}</div>
            <button className="adminBtn">(ADMIN) Eliminar</button>
          </div>
        ))}


        <div style={{display: 'flex', flexDirection:'column'}}>
          <input type="text" placeholder="nombre" />
          <input type="text" placeholder="email" />
          <input type="text" placeholder="contraseña" />
        <button>(ADMIN) Alta editor</button>
        </div>
    </>
    
  )
}
