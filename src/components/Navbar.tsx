import { useTranslation } from "react-i18next";

interface NavBarProps {
  handlePath: (newPath: string) => void;
}

export const Navbar = ({ handlePath }: NavBarProps) => {
  const { t } = useTranslation();

  const onClick = (event: any) => {
    event.preventDefault();
    const path = event.currentTarget.getAttribute("href");
    window.history.pushState({}, "", path);
    handlePath(path);
  };

  return (
    <nav className="bg-white mb-3 px-2 sm:px-4 py-2.5 dark:bg-gray-400 w-full">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a
          className="flex flex-1 items-center"
          href="/"
          title={t("home")}
          onClick={onClick}
        >
          {t("home")}
        </a>
        <div className="flex justify-between items-center">
          <a
            className="flex items-center ml-3"
            href="/signup"
            title={t("signUp")}
            onClick={onClick}
          >
            {t("signUp")}
          </a>
          <a
            className="flex items-center ml-3"
            href="/login"
            title={t("login")}
            onClick={onClick}
          >
            {t("login")}
          </a>
        </div>
      </div>
    </nav>
  );
};
