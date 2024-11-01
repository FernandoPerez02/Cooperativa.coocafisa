import axios from "axios";
import { redirect } from "next/navigation";

export const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
    headers: {'Content-Type': 'application/json'}
});

export const auth = async (event, router, setAlert) => {
    event.preventDefault();
    const nit = event.target.nit.value.trim();
    const password = event.target.password.value.trim();

    try {
        const res = await api.post('/auth', {nit, password});
        const data = res.data;

        if (data.message === '!LOGIN CORRECTO¡') {
            redirect("/home")
        } else {
            setAlert(data.message);
        }
    }catch (error) {
        console.error('Error en la solicitud', error);
        setAlert("Hubo un problema al intentar iniciar sesión. Intenta nuevamente.");
    }
};