import { api } from "../auth/authService";

export const saveSession = async () => {
  try {
    const response = await api.get("/managerSession/session");
    const data = response.data;

    if (data && data.isAuthenticated) {
      const expirationDate = new Date(data.expiration);
      const currentDate = new Date();

      if (expirationDate > currentDate) {
        // Guarda solo los datos esenciales
        const sessionData = {
          isAuthenticated: data.isAuthenticated,
          user: data.user,
          role: data.role,
          expiration: data.expiration,
        };
        sessionStorage.setItem('SessionData', JSON.stringify(sessionData));
        console.log('Sesión iniciada:', sessionData);
      } else {
        console.warn('Sesión caducada.');
        sessionStorage.removeItem('SessionData');
      }
    } else {
      console.warn('Sesión no iniciada o usuario no autenticado.');
      sessionStorage.removeItem('SessionData');
    }
  } catch (error) {
    console.error('Error al obtener la sesión:', error.message || error);
  }
};


export const getSession = async () => {
  const sessionData = sessionStorage.getItem('SessionData');
  console.log("Datos recuperados de la sesión:", sessionData);

  if (sessionData) {
    try {
      const parsedData = JSON.parse(sessionData);

      if (parsedData.expiration) {
        const expirationDate = new Date(parsedData.expiration);
        const currentTime = new Date();

        if (expirationDate > currentTime) {
          const timeRemaining = expirationDate - currentTime;
          const totalSeconds = Math.floor(timeRemaining / 1000);
          const minute = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;

          return {
            ...parsedData,
            timeRemaining: {
              minute,
              seconds
            }
          } 
        } else {
          console.warn("La sesión ha expirado.");
          sessionStorage.removeItem('SessionData');
          return null;
        }
      } else {
        console.warn("El campo de expiración no está presente en la sesión.");
        return parsedData; 
      }
    } catch (error) {
      console.error("Error al parsear los datos de la sesión:", error);
      sessionStorage.removeItem('SessionData');
      return null;
    }
  }

  console.warn("No hay datos de sesión almacenados.");
  return null;
};


