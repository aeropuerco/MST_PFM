import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Hook solamente para comprobar si el token devuelve 401 en alguna respuesta

export const useSessionCheck = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();


    const checkResponse = async (request) => {
        try {
            // Se intenta procesar la petición 
            console.log("checkResponse!", request)
            return await request();
        } catch (err) {
            console.log("checkResponseERROR: ", err)
            // Detectamos si llega el 401, token caducado
            if (err.status === 401) {
                console.log("Token caducado detectado");
                logout();
                navigate('/login?alert=token_expired');
            }

            

            throw err;
        }
    };

    return { checkResponse };
};