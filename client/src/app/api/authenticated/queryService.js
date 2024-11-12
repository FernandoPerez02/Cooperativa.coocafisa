import { api } from "../auth/authService";

export const queryUsers = async () => {
    try {
        const response = await api.get("/queryusers/users");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [];  
    }
}