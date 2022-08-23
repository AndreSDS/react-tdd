interface InputProps {
  label: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  errorMessage?: string;
}

export function Input({ id, label, onChange, errorMessage, type }: InputProps) {
  const inputClass = errorMessage ? "input error-input" : "input";

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        type={type}
        className={inputClass}
        id={id}
        onChange={onChange}
      />
      {errorMessage && <span className="error">{errorMessage}</span>}
    </div>
  );
}
