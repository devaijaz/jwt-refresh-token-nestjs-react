import axios from "axios";
export const AUTH_HEADER_PREFIX = "Authorization";
export const API_USER_LOGIN = "/api/auth/signin";
export const API_USER_REGISTER = "/api/auth/signup";
export const API_USER_LOGOUT = "/api/auth/logout";
export const API_REFRESH_TOKEN = "/api/auth/refresh";
const PORT = 3001;
export const BASE_URL = "http://" + window.location.host.split(":")[0] + ":" + PORT;
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Headers": "Content-Type,Authorization",
  //   "Access-Control-Allow-Credentials": true,
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});
