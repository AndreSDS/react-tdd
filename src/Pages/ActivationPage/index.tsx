import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomAlert } from "../../components/Alet";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { api } from "../../service/api";

export const ActivationPage = () => {
  const [result, setResult] = useState("");
  const { token } = useParams();

  async function sendToken() {
    try {
      setResult("");

      await api.post(`/users/token/${token}`);
      setResult("success");
    } catch (error) {
      setResult("failed");
    }
  }

  useEffect(() => {
    sendToken();
  }, [token]);

  return (
    <div data-testid="activation-page" className="w-full m-6 p-6  flex justify-center align-middle">
      {result === "success" && (
        <CustomAlert message="Account is activated" type="success" />
      )}

      {result === "failed" && (
        <CustomAlert message="Activation failed" type="error" />
      )}

      {!result && (
        <ProgressIndicator color="sky" />
      )}
    </div>
  );
};
