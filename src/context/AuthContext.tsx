import create from "zustand";

interface AuthData {
  isLoggedIn: boolean;
  id: string;
}

interface AuthContextData {
  auth: AuthData;
  authLogin: (id: string) => void;
}

export const AuthContext = create<AuthContextData>((set) => ({
  auth: {
    isLoggedIn: false,
    id: "",
  } as AuthData,
  authLogin: (id: string) => set({ auth: { isLoggedIn: true, id } }),
}));
