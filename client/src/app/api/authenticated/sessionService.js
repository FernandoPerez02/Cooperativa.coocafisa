import { api } from "../auth/authService";

export const getSession = async () => {
  const response = await api.get("managerSession/sessionExpiration");
  const data = response.data
  return data;
};