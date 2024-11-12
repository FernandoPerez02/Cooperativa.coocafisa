import { api } from "./authService";

export const emailValidate = async (event,setAlert) => {
    const nit = event.target.nit.value.trim();
    const gmail = event.target.gmail.value.trim();
    try {
        const response = await api.post('/recoverypass/emailresetpass', {nit, gmail});
        const data = response.data;
        
        if(response.status === 200) {
            setAlert(data.message)
            event.target.nit.value = '';
            event.target.gmail.value = '';
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1000);
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const errorData = error.response.data.errors;
            const errorMessages = errorData.map((err) => err.msg).join(', ');
            setAlert(errorMessages || 'Credenciales incorrectas.');
        } else if (error.response && error.response.status === 401) {
            setAlert('Credenciales incorrectas');
        } else {
            console.error('Error en la solicitud', error);
            setAlert('Error en el servidor. Intenta nuevamente más tarde.');
        }
    }
};

export const resetpass = async (event, setAlert) => {
    const nit = event.target.nit.value.trim();
    const newpass = event.target.newpass.value.trim();
    const confpass = event.target.confpass.value.trim();
    try {
        const response = await api.post('/recoverypass/resetpass', {
            nit, newpass, confpass
        });
        const data = response.data;
        if (response.status === 201) {
            setAlert(data.message);
            event.target.nit.value = '';
            event.target.newpass.value = '';
            event.target.confpass.value = '';
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const errorData = error.response.data.errors;
            const errorMessages = errorData.map((err) => err.msg).join(', ');
            setAlert(errorMessages);
        } else if (error.response && error.response.status === 401) {
            setAlert(error.response.data.errors);
        } else {
            console.error('Error en la solicitud', error);
            setAlert('Hubo un problema al enviar los datos.');
        }
        setTimeout(() => {
            setAlert('');
            event.target.nit.value = '';
            event.target.newpass.value = '';
            event.target.confpass.value = '';
        }, 1000);
    }
}