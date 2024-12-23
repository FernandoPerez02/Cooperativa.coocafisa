import { api } from "../serverApi";

export const getSession = async () => {
  try {
    const response = await api.get('/managerSession/session');
    const sessionData = response.data;
    if (sessionData?.expiration) {
        const { minutes, seconds } = sessionData.expiration;
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

export const sessionToken = async () => {
  try {
    if (sessionStorage.getItem("Token")) {
      return sessionStorage.getItem("Token");
    }
    return null;
  } catch (error) {
    return null;
  }
};

