"use client"
import { api } from "../auth/authService";

export const queryEmails = async (seterror) => {
    try {
        const response = await api.get("/programmatemails/emails");
        return response.data;
    } catch (error) {
        const errorData = error.response.data.errors;
        if (error.response && error.response.status === 400) {
            seterror(errorData);
        } else if (error.response && error.response.status === 500) {
            seterror(errorData);
        }
        console.error("Error al obtener los correos:", error);
        return [];  
    }
}

export const programmatEmails = async (hora, minuto) => {
    try {
        const response = await api.post("/schedulEmailings", {
            hour:hora,
            minute:minuto,
        });
        return response.data;
    } catch (error) {
        console.error("Error al programar correos:", error);
        return [];  
    }
}