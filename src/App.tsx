import i18n from "./locale/i18n";
import { createMockServer } from "./service/server";
import { SignUpPage } from "./Pages/SignUp";
import "./App.css";

i18n.init();
createMockServer();

function App() {
  return (
    <div className="App">
      <SignUpPage />
    </div>
  );
}

export default App;
