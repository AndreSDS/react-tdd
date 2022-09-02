import { useState } from "react";
import i18n from "./locale/i18n";
import { createMockServer } from "./service/server";
import { SignUpPage } from "./Pages/SignUp";
import { LanguageSelector } from "./components/LanguageSelector";
import { HomePage } from "./Pages/HomePage";
import { LoginPage } from "./Pages/LoginPage";
import { Navbar } from "./components/Navbar";

i18n.init();
createMockServer();

function App() {
  const [path, setPath] = useState(window.location.pathname);

  const handlePath = (newPath: string) => {
    setPath(newPath);
  };

  return (
    <div className="App">
      <Navbar handlePath={handlePath} />
      {path === "/" && <HomePage />}
      {path === "/signup" && <SignUpPage />}
      {path === "/login" && <LoginPage />}
      <LanguageSelector />
    </div>
  );
}

export default App;
