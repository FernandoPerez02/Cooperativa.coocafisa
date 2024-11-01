import axios from "axios";

export const adduser = async (event, router, setAlert) => {
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
        setAlert(error.response?.data.message || "Ocurrió un error inesperado.");
    }
}