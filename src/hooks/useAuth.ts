import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { auth, authLogin, authLogout } = AuthContext();

  return {
    auth,
    authLogin,
    authLogout,
  };
};
