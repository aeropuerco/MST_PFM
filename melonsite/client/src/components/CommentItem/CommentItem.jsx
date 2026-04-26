import { useAuth } from "../../contexts/AuthContext"



export const CommentItem = ({ content, id, action, postAuthorId, commentAuthorName, commentAuthorId}) => {
    const { user } = useAuth();

    
    const isOwnerOfComment = user?.id === commentAuthorId;
    const isOwnerOfPost = user?.id === postAuthorId;
    const isAdmin = user?.role === 'admin'

    return (
        <div style={{display: 'flex'}}>
                <div>{commentAuthorName} : </div>
                <div className='commentItem'>{content}</div>
                {(isOwnerOfComment || isOwnerOfPost || isAdmin) && (
                        <button className="adminBtn" onClick={() => action(id)}>Eliminar comentario</button>
                    )}
                
        </div>
    )
}
