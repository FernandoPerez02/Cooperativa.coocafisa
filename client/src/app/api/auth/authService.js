import axios from "axios";
import { saveSession } from "../authenticated/sessionService";

export const api = axios.create({
  baseURL: 'https://cooperativa-coocafisa-server.onrender.com',
  withCredentials: true,
  headers: { 
    "Content-Type": "application/json",
   },
});

export const auth = async (event, setAlert, setLoading, setType) => {
  event.preventDefault();
  const nit = event.target.nit.value.trim();
  const password = event.target.password.value.trim();

  try {
    const res = await api.post("/auth/login", { nit, password });
    const data = res.data;

    if (res.status === 200) {
      setType("success");
      setAlert("");
      event.target.nit.value = "";
      event.target.password.value = "";
      setTimeout(() => {
        saveSession();
        setLoading(false);
        window.location.href = data.redirect;
      }, 2000);
    }

  } catch (error) {
    setType("error");
    handleError(error); 
    setLoading(false);
    event.target.nit.value = "";
    event.target.password.value = "";
  }
};

// Función de manejo de errores
const handleError = (error) => {
  if (error.response) {
    const errorData1 = error.response.data.errors || [];
    const errorMessages = errorData1.map(err => err.msg).join(", ");
    setAlert(errorMessages || "Credenciales incorrectas.");
  } else if (error.request) {
    setAlert("Nuestro servidor está fuera de servicio. Intenta más tarde.");
  } else {
    setAlert("Ocurrió un error al enviar la solicitud.");
  }
};


export const logout = async (event,setAlert, setType, setLoading) => {
  event.preventDefault();
  try {
    const response = await api.get('/managerSession/logout');
    const data = response.data;
    if (response.status === 200) {
      setType("success");
      setAlert(data.message);
      setTimeout(() => {
        setAlert("");
        setLoading(false);
        window.location.href = data.redirect;
      }, 2000);
      sessionStorage.removeItem('SessionData')
    } 
  } catch (error) {
    errorData = error.response.data.error || error.response.data.errors;
    if (error.response && error.response.status === 400) { 
      setAlert(errorData);
    } else {
      setAlert("Error al cerrar sesión.");
    }
    setTimeout(() => {
      setType("error");
      setAlert("");
      setLoading(false);
    }, 2000);
  }
}

