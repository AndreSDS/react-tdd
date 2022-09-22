import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { auth, authLogin } = AuthContext();

  return {
    auth,
    authLogin,
  };
};
