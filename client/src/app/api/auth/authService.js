import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
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
    const errorData = error.response.data.errors;
    if (error.response && error.response.status === 400) { 
      const errorMessages = errorData.map((err) => err.msg).join(", "); 
      setAlert(errorMessages || "Credenciales incorrectas.");
    } else if (error.response && error.response.status === 401) {
      setAlert(errorData);
    } else if (error.response && error.response.status === 403) {
      setAlert(errorData);
      setTimeout(() => {
        window.location.href = error.response.data.redirect;
        setLoading(false);
      }, 5000);
    } else if (error.response && error.response.status === 404) {
      setAlert(errorData);
      setTimeout(() => {
        window.location.href = error.response.data.redirect;
        setLoading(false);
      }, 2000);
    } else if (error.response && error.response.status === 500){
      setAlert(errorData)
    }
    else {
      setAlert("Error en la solicitud al servidor.");
    }
    setType("error")
    setTimeout(() => {
      setAlert("");
      event.target.nit.value = "";
      event.target.password.value = "";
      setLoading(false);
    }, 4000);
  }
};

export const logout = async (event,setAlert, setType, setLoading) => {
  event.preventDefault();
  try {
    const response = await api.get('/logout');
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

