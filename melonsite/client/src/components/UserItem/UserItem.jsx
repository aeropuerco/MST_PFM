import { useAuth } from "../../contexts/AuthContext"

//CSS
import UserItemStyle from './UserItem.module.css'


export const UserItem = ({ name, id, action}) => {
    const { user } = useAuth();

    return (
        <div className={UserItemStyle.item}>
                <div  className={UserItemStyle.user}>{name}</div>
                {user?.role === 'admin' && (
                        <button className="mel_button red" onClick={() => action(id)}>(ADMIN) Eliminar</button>
                    )}
                
        </div>
    )
}
