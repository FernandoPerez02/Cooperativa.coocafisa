import { api } from "./authService";

export const emailValidate = async (event,setAlert) => {
    const nit = event.target.nit.value.trim();
    const gmail = event.target.gmail.value.trim();
    try {
        const response = await api.post('/recoverypass/emailresetpass', {nit, gmail});
        const data = response.data;
        console.log(data.message)
        setAlert(data.message)
    } catch (error) {
        console.error('Error en la solicitud', error);
        setAlert("Hubo un error con el servicio, intentalo mas tarde.")
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
        setAlert(data.message)
    } catch (error) {
        console.error("Error en la solicitud", error);
        setAlert("Hubo un problema al enviar los datos.")
    }
}