"use client"
import { api } from "../auth/authService";

export const queryEmails = async (setError) => {
    try {
        const response = await api.get("/programmatemails/emails");
        const data = response.data;
        console.log("Datos de correos22", data);
        return data;
    } catch (error) {
        const errorData = error.response.data.error || error.response.data.errors;
        setError(errorData);
        console.log("Error del servidor: ", errorData);
        if (error.response.status === 400 && error.response.data.redirect) {
            setError(errorData);
            window.location.href = error.response.data.redirect;
        } else if (error.response && error.response.status === 404) {
            setError(errorData);
            window.location.href = error.response.data.redirect
        } else if (error.response && error.response.status === 403) {
            setError(errorData);
            window.location.href = error.response.data.redirect
        } else if (error.response && error.response.status === 500) {
            setError(errorData);
        }
        return [];  
    }
}

export const programmatEmails = async (hora, minuto, setAlert, setType, setLoading) => {
    try {
        setType('success');
        const response = await api.post("/schedulEmailings", {
            hour:hora,
            minute:minuto,
        });
        const data = response.data;
        setAlert(data.message);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    } catch (error) {
        setType('error');
        setAlert(error.response.data.message);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        return [];  
    }
}

export const timerEmails = async (setAlert) => {
    try {
        const response = await api.get("/emailsprogrammer/timer");
        const data = response.data;
        console.log("Prueba de peticion ",data);
        if(response.status === 200) {
            return data;
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