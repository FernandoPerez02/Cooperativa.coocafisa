import { api } from "../server";

export const saveSession = async () => {
  try {
    const response = await api.get("/managerSession/session");
    const data = response.data;

    if (data && data.isAuthenticated) {
      const expirationDate = new Date(data.expiration);
      const currentDate = new Date();

      if (expirationDate > currentDate) {
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
  try {
    const storedSession = sessionStorage.getItem('SessionData');

    let sessionData;
    if (storedSession) {
      sessionData = JSON.parse(storedSession);
    } else {
      const response = await api.get('/managerSession/session');
      sessionData = response.data;

      sessionStorage.setItem('SessionData', JSON.stringify(sessionData));
      console.log('Datos de sesión:', sessionData);
    }

    if (sessionData) {
      if (sessionData.expiration) {
        const expirationDate = new Date(sessionData.expiration);
        const currentTime = new Date();

        if (expirationDate > currentTime) {
          const timeRemaining = expirationDate - currentTime;
          const totalSeconds = Math.floor(timeRemaining / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;

          return {
            ...sessionData,
            timeRemaining: {
              minutes,
              seconds,
            },
          };
        } else {
          sessionStorage.removeItem('SessionData');
          return null;
        }
      } else {
        return sessionData;
      }
    }
    return null;
  } catch (error) {
    sessionStorage.removeItem('SessionData');
    return null;
  }
};
