import create from "zustand";
import { clearStorage, setItem } from "../utils/storage";

export interface AuthData {
  isLoggedIn: boolean;
  id: string;
  username: string;
  token: string;
}

interface AuthContextData {
  auth: AuthData;
  authLogin: (data: any) => void;
  authLogout: () => void;
}

export const AuthContext = create<AuthContextData>((set) => ({
  auth: {
    isLoggedIn: false,
    id: "",
  } as AuthData,
  authLogin: (data: any) => {
    setItem("auth", {
      ...data,
      isLoggedIn: true,
      header: `Bearer ${data.token}`,
    });
    set({ auth: { ...data, isLoggedIn: true } });
  },
  authLogout: () => {
    clearStorage();
    set({ auth: { isLoggedIn: false, id: "", username: "", token: "" } });
  },
}));
