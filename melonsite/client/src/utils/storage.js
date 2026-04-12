// Funciones para manejar el Storage. Leer, guardar, eliminar algo, o todo.

export const storage = {
    get(key)  { //traer algo del localStorage
        try {
            const getStorage = localStorage.getItem(key)
            return getStorage ? JSON.parse(getStorage) : null;

        } catch (err) {
            return null
        }
    },
    set(key, value) {
        try { // guardar algo en el localStorage
            localStorage.setItem(key, JSON.stringify(value))

        } catch {
            return {}
        }
    },
    remove(key) { // elimina del localStorage

        try {
            localStorage.removeItem(key)
        } catch {
            return {}
        }

    },
    clear() { // Vacia el localStorage
        try {
            localStorage.clear()
        } catch {
            return {}
        }
    }
}