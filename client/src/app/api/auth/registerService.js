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

        setAlert(data.message)
        router.push(data.redirect)
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data.errors;
            if (error.response.status === 400) {
                setErrors(errorData);
            } else if (error.response.status === 404) {
                setAlert(errorData);
                window.location.href = error.response.data.redirect;
            } else {
                setAlert("Error en la solicitud al servidor. Inténtalo de nuevo más tarde.");
            }
        } else if (error.request) {
            setAlert("No se recibió respuesta del servidor.");
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
        }
    }    
}