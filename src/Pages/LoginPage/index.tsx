import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomAlert, Input, ProgressIndicator } from "../../components";
import { api, loginUser } from "../../service/api";

interface ErrorsProps {
  message?: string;
}

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
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
      await loginUser(body);

      setErrorMessage("");

      setLoading(false);
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
            // errorMessage={errors.email}
          />

          <Input
            type="password"
            id="password"
            label={t("password")}
            onChange={onChangeInputValue}
            // errorMessage={errors.password}
          />

          <button
            className={
              disableButton || loading
                ? "disabled:opacity-75 hover:opacity-75 button"
                : "button"
            }
            disabled={disableButton || loading}
            type="submit"
          >
            {loading && <ProgressIndicator />}
            {t("login")}
          </button>

          {errorMessage && !loading && (
            <CustomAlert type="error" message={errorMessage} />
          )}
        </div>
      </form>
    </div>
  );
};
