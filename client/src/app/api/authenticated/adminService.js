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

export const programmatEmails = async (hora, minuto, setAlert) => {
    try {
        const response = await api.post("/schedulEmailings", {
            hour:hora,
            minute:minuto,
        });
        const data = response.data;
        setAlert(data.message);
        setTimeout(() => {
            setAlert('');
        }, 2000);
    } catch (error) {
        console.error("Error al programar correos:", error);
        return [];  
    }
}

export const timerEmails = async (setAlert) => {
    try {
        const response = await api.get("/emailsprogrammer/timer");
        const data = response.data;
        if(response.ok) {
            return { hour: data.hour, minute: data.minute };
        } else {
            setAlert(data.message);
            return { hour: 0, minute: 0 };
        }
    } catch (error) {
        console.error("Error al obtener el tiempo restante:", error);
        setAlert(error.response.data.message);
        return { hour: 0, minute: 0 };
    }
}