import axios from "axios";
export const adduser = async (event, setAlert, setType, setLoading) => {
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
        setType("success");
        setAlert(data.message);
        setTimeout(() => {
            setLoading(false);
            event.target.nit.value = '';
            event.target.razsoc.value = '';
            event.target.correo.value = '';
            event.target.direc.value = '';
            event.target.tel.value = '';
            event.target.cel.value = '';
            event.target.pass.value = '';
            event.target.passcon.value = '';
            window.location.href = data.redirect;
        }, 3000);
    } catch (error) {
        setType("error");
        if (error.response) {
            const errorData = error.response.data.message;
            if ([401, 400, 404, 500].includes(error.response.status)) {
                setAlert(errorData);
                setTimeout(() => {
                    window.location.href = error.response.data.redirect;
                }, 3000);
            } else {
                setAlert("Ocurrió un error al enviar la solicitud.");
            }
        } else if (error.request) {
            setAlert("No se recibió respuesta del servidor.");
        } else {
            setAlert("Ocurrió un error al enviar la solicitud.");
        }
    } finally {
        setTimeout(() => {
            setAlert("");
            event.target.nit.value = '';
            event.target.razsoc.value = '';
            event.target.correo.value = '';
            event.target.direc.value = '';
            event.target.tel.value = '';
            event.target.cel.value = '';
            event.target.pass.value = '';
            event.target.passcon.value = '';
            setLoading(false);
        }, 3000);
    }
    
}
