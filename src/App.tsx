import i18n from "./locale/i18n";
import { createMockServer } from "./service/server";
import { SignUpPage } from "./Pages/SignUp";
import "./App.css";
import { LanguageSelector } from "./components/LanguageSelector";

i18n.init();
createMockServer();

function App() {
  return (
    <div className="App">
      <SignUpPage />
      <LanguageSelector />
    </div>
  );
}

export default App;
