import { useTranslation } from "react-i18next";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  function toggleLanguage() {
    if (i18n.language === "en") {
      i18n.changeLanguage("pt");
      return;
    }
    i18n.changeLanguage("en");
  }

  return (
    <div className="flex w-16 gap-2 pt-2 m-auto">
      <img
        className="h-6 w-7"
        title="Portuguese"
        src="https://countryflagsapi.com/png/br"
        alt="Brazil flag"
        onClick={toggleLanguage}
      />

      <img
        className="h-6 w-7"
        title="English"
        src="https://countryflagsapi.com/png/us"
        alt="The United States Of America flag"
        onClick={toggleLanguage}
      />
    </div>
  );
};
