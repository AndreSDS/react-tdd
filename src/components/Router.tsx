import { Routes, Route, useParams } from "react-router-dom";
import { ActivationPage } from "../Pages/ActivationPage";
import { HomePage } from "../Pages/HomePage";
import { LoginPage } from "../Pages/LoginPage";
import { SignUpPage } from "../Pages/SignUp";
import { UserPage } from "../Pages/UserPage";

export const Router = (props: any) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage onLoginSuccess={props.onLoginSuccess} />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/activate/:token" element={<ActivationPage />} />
    </Routes>
  );
};
