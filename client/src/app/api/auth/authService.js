import axios from "axios";

export const api = axios.create({
  baseURL: "https://cooperativa-coocafisa-server.onrender.com",
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
        window.location.href = data.redirect;
        setLoading(false);
      }, 2000);
    }
  } catch (error) {
    setType("error");
    if (error.response) {
        const errorData = error.response.data.errors;
        const errorRedirect = error.response.data.redirect;
        if (error.response && error.response.status === 400) { 
          const errorMessages = errorData.map((err) => err.msg).join(", "); 
          setAlert(errorMessages || "Credenciales incorrectas.");
        } else if ([401, 403, 404, 500].includes(error.response.status)) {
          setAlert(errorData);
          setTimeout(() => {
            if (errorRedirect) {
              window.location.href = errorRedirect;
              setLoading(false);
            } 
            setLoading(false);
          }, 3000);
        } else {
          setAlert("Error en la solicitud al servidor.");
        }
        setTimeout(() => {
          setAlert("");
          event.target.nit.value = "";
          event.target.password.value = "";
          setLoading(false);
        }, 3000);
      } else if (error.request) {
        setAlert(`Nuestro servidor está temporalmente fuera de servicio.
          Estamos haciendo todo lo posible para restablecer el servicio.
          Por favor, intenta más tarde.`);
      } else {
        setAlert("Ocurrió un error al enviar la solicitud.");
      }
      setTimeout(() => {
        event.target.nit.value = "";
        event.target.password.value = "";
        setLoading(false);
        setAlert("");
      }, 5000);
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

