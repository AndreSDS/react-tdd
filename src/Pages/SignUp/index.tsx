import {
  ChangeEvent,
  FormEvent,
  LegacyRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../service/api";
import { Input } from "../../components";
import { CustomAlert } from "../../components";
import { ProgressIndicator } from "../../components";

interface ErrorsProps {
  username?: string;
  email?: string;
  password?: string;
}

export const SignUpPage = (props: any) => {
  const { t, i18n } = useTranslation();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({});

  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  let newFormValues = { ...formValues };
  let errorFields = { ...errors };

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e) {
      const { id, value } = e.currentTarget;
      newFormValues = { ...newFormValues, [id]: value };
      delete errorFields[id as keyof ErrorsProps];
    }

    setFormValues((prev) => ({ ...prev, ...newFormValues }));
    setErrors((prev) => ({ ...prev, ...errorFields }));
  };

  const handleErros = (data: any) => {
    const passwordMinLength = formValues.password.length < 6;
    let errorFields = { ...errors };

    for (const id in formValues) {
      const propname = id as keyof typeof formValues;

      if (formValues[propname]) {
        delete errorFields[propname as keyof ErrorsProps];
      } else {
        errorFields = { ...errorFields, [propname]: data[propname] };
      }

      if (propname === "password" && passwordMinLength) {
        errorFields = { ...errorFields, password: data[propname] };
      }

      setErrors(errorFields);
    }
  };

  const disableButton = useMemo(() => {
    return formValues.password ? false : true;
  }, [formValues]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
    };

    setLoading(true);

    try {
      if (!passwordMissmatch) {
        await api.post("/users", body, {
          headers: {
            "Accept-Language": i18n.language,
          },
        });

        setSignUpSuccess(true);
        setErrors({});
      }
    } catch (error) {
      const errors: any = error;
      if (errors.response.status === 400) {
        handleErros(errors.response.data.errors);
      }
      setLoading(false);
    }
  };

  const passwordMissmatch =
    formValues.password !== formValues.passwordRepeat
      ? t("passwordMissmatch")
      : "";

  return (
    <>
      <div
        data-testid="signup-page"
        className="w-full max-w-lg mx-auto flex flex-col"
      >
        {!signUpSuccess && (
          <form
            data-testid="sign-up-form"
            onSubmit={onSubmit}
            className="grow bg-white shadow-md rounded px-8 py-6"
          >
            <h1 className="font-bold text-xl mb-3">{t("signUp")}</h1>

            <div className="mb-4">
              <Input
                id="username"
                label={t("username")}
                onChange={onChangeInputValue}
                errorMessage={errors.username}
              />

              <Input
                type="email"
                id="email"
                label={t("email")}
                onChange={onChangeInputValue}
                errorMessage={errors.email}
              />

              <Input
                type="password"
                id="password"
                label={t("password")}
                onChange={onChangeInputValue}
                errorMessage={errors.password}
              />

              <Input
                type="password"
                id="passwordRepeat"
                label={t("passwordRepeat")}
                onChange={onChangeInputValue}
                errorMessage={passwordMissmatch}
              />

              <button
                className={
                  disableButton || loading
                    ? "disabled:opacity-75 button"
                    : "button"
                }
                disabled={disableButton || loading}
                type="submit"
              >
                {loading && (
                  <ProgressIndicator />
                )}
                {t("signUp")}
              </button>
            </div>
          </form>
        )}

        {signUpSuccess && (
          <CustomAlert
            message="Please check your email to activate your account"
            type="success"
          />
        )}
      </div>
    </>
  );
};
