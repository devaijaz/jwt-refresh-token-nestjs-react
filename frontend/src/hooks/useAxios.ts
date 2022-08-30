import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_HEADER_PREFIX, BASE_URL } from "../api/axios";
import { useAuth } from "../store";
import { useRefreshToken } from "./useRefreshToken";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const useAxios = () => {
  const auth = useAuth((state) => state.auth);
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        console.log("Request Interceptor", auth?.access_token);
        const headers: AxiosRequestHeaders = config.headers || {};
        if (!headers[AUTH_HEADER_PREFIX]) {
          headers[AUTH_HEADER_PREFIX] = `Bearer ${auth?.access_token}`;
        }
        config.headers = headers;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (value: any) => value,
      async (error) => {
        const originalConfig = error.config;
        if (error.response.status === 401 && !originalConfig.retry) {
          originalConfig.retry = true;
          try {
            const access_token = await refresh();
            if (access_token) {
              originalConfig.headers[AUTH_HEADER_PREFIX] = `Bearer ${access_token}`;
              return axiosInstance(originalConfig);
            }
          } catch (_error) {
            navigate("/login");
            return Promise.reject(_error);
          }
        }
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => config,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh, navigate]);
  return axiosInstance;
};
