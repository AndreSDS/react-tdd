import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ButtonWithProgress, CustomAlert, Input } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../service/api";

export const LoginPage = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { email, password } = formValues;

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    let newFormValues = { ...formValues };
    if (e) {
      const { id, value } = e.currentTarget;
      newFormValues = { ...newFormValues, [id]: value };

      if (errorMessage) {
        setErrorMessage("");
      }
    }

    setFormValues((prev) => ({ ...prev, ...newFormValues }));
  };

  const disableButton = useMemo(() => {
    return email && password ? false : true;
  }, [formValues]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      email: formValues.email,
      password: formValues.password,
    };

    setLoading(true);

    try {
      const response = await loginUser(body);
      setLoading(false);

      authLogin(response.data);

      navigate("/");
    } catch (error) {
      const errors: any = error;
      if (errors.response.status === 401) {
        setErrorMessage(errors.response.data.message);
      }
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="login-page"
      className="w-full max-w-lg mx-auto flex flex-col"
    >
      <form
        data-testid="login-form"
        onSubmit={onSubmit}
        className="grow bg-white shadow-md rounded px-8 py-6"
      >
        <h1 className="font-bold text-xl mb-3">{t("login")}</h1>

        <div className="mb-4">
          <Input
            type="email"
            id="email"
            label={t("email")}
            onChange={onChangeInputValue}
          />

          <Input
            type="password"
            id="password"
            label={t("password")}
            onChange={onChangeInputValue}
          />

          <ButtonWithProgress
            title={t("login")}
            loading={loading}
            disabled={disableButton || loading}
          />

          {errorMessage && !loading && (
            <CustomAlert type="error" message={errorMessage} />
          )}
        </div>
      </form>
    </div>
  );
};
