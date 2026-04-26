import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

// CONTEXTOS
import { useAuth } from "../../contexts/AuthContext"

// SERVICIOS
import { ContentBlock } from "../../components/ContentBlock/ContentBlock"
import { PostService } from "../../services/post.service"
import { CommentService } from "../../services/comment.service"


// CUSTOM COMPONENTS
import { CommentItem } from "../../components/CommentItem/CommentItem"


export const Post = () => {

  const { user, token } = useAuth()
  const { id } = useParams()

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

if (!postLoaded) return <div>Cargando post...</div>

console.log("USERID", user?.id)
console.log("AUTHORID", postLoaded?.author?._id)

  return (
    <>


        <h2>{postLoaded.title}</h2>
        <div>{postLoaded?.author?.name}</div>
        <div>{postLoaded.date}</div>

        {postLoaded?.content_blocks.map((block) => (
         

          < ContentBlock key={block._id} tipo={block.tipo} >
            {block.valor}
          </ContentBlock>

        ))}
        
      {
        /* MOSTRAMOS BOTON EDITAR SI EL USER LOGEADO ES EL AUTOR DEL POST */

       (user?.id === postLoaded?.author?._id) && <Link to={'/post/edit/'+ id}>EDITAR</Link>
      }

      {
        /* MOSTRAMOS BOTON ELIMINAR SI EL USER LOGEADO ES EL AUTOR DEL POST, O SI ES UN ADMIN */
        (user?.id === postLoaded?.author?._id || user?.role === 'admin') && (
        <div>ELIMINAR POST</div>
      )
      }
         

      <div>

          {error && <div role="alert">{error}</div>}
          {ok && <div>{ok}</div>}

          <form onSubmit={onCommentSubmit}>
            <div>COMENTAR</div>
              <textarea name="comment" onChange={onChange} value={newComment.text} id="" placeholder="Escribe tu comentario..."></textarea>
              <button type="submit" disabled={loading}>
                            {loading ? 'Publicando...' : 'PUBLICAR COMENTARIO'}</button>
          </form>

      {console.log("COMMENTS", comments)}

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


