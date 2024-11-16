import axios from "axios";

export const adduser = async (event, router, setAlert, setErrors) => {
    event.preventDefault();
    const nit = event.target.nit.value;  
    const razsoc = event.target.razsoc.value;
    const correo = event.target.correo.value;
    const direc = event.target.direc.value;
    const tel = event.target.tel.value;
    const cel = event.target.cel.value;
    const pass = event.target.pass.value;
    const passcon = event.target.passcon.value;

    try {
        const response = await axios.post('http://localhost:3001/adduser', {
            nit, razsoc, correo, tel,
            pass, passcon, direc, cel
        });
        const data = response.data;
        setAlert(data.message);
        setTimeout(() => {
            event.target.nit.value = '';
            event.target.razsoc.value = '';
            event.target.correo.value = '';
            event.target.direc.value = '';
            event.target.tel.value = '';
            event.target.cel.value = '';
            event.target.pass.value = '';
            event.target.passcon.value = '';
            window.location.href = data.redirect;
        }, 2000);
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data.errors;
            if (error.response.status === 400) {
                setErrors(errorData);
            } else if (error.response.status === 404) {
                setAlert(errorData);
            } else {
                setAlert("Error en la solicitud al servidor. Inténtalo de nuevo más tarde.");
            }
        } else if (error.request) {
            setAlert("No se recibió respuesta del servidor.");
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
        }
        setTimeout(() => {
            setAlert("");
          }, 2000);
    }    
}