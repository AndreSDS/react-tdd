import { RefObject } from "react";

interface InputProps {
  value?: string;
  label?: string;
  placeholder?: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  errorMessage?: string;
}

export function Input({
  id,
  label,
  onChange,
  errorMessage,
  type,
  value,
  placeholder,
}: InputProps) {
  const inputClass = errorMessage ? "input error-input" : "input";

  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        defaultValue={value}
        type={type}
        className={inputClass}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
      />
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
}
