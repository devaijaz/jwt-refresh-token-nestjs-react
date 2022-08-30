import create from "zustand";
import { API_USER_LOGOUT, axiosClient } from "../api/axios";

export type AuthState = {
  access_token: string;
  fullname: string;
  email: string;
};

export type Store = {
  auth: AuthState;
  logout: () => void;
  setAuth: (param: AuthState) => void;
};

export const useAuth = create<Store>((set) => ({
  auth: {
    access_token: "",
    fullname: "",
    email: "",
  },
  setAuth: (auth: AuthState) => set((state) => ({ ...state, auth })),
  logout: () => {
    set((state) => ({ ...state, auth: { access_token: "", fullname: "", email: "" } }));
    axiosClient.post(API_USER_LOGOUT, {}, { withCredentials: true });
  },
}));
