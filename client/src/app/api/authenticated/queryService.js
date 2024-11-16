import { api } from "../auth/authService";

export const queryUsers = async (setError) => {
    try {
        const response = await api.get("/queryusers/users");
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data.errors || error.response.data.error;
            console.log("Respuesta de errores del servidor ", errorData)
            setError(errorData)
        } else if (error.request) {
            setError("Revisa tu conexion para continuar con la consulta.")
        } else {
            setError("Error en el servidor.")
        }
        return[]
    }
}