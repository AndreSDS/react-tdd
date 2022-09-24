import "@testing-library/jest-dom";
import i18n from "./src/locale/i18n";
import { clearStorage } from "./src/utils/storage";

afterEach(() => {
  i18n.changeLanguage("en");
  clearStorage();
});
