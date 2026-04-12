// Accesos rapidos relacionados con la KEY en el storage.

import { storage } from "./storage";

const KEY = 'token';

export const authStore = {
    get() {  //devuelve el token guardado
        return storage.get(KEY)
    },
    set(token) {  // guarda o actualiza el token
        return storage.set(KEY, token)
    },
    clear() { // elimina el token (LOGOUT)
        return storage.remove(KEY)
    }
}