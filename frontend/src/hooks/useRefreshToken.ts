import { API_REFRESH_TOKEN, axiosClient } from "../api/axios";
import { useAuth } from "../store";

export const useRefreshToken = () => {
  const setAuth = useAuth((state) => state.setAuth);

  const refresh = async () => {
    const response = await axiosClient.post(
      API_REFRESH_TOKEN,
      {},
      {
        withCredentials: true,
      }
    );
    setAuth(response.data);
    return response.data.access_token;
  };
  return refresh;
};
