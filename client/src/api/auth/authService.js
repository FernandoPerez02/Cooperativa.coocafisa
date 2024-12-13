import { api } from "../server";

export const auth = async (event, setAlert, setLoading, setType) => {
  event.preventDefault();
  const nit = event.target.nit.value.trim();
  const password = event.target.password.value.trim();

  const clearInputs = () => {
    event.target.nit.value = "";
    event.target.password.value = "";
  };

  try {
    const res = await api.post("/auth/login", { nit, password });
    const data = res.data;

    if (res.status === 200) {
      setType("success");
      setAlert("");
      setTimeout(() => {
        clearInputs();
        setLoading(false);
        window.location.href = data.redirect;
      }, 2000);
    }

  } catch (error) {
    setType("error");
  if (error.response) {
    const errorData = error.response.data.errors || [];
    setAlert(errorData ||"Credenciales incorrectas.");
  } else if (error.request) {
    setAlert("Nuestro servidor está fuera de servicio. Intenta más tarde.");
  } else {
    setAlert("Ocurrió un error al enviar la solicitud.");
  } 
} finally {
  setTimeout(() => {
    setAlert("");
    setType("");
    clearInputs();
    setLoading(false);
  }, 2000);
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
        window.location.href = data.redirect;
        setLoading(false);
        sessionStorage.removeItem('SessionData')
      }, 2000);
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

