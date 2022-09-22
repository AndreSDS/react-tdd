import { useState } from "react";
import i18n from "./locale/i18n";
import { createMockServer } from "./service/server";
import { LanguageSelector } from "./components/LanguageSelector";
import { Navbar } from "./components/Navbar";
import { Router } from "./components/Router";

i18n.init();
createMockServer();

function App() {
  return (
    <>
      <Navbar />
      <Router />
      <LanguageSelector />
    </>
  );
}

export default App;
