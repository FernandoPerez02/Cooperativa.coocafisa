import { api } from "../auth/authService";
export const queryInvoices = async () => {
    try {
        const response = await api.get('/queryIndex');
        const data = response.data;
        console.log(data)
        return data
    } catch (error) {
        console.error('Error en la solicitud', error);
        return [];
    }
};
