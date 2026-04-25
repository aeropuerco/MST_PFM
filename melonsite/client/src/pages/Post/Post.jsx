import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useParams } from "react-router-dom"

import { PostService } from "../../services/post.service"
import { CommentService } from "../../services/comment.service"
import { ContentBlock } from "../../components/ContentBlock/ContentBlock"

import { Link } from 'react-router-dom';


export const Post = () => {

  /* const [user, setUser] = useState(null) */
  // Sacamos user del contexto. NO hace falta

  const { user, token } = useAuth()
  const { id } = useParams()

  const [ postLoaded, loadPost] = useState(null)
  const [ comments, loadComments] = useState(null)

  const [loading,setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)

  const [newComment, setNewComment] = useState({
    text: ''
    

  })

  useEffect(() => {

      if(!postLoaded){
        PostService.fullpost(id)
        .then(loadPost) 
        .catch(err => setError(err.message))
      }

  },[])

  useEffect(() => {

      if(!comments){
        CommentService.overview(id)
        .then(loadComments) 
        .catch(err => setError(err.message))
      }

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
            text: newComment.comment  //para que no coja espacios
            
        }

        console.log("PAYLOAD COM", payload);
        // llamamos a la API

            const response = await CommentService.create(payload, token)   /// LINEA DE EJECUCION
            console.log('Respuesta CREATE COMMENT', response);
            setOk('COMENTARIO PUBLICADO!')


            loadComments([ ...comments, response])
            
            setNewComment({text: ""})


        
    } catch (err) {
        console.log(err);
        setError(err.response?.data?.message || 'Error en el registro')
    } finally {
        setLoading(false) // termina el proceso de llamada a la API
    }
}


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
       (user.name === postLoaded?.author?.name) && <Link to={'/post/edit/'+ id}>EDITAR</Link>
      }

      {
         /* MOSTRAMOS BOTON EDITAR SI EL USER LOGEADO ES EL AUTOR DEL POST O SI ES UN ADMIN */
        (user.name === postLoaded?.author?.name || user.role === 'admin') && (<div>ELIMINAR POST</div>)
      }
         

        <div>

        {error && <div role="alert">{error}</div>}
        {ok && <div>{ok}</div>}


      <form onSubmit={onCommentSubmit}>
          <textarea name="comment" onChange={onChange} value={newComment.text} id="" placeholder="Escribe tu comentario..."></textarea>
          <button type="submit" disabled={loading}>
                        {loading ? 'Publicando...' : 'PUBLICAR COMENTARIO'}</button>
        </form>
      {comments.map((comment) => (

        <div key={comment._id} className="comment">{comment.text}</div>

      ))}

        </div>
    </>
  )
}


