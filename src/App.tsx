import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { SignUp } from "./Pages/SignUp";

import {createMockServer} from "./service/server";

createMockServer();

function App() {
  return (
    <div className="App">
      <SignUp />
    </div>
  );
}

export default App;
