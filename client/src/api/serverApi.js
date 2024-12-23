import axios from "axios";

export const sessionToken = async () => {
  try {
    const token = sessionStorage.getItem("Token");
    return token ? token : null;
  } catch (error) {
    console.error("Error al obtener el token de sesión:", error);
    return null;
  }
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para agregar el token dinámicamente
api.interceptors.request.use(
  async (config) => {
    const token = await sessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
