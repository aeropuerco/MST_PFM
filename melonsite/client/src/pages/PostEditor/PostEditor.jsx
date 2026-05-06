import { useEffect, useState } from "react"
import { AuthService } from "../../services/auth.service"
import { useAuth } from "../../contexts/AuthContext"
import { useParams, useNavigate } from "react-router-dom"

//SERVICIOS
import { PostService } from "../../services/post.service"

// COMPONENTES CUSTOM
import { EditableContentBlock } from "../../components/EditableContentBlock/EditableContentBlock"

// CUSTOM HOOKs
import { useSessionCheck } from "../../hooks/useSessionCheck"

//CSS
import postEditorStyle from './PostEditor.module.css'


export const PostEditor = () => {
    // ESTADOS DEL FORMULARIO Y ESTADOS DE CARGA Y ERROR (UI)

    const { token } = useAuth()
    const [postData, setPostData] = useState({
        title: '',
        content_blocks: []
  
      })
    
    const { id } = useParams();

    // para navegación tras respuesta. Hook nuevo
    const navigate = useNavigate();

  // para gestionar status de respuestas. CUSTOM HOOK 
    const {checkResponse} = useSessionCheck();

    // SI el useParams detecta que la ruta carga la id, es que estamos editando, asi que cargamos el post en el postData y se rellenan los bloques
    useEffect(() => {

      if(id){
        PostService.fullpost(id)
        .then(setPostData) 
        .catch(err => setError(err.message))
      }

  },[])




    // definir useState con el estado vacío
    // este recopilará todo el post

    
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    

    // Para los cambios en el titulo (input siempre fijo, como estaba en el form register)

    const onChange = (e) => {
        const { name, value  } = e.target;
        setPostData ((prev) => ({...prev, [name]: value}) )

    }

    // Para los cambios en los bloques, con index variable
    const onBlockChange = (index, newValue) =>{
      setPostData ((prev) => {

          //Actualizamos con copia usando ...
          const newBlocks = [...prev.content_blocks]

          newBlocks[index] = {...newBlocks[index], valor: newValue}
          
          return {
            ...prev,
            content_blocks: newBlocks
          }

      })
    }

    // Añadir bloque

    const addBlock = (tipo) => {
        const newBlock = { tipo : tipo, valor:''}
        setPostData((prev) => ({
            ...prev,
            content_blocks: [...prev.content_blocks, newBlock]
        }))
        
        //console.log("check postData: ", postData);
    }

    // Eliminar un bloque

    const removeBlock = (index) => {
        setPostData((prev) => ({
            ...prev,
            content_blocks: prev.content_blocks.filter((_,i) => i !== index)
        }))
    }

    // Validación de los campos del formulario antes de llamar a la API

    const validate = () => {
        
        if(!postData.title.trim()) return 'El titulo es obligatorio'

        // Si no hay bloques
        if (postData.content_blocks.length === 0) {
            return 'El post debe tener al menos un bloque de contenido';
        }

         // Buscar bloques vacios

        const emptyBlock = postData.content_blocks.find(block => !block.valor.trim());

        if (emptyBlock) {
            return `El bloque de tipo "${emptyBlock.tipo}" no puede estar vacío`;
        }

        return null
    }


    // Envío del formulario - Coger los datos y llamar a la API

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
                
                title: postData.title.trim(),  //para que no coja espacios
                content_blocks: postData.content_blocks.map((block) => ({
                      tipo: block.tipo,
                      valor: block.valor.trim()
                }))
            }

            // llamamos a la API
            // Inicio de variable que recibirá la respuesta
            let response;

            if (id) {
                
                // response = await PostService.update(id, payload, token)   /// LINEA DE EJECUCION SIN HOOK
                response = await checkResponse(() => PostService.update(id, payload, token))   /// LINEA DE EJECUCION CON HOOK
                

                setOk('POST MODIFICADO!')
            } else {
                //response = await PostService.create(payload, token)  /// LINEA DE EJECUCION SIN HOOK
                response = await checkResponse(() => PostService.create(payload, token))   /// LINEA DE EJECUCION CON HOOK
                setOk('POST PUBLICADO!')
            }
            
            const targetId = response._id || response.id;

            console.log('ID objetivo', targetId);
            // Una vez guardado el post, volvemos a Posts con el hook useNavigate y con el id objetivo que viene de vuelta en la respuesta
            navigate(`/post/${targetId}`);

            
        } catch (err) {
            //console.log(err);
            setError(err.response?.data?.message || 'Error en el guardado del post')
        } finally {
            setLoading(false) // termina el proceso de llamada a la API
        }
    }

    // Devolver el template de la página de register

    return (

            <div className={postEditorStyle.post}>
                <label>{id? "EDITAR POST" : "CREAR NUEVO POST"}</label>
        <hr />
                <form onSubmit={onSubmit}>
                    <div className={postEditorStyle.panel}>
                        <label htmlFor="">Titulo</label>
                        <input id="title" name="title" value={postData.title} onChange={onChange} placeholder="Escríbe un título" />
                    </div>

                    <div className="content_blocks" style={{display: 'flex', flexDirection:'column'}}>
                    
                    {postData.content_blocks.map((block, index) => (
                        <div className={postEditorStyle.panel}>
                            <EditableContentBlock
                                    key={index}
                                    index={index}
                                    block={block}
                                    onChange={onBlockChange}
                                    onRemove={removeBlock}
                                />
                            </div>
                        )

                    )}
                    

                    </div>


                    {error && <div role="alert">{error}</div>}
                    {ok && <div>{ok}</div>}

<hr />

                    <div className={postEditorStyle.toolbar}>
                        <div>
                            <button className='mel_button' type="button" onClick={()=> addBlock('parrafo')}>+ Parrafo</button>
                            <button className='mel_button' type="button" onClick={()=> addBlock('subtitulo')}>+ Subtitulo</button>
                            <button className='mel_button' type="button" onClick={()=> addBlock('imagen')}>+ Imagen</button>
                            <button className='mel_button' type="button" onClick={()=> addBlock('code')}>+ Codigo</button>
                        </div>
                        <button className='mel_button red'type="submit" disabled={loading}>
                            {loading ? (id? 'Guardando cambios...': 'Publicando...') : (id? '💾 GUARDAR': 'PUBLICAR')}</button>
                    </div>


                </form>
            </div>

    )
}
