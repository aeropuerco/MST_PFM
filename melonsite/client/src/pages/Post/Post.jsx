import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

// CONTEXTOS
import { useAuth } from "../../contexts/AuthContext"

// SERVICIOS
import { PostService } from "../../services/post.service"
import { CommentService } from "../../services/comment.service"


// CUSTOM COMPONENTS
import { CommentItem } from "../../components/CommentItem/CommentItem"
import { ContentBlock } from "../../components/ContentBlock/ContentBlock"

// UTILS
import { dateFormat } from '../../utils/dateFormat'

//CSS
import postStyle from './Post.module.css'


export const Post = () => {

  const { user, token } = useAuth()
  const { id } = useParams()

  // para navegación tras respuesta. Hook nuevo
  const navigate = useNavigate();

// ERRORES Y CARGAS
  const [loading,setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)
  
// POSTS
  const [ postLoaded, loadPost] = useState(null)


  useEffect(() => {
      if(!postLoaded){
        PostService.fullpost(id)
        .then(loadPost) 
        .catch(err => setError(err.message))
      }
  },[])

// COMENTARIOS
  const [ comments, loadComments] = useState([])
  const [newComment, setNewComment] = useState({text: ''})

  useEffect(() => {

        console.log("DENTRO DE COMMENTS");
        CommentService.overview(id)
        .then(data => {
          console.log("DATOS LLEGADOS:", data);
          loadComments(data);
      })
        .catch(err => setError(err.message))


  },[])



  if (error) return <p>Error: {error}</p>;
  if (!postLoaded) return <p>Cargando post...</p>;

  
const onChange = (e) => {
    const { value  } = e.target;
    setNewComment ({text: value} )

}

const validate = () => {
    /*  if(!form.name.trim()) return 'El nombre es obligatorio'
     if(!form.email.includes('@')) return 'Email no valido'
     if(!form.password || form.password.length < 6) return 'Contra al menos 6 digitos' */
     return null
 }

const onCommentSubmit = async (e) => {
    e.preventDefault() // evita la recarga despues del submit
    setError(null) //limpiamos mensajes de error y de ok
    setOk(null)

    const intValidate = validate()  //comprueba errores del formulario con la validacion
    if(intValidate) {setError(intValidate);return}  //si hay error lo setea, si no, no hace nada

    setLoading(true) //empieza la llamada a la API

    try {
        //cogemos el payload, lo que nos da el usuario
        const payload = {
            post : id,
            author : user.id,
            text: newComment.text  //para que no coja espacios
            
        }

        // llamamos a la API

            const response = await CommentService.create(payload, token)   /// LINEA DE EJECUCION
            setOk('COMENTARIO PUBLICADO!')
            loadComments([ ...comments, response])
            setNewComment({text: ""})


        
    } catch (err) {
        console.log("ERROR RESPONSE: " , err);
        setError(err.response?.data?.message || 'Error en el registro')
    } finally {
        setLoading(false) // termina el proceso de llamada a la API
    }
}

const deleteComment = async (id) => {
  setError(null) //limpiamos mensajes de error y de ok
  setOk(null)
  setLoading(true) //empieza la llamada a la API

  try {

      // llamamos a la API

      const data = await CommentService.delete(id, token)   /// LINEA DE EJECUCION

      const commentsActualizados = comments.filter(item => item._id !== id)
      loadComments(commentsActualizados)
      setOk('Editor eliminado')
      console.log(ok," - ", data);
      
  } catch (err) {
      setError(err.message || 'Error al eliminar comentario')
  } finally {
      setLoading(false) // termina el proceso de llamada a la API
  }
}

const deletePost = async () => {
  setError(null) //limpiamos mensajes de error y de ok
  setOk(null)
  setLoading(true) //empieza la llamada a la API
  console.log("POST DELETE ID: ", id);
  try {
    
    const response = await PostService.delete(id, token)
 
    setOk('Post eliminado')
    console.log(ok, " - ", response);

    // Una vez eliminado el post, volvemos a Home con el hook useNavigate
    navigate('/');
    
  } catch (err) {
      setError(err.message || 'Error al eliminar el Post')
  } finally {
      setLoading(false) // termina el proceso de llamada a la API
  }
}


if (!postLoaded) return <div>Cargando post...</div>

console.log("USERID", user?.id)
console.log("AUTHORID", postLoaded?.author?._id)

  return (
    <>

            <h2 className={postStyle.title}>{postLoaded.title}</h2>
            <div className={postStyle.author}>{postLoaded?.author?.name}</div>
            <div className={postStyle.date}>{dateFormat(postLoaded.date)}</div>
            <hr/>

            {postLoaded?.content_blocks.map((block) => ( 

/* PINTAMOS LOS BLOQUES QUE TENGA EL POST. COMPONENTE */

              < ContentBlock key={block._id} tipo={block.tipo} >
                {block.valor}
              </ContentBlock>

            ))}
            


            {
/* MOSTRAMOS BOTON EDITAR SI EL USER LOGEADO ES EL AUTOR DEL POST */

       (user?.id === postLoaded?.author?._id) && 
          <Link className='mel_button' to={'/post/edit/'+ id}>EDITAR</Link>
      }

      {
/* MOSTRAMOS BOTON ELIMINAR SI EL USER LOGEADO ES EL AUTOR DEL POST, O SI ES UN ADMIN */
        (user?.id === postLoaded?.author?._id || user?.role === 'admin') && (
           <button className='mel_button' onClick={deletePost}>ELIMINAR POST</button>
           /* PENDIENTE AÑADIR UNA VENTANA DE CONFIRMACION */
      )
      }


<hr/>
         

      <div>

          {error && <div role="alert">{error}</div>}
          {ok && <div>{ok}</div>}
     
{/* BLOQUE DE EDICION DE COMENTARIOS, SOLO SI HA HECHO LOGIN */}

     { user && 
     
          <form className={postStyle.commentBox_container} onSubmit={onCommentSubmit}>
             
            <textarea name="comment" className={postStyle.commentBox} onChange={onChange} value={newComment.text} id="" placeholder="Escribe tu comentario..."></textarea>
            <button className='mel_button' type="submit" disabled={loading}>
                          {loading ? 'Publicando...' : 'PUBLICAR COMENTARIO'}</button>
          </form>

     }


{/* CASO SIN LOGIN, MUESTRA AVISO DE REGISTRATE */}
     { !user &&
        <div className={postStyle.alert}>Registrate como visitante para comentar en Posts como este.</div>
     }

      


{/* PINTAMOS LOS N COMENTARIOS QUE TENGA EL POST. COMPONENTE */}

           {comments.map((comment) => (
              < CommentItem
                  id={comment._id}
                  content={comment.text}
                  action={deleteComment}
                  postAuthorId={postLoaded?.author?._id}
                  commentAuthorName={comment?.author.name}
                  commentAuthorId={comment.author._id}
                  key={comment._id}
              />
          ))}
          </div>


    </>
  )
}


