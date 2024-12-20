import { api } from "../serverApi";

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
      setTimeout(() => {
        event.target.nit.value = "";
        event.target.password.value = "";
        setLoading(false);
        window.location.href = data.redirect;
      }, 2000);
    }

  } catch (error) {
    setType("error");
  if (error.response) {
    const errorData = error.response.data.errors || [400,401,403,404,500];
    const errorRedirect = error.response.data.redirect;
    setAlert(errorData ||"Credenciales incorrectas.");
    setTimeout(() => {
      if (errorRedirect) {
          window.location.href = errorRedirect;
      }
  }, 2000);
  } else if (error.request) {
    setAlert("Nuestro servidor está fuera de servicio. Intenta más tarde.");
  } else {
    setAlert("Ocurrió un error al enviar la solicitud.");
  } 
} finally {
  setTimeout(() => {
    event.target.nit.value = "";
    event.target.password.value = "";
    setAlert("");
    setType("");
    setLoading(false);
  }, 2000);
}
};

export const logout = async (event,setAlert, setType, setLoading) => {
  event.preventDefault();
  try {
    const response = await api.post('/logout');
    const data = response.data;
    if (response.status === 200) {
      setType("success");
      setAlert(data.message);
      setTimeout(() => {
        setAlert("");
        window.location.href = data.redirect;
        setLoading(false);
      }, 1000);
    } 
  } catch (error) {
    setAlert("Error al cerrar sesión.");
    setTimeout(() => {
      setType("error");
      setAlert("");
      setLoading(false);
    }, 3000);
  }
}

