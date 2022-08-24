import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../service/api";
import { Input } from "../../components/Input";

interface ErrorsProps {
  errorUsername?: string;
  errorEmail?: string;
  errorPassword?: string;
}

export const SignUp = () => {
  const formRef = useRef(null);
  const { getAllUsers } = useAuth();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    password_repeat: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({});

  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e) {
      const { id, value } = e.currentTarget;

      setFormValues({ ...formValues, [id]: value });
    }
  };

  const handleErros = (data: any) => {
    const passwordMinLength = formValues.password.length < 6;
    let errorFields = { ...errors };

    for (const id in formValues) {
      const propname = id as keyof typeof formValues;

      if (!formValues[propname]) {
        errorFields = { ...errorFields, [propname]: data[propname] };
      }

      if (propname === "password" && passwordMinLength) {
        errorFields = { ...errorFields, errorPassword: data[propname] };
      }

      setErrors(errorFields);
    }
  };

  const disableButton = formValues.password ? false : true;

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
        await api.post("/users", body);

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
    formValues.password !== formValues.password_repeat
      ? "Password does not match"
      : "";

  return (
    <>
      <div className="w-full max-w-lg mx-auto flex">
        {!signUpSuccess && (
          <form
            data-testid="sign-up-form"
            onSubmit={onSubmit}
            className="grow bg-white shadow-md rounded px-8 py-6"
          >
            <h1 className="font-bold text-xl mb-3">Sign Up</h1>

            <div className="mb-4">
              <Input
                id="username"
                label="Username"
                onChange={onChangeInputValue}
                errorMessage={errors.errorUsername}
              />

              <Input
                type="email"
                id="email"
                label="E-mail"
                onChange={onChangeInputValue}
                errorMessage={errors.errorEmail}
              />

              <Input
                type="password"
                id="password"
                label="Password"
                onChange={onChangeInputValue}
                errorMessage={errors.errorPassword}
              />

              <Input
                type="password"
                id="password_repeat"
                label="Password Repeat"
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
                  <div
                    role="status"
                    className="w-6 h-6 border-4 border-dashed rounded-full animate-spin dark:border-zinc-100 mr-3"
                  ></div>
                )}
                Sign Up
              </button>
            </div>
          </form>
        )}

        {signUpSuccess && (
          <div
            className="w-full p-4 mb-4 mt-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
            role="alert"
          >
            Please check your email to activate your account
          </div>
        )}
      </div>
    </>
  );
};
