import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const auth = async (event, setAlert) => {
  event.preventDefault();
  const nit = event.target.nit.value.trim();
  const password = event.target.password.value.trim();

  try {
    const res = await api.post("/auth", { nit, password });
    const data = res.data;

    if (res.status === 200) {
      setAlert(data.message);
      event.target.nit.value = "";
      event.target.password.value = "";
      setTimeout(() => {
        window.location.href = data.redirect;
      }, 1000);
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
        window.location.href = "/users/resetpassword/formpass";
      }, 1000);
    } else if (error.response && error.response.status === 404) {
      setAlert(errorData);
      setTimeout(() => {
        window.location.href = error.response.data.redirect;
      }, 1000);
    } else if (error.response && error.response.status === 500){
      setAlert(errorData)
    }
    else {
      console.error("Error en la solicitud", error);
      setAlert("Error en la solicitud al servidor.");
    }
    setTimeout(() => {
      setAlert("");
      event.target.nit.value = "";
      event.target.password.value = "";
    }, 1000);
  }
};

export const logout = async (event, setAlert) => {
  try {
    const response = await api.post('/logout');
    const data = response.data;
    if (response.ok) {
      window.location.href = '/'; 
    } else { 
      console.error("Error al cerrar sesión:", data);
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

