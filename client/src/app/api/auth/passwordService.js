import { api } from "./authService";

export const emailValidate = async (event,setAlert) => {
    event.preventDefault();
    const nit = event.target.nit.value.trim();
    if (nit === '') {
        setAlert('Nit es requerido');
        return;
    }

    try {
        const response = await api.post('/recoverypass/emailresetpass', {nit});
        const {data} = response;
        console.log("Datos de la respuesta: ", data.message);
        if (response.status === 200) {
            setAlert(data.message);
            event.target.nit.value = '';
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1000);
        }
    } catch (error) {
        const errorData = error.response.data.message
        setAlert(errorData);
        if (error.response.status === 400) {
            setAlert(errorData);
        } else if (error.response.status === 401) {
            setAlert(errorData);
        } else if (error.response.status === 404) {
            setAlert(errorData);
        } else {
            console.error('Error en la solicitud', error);
            setAlert('Error en el servidor. Intenta nuevamente más tarde.')
        }
    }
};

export const resetpass = async (event, setAlert, token) => {
    const newpass = event.target.newpass.value.trim();
    const confpass = event.target.confpass.value.trim();
    try {
        const response = await api.post(`/recoverypass/resetpass`, {
            newpass, confpass, token
        });
        const {data} = response;
        if (response.status === 201) {
            setAlert(data.message);
        } else if(response.status === 400) {
            setAlert(data.errors);
        } else if (response.status === 401) {
            setAlert(data.errors);
        }
        event.target.newpass.value = '';
            event.target.confpass.value = '';
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
    } catch (error) {
        const errorData = error.response && error.response.data.message;
        setAlert(errorData);
        setTimeout(() => {
            setAlert('');
            event.target.newpass.value = '';
            event.target.confpass.value = '';
        }, 2000);
    }
}

export const getToken = async (setToken, setError) => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token === '') {
        setError("Token no proporcionado.");
        return;
    }
    try {
        const response = await api.get(`/recoverypass/getToken?token=${token}`);
        const {data} = response;
        if (response.status === 200) {
            setError(null);
            setToken(token);
            return true;
        } else if (response.status === 400){
            setError(data.message);
        } else {
            setError(data.message);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        setError(errorMessage);
    }
};