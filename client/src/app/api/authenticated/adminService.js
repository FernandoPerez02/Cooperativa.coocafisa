"use client"
import { api } from "../auth/authService";

export const queryEmails = async (seterror) => {
    try {
        const response = await api.get("/programmatemails/emails");
        const data = response.data;
        return data;
    } catch (error) {
        const errorData = error.response.data.error || error.response.data.errors;
        seterror(errorData);
        if (error.response.status === 400 && error.response.data.redirect) {
            seterror(errorData);
            window.location.href = error.response.data.redirect;
        } else if (error.response && error.response.status === 404) {
            seterror(errorData);
            window.location.href = error.response.data.redirect
        } else if (error.response && error.response.status === 403) {
            seterror(errorData);
            window.location.href = error.response.data.redirect
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