import { api } from "../auth/authService";
export const queryInvoices = async (setError) => {
    try {
        const response = await api.get('/queryIndex/invoices');
        const data = response.data;
        return data
    } catch (error) {
        const errorData = error.response.data.errors;
        if (error.response && error.response.status === 401) {
            setError(errorData);
            window.location.href = "/";
        } else if (error.response && error.response.status === 404) {
            setError(errorData);   
            window.location.href = error.response.data.redirect;
        } else {
            setAlert("Error en la solicitud al servidor. Inténtalo de nuevo más tarde.");
        }
    }
};

export const queryinvoicepayment = async () => {
    try {
        const response = await api.get('/queryIndex/invoicepayment');
        const data = response.data;
        return data
    } catch (error) {
        console.error('Error en la solicitud', error);
        return [];
    }
};

export const queryinvoicepending = async () => {
    try {
        const response = await api.get('/queryIndex/invoicepending');
        const data = response.data;
        return data
    } catch (error) {
        console.error('Error en la solicitud', error);
        return [];
    }
};
