import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";

export const SignUp = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    password_repeat: "",
  });

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement> | undefined) => {
    if (e) {
      const { value, name } = e.currentTarget;
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const disableButton =
    formValues.password &&
    formValues.password === formValues.password_repeat
      ? false
      : true;

  return (
    <div>
      <h1>Sign Up</h1>

      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        name="usename"
        onChange={onChangeInputValue}
      />

      <label htmlFor="email">E-mail</label>
      <input
        type="email"
        id="email"
        name="email"
        onChange={onChangeInputValue}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={onChangeInputValue}
      />

      <label htmlFor="password_repeat">Password Repeat</label>
      <input
        type="password"
        id="password_repeat"
        name="password_repeat"
        onChange={onChangeInputValue}
      />

      <button disabled={disableButton} type="submit">
        Sign Up
      </button>
    </div>
  );
};
