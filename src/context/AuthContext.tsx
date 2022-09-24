import create from "zustand";
import { setItem } from "../utils/storage";

export interface AuthData {
  isLoggedIn: boolean;
  id: string;
  username: string;
  token: string;
}

interface AuthContextData {
  auth: AuthData;
  authLogin: (data: any) => void;
}

export const AuthContext = create<AuthContextData>((set) => ({
  auth: {
    isLoggedIn: false,
    id: "",
  } as AuthData,
  authLogin: (data: any) => {
    setItem("auth", {
      isLoggedIn: true,
      ...data,
      header: `Bearer ${data.token}`,
    });
    set({ auth: { ...data, isLoggedIn: true } });
  },
}));
