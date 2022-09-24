import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import brandLogo from "../images/rengar_logo.png";

export const Navbar = () => {
  const { auth } = useAuth();

  const { t } = useTranslation();

  return (
    <nav className="bg-white mb-3 px-2 sm:px-4 py-2.5 dark:bg-gray-400 w-full">
      <div className="container flex justify-between items-center mx-auto">
        <Link to="/" title={t("home")} className="flex items-center">
          <img
            data-testid="home-logo"
            className="w-12 h-12 mr-2 rounded-full border-4 border-indigo-200 border-solid shadow-lg"
            src={brandLogo}
            alt="logo"
          />
        </Link>

        <div className="flex justify-between items-center">
          {!auth.isLoggedIn && (
            <>
              <Link
                data-testid="signup-link"
                className="flex items-center ml-3"
                to="/signup"
                title={t("signUp")}
              >
                {t("signUp")}
              </Link>
              <Link
                className="flex items-center ml-3"
                to="/login"
                title={t("login")}
              >
                {t("login")}
              </Link>
            </>
          )}

          {auth.isLoggedIn && (
            <Link className="flex items-center ml-3" to={`/user/${auth.id}`}>
              {t("myProfile")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
