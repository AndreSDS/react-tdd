import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../service/api";

export const ActivationPage = () => {
  const [result, setResult] = useState("");
  const { token } = useParams();

  async function sendToken() {
    try {
      await api.post(`/users/token/${token}`);
      setResult("success");
    } catch (error) {
      setResult("error");
    }
  }

  useEffect(() => {
    sendToken();
  }, [token]);

  return (
    <div data-testid="activation-page">
      {result === "success" ? (
        <div
          className="w-full p-4 mb-4 mt-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
          role="alert"
        >
          Account is activated
        </div>
      ) : (
        <div
          className="w-full p-4 mb-4 mt-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          Activation failed
        </div>
      )}
    </div>
  );
};
