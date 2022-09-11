import { useState } from "react";
import i18n from "./locale/i18n";
import { createMockServer } from "./service/server";
import { LanguageSelector } from "./components/LanguageSelector";
import { Navbar } from "./components/Navbar";
import { Router } from "./components/Router";

i18n.init();
createMockServer();

function App() {
  const [path, setPath] = useState(window.location.pathname);

  const handlePath = (newPath: string) => {
    setPath(newPath);
  };

  return (
    <div className="App">
      <Navbar />
      <Router />
      <LanguageSelector />
    </div>
  );
}

export default App;
