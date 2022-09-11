import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import brandLogo from "../images/rengar_logo.png";

interface NavBarProps {
  handlePath: (newPath: string) => void;
}

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-white mb-3 px-2 sm:px-4 py-2.5 dark:bg-gray-400 w-full">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link
          to="/"
          title={t("home")}
          // onClick={onClick}
          className="flex flex-1 items-center"
        >
          <img
            data-testid="home-logo"
            className="w-12 h-12 mr-2 rounded-full border-4 border-indigo-200 border-solid shadow-lg"
            src="https://ih1.redbubble.net/image.1009729670.4646/st,small,507x507-pad,600x600,f8f8f8.jpg"
            alt="logo"
          />
        </Link>

        <div className="flex justify-between items-center">
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
        </div>
      </div>
    </nav>
  );
};
