import i18n from "./locale/i18n";
import { createMockServer } from "./service/server";
import { SignUpPage } from "./Pages/SignUp";
import "./App.css";
import { LanguageSelector } from "./components/LanguageSelector";
import { HomePage } from "./Pages/HomePage";
import { LoginPage } from "./Pages/LoginPage";

i18n.init();
createMockServer();

function App() {
  return (
    <div className="App">
      {window.location.pathname === "/" && <HomePage />}
      {window.location.pathname === "/signup" && <SignUpPage />}
      {window.location.pathname === "/login" && <LoginPage />}
      <LanguageSelector />
    </div>
  );
}

export default App;
