// llamar a la api y devuelve la data


// traer la URL de la api desde el .env
const API_URL = import.meta.env.VITE_API_URL;


// asegurarnos que la respuesta devuelve formato texto
const parse = async (res) => {

    // si no hay contenido en la res --> 204 - No Content

    if(res.status === 204) return null;

    
    const text = await res.text()
    if(!text) return null;

    try {
        return JSON.parse(text)
    } catch {
        return text
    }

}

// Servicio de peticiones a la API reutilizable (Con los diferentes parametros, se pueden gestionar todas las llamadas con el fetch)
export const http = async (path, { method='GET', body, token, headers }) => {
        const res = await fetch(`${API_URL}${path}`,
            {
                method,
                headers: {
                    'Content-Type' : 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}`} : {} ),
                    ...(headers || {})
                },
                body: body ? JSON.stringify(body) : undefined
                    
            }
        )
    
        //gestiono la respuesta
        const data = await parse(res)
        if(!res.ok) {
            //console.log("http" + res.err);
            const message  = (data && (data.err || data.message) || `Error ${res.status}`)
            const errorObj = new Error(message);

            errorObj.status = res.status;
            
            console.log("errorMSG en http", errorObj.status)
            throw errorObj;
        }

        //devolver la respuesta
        return data
}