import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../service/api";

export const SignUp = () => {
  const { getAllUsers } = useAuth();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    password_repeat: "",
  });
  const [errors, setErrors] = useState({
    username: "Username is required",
    email: "Email is required",
    password: "Password is required",
  });

  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e) {
      const { id, value } = e.currentTarget;

      setFormValues({ ...formValues, [id]: value });
    }
  };

  const disableButton =
    formValues.password && formValues.password === formValues.password_repeat
      ? false
      : true;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
    };

    setLoading(true);

    try {
      await api.post("/users", body);
      setSignUpSuccess(true);
    } catch (error) {
      const errors: any = error;
      if (errors.response.status === 400) {
        setErrors({ ...errors.response.data.errors });
      }
      setLoading(false);
    }
  };

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
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                className="input"
                type="text"
                id="username"
                name="username"
                onChange={onChangeInputValue}
              />
              <span className="error">{errors.username}</span>

              <label htmlFor="email" className="label">
                E-mail
              </label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                onChange={onChangeInputValue}
              />
              <span className="error">{errors.email}</span>

              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                onChange={onChangeInputValue}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}

              <label htmlFor="password_repeat" className="label">
                Password Repeat
              </label>
              <input
                className="input"
                type="password"
                id="password_repeat"
                name="password_repeat"
                onChange={onChangeInputValue}
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}

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
