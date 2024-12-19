import { api } from "../server";

export const getSession = async () => {
  try {
    const response = await api.get('/managerSession/session');
    const sessionData = response.data;
    if (sessionData?.expiration) {
      const expirationDate = new Date(sessionData.expiration * 1000);
      const currentTime = new Date();

      if (expirationDate > currentTime) {
        const timeRemaining = expirationDate - currentTime;
        const totalSeconds = Math.floor(timeRemaining / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        console.log('Tiempo restante:', minutes, seconds);

        return {
          ...sessionData,
          timeRemaining: {
            minutes,
            seconds,
          },
        };
      } else {
        console.warn('La sesión ha expirado.');
      }
    }

    return {
      isAuthenticated: false,
      user: null,
      role: null,
      expiration: null,
    };

  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      role: null,
      expiration: null,
    };
  }
};

