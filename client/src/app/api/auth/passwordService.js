import { api } from "./authService";

export const emailValidate = async (event, setAlert, setType, setLoading) => {
    event.preventDefault();
    const nit = event.target.nit.value.trim();
    if (nit === '') {
        setAlert('Nit es requerido');
        setType('alertMessage');
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        return;
    }

    try {
        const response = await api.post('/recoverypass/emailresetpass', {nit});
        const {data} = response;
        console.log("Datos de la respuesta: ", data.message);
        if (response.status === 200) {
            setType('success');
            setAlert(data.message);
            event.target.nit.value = '';
            setTimeout(() => {
                window.location.href = data.redirect;
                setLoading(false);
            }, 3000);
        }
    } catch (error) {
        const errorData = error.response.data.message
        setType('error');
        setAlert(errorData);
        if (error.response.status === 400) {
            setAlert(errorData);
        } else if (error.response.status === 401) {
            setAlert(errorData);
        } else if (error.response.status === 404) {
            setAlert(errorData);
        } else {
            setAlert('Error en el servidor. Intenta nuevamente más tarde.')
        }
    } finally {
        setTimeout(() => {
            event.target.nit.value = '';
            setLoading(false);
        }, 3000);
    };
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

export const getToken = async (setToken, setError, setType, setLoading) => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
        setType('error');
        setError("Token no proporcionado.");
        setTimeout(() => {
            window.location.href = '/';
            setLoading(false);
    }, 3000);   
        return;
    } try {
        const response = await api.get(`/recoverypass/getToken?token=${token}`);
        const { data } = response;

        if (response.status === 200) {
            setType('success');
            setError(data.message);
            setToken(token);
            setTimeout(() => {
                setLoading(false);
            },3000);
            return true;
        } else if (response.status === 400) {
            setType('error');
            setError(data.message);
            setTimeout(() => {
                setLoading(false);
                window.location.href = '/';
            }, 3000);
        } else {
            setType('error');
            setError(data.message || "Ocurrió un error inesperado.");
            setTimeout(() => {
                setLoading(false);
                window.location.href = '/';
            }, 3000);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error de conexión.";
        setType('error');
        setError(errorMessage);
        setTimeout(() => {
            setLoading(false);
            window.location.href = '/';
        }, 3000);
    }
};