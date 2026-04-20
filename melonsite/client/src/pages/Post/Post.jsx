import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useParams } from "react-router-dom"

import { PostService } from "../../services/post.service"
import { ContentBlock } from "../../components/ContentBlock/ContentBlock"


export const Post = () => {

  /* const [user, setUser] = useState(null) */
  // Sacamos user del contexto. NO hace falta
  const { user } = useAuth()
  const { id } = useParams();

  const [ postLoaded, loadPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {

      if(!postLoaded){
        PostService.fullpost(id)
        .then(loadPost) 
        .catch(err => setError(err.message))
      }

  },[])

  if (error) return <p>Error: {error}</p>;
  if (!postLoaded) return <p>Cargando post...</p>;

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
        

        <div>EDITAR</div>
        <div>ELIMINAR</div>
        <div>COMENTARIOS</div>
    </>
  )
}


