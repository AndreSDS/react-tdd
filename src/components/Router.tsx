import { Routes, Route, useParams } from "react-router-dom";
import { ActivationPage } from "../Pages/ActivationPage";
import { HomePage } from "../Pages/HomePage";
import { LoginPage } from "../Pages/LoginPage";
import { SignUpPage } from "../Pages/SignUp";

export const Router = () => {
  const { token } = useParams();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/activate/:token" element={<ActivationPage />} />
    </Routes>
  );
};
