import { ProgressIndicator } from "./ProgressIndicator";

interface ButtonWithProgressProps {
  handleClick?: () => void;
  disabled: boolean;
  loading: boolean;
  title: string;
}

export const ButtonWithProgress = ({
  handleClick,
  disabled,
  loading,
  title,
}: ButtonWithProgressProps) => {
  return (
    <button
      className={
        disabled || loading
          ? "disabled:opacity-75 hover:opacity-75 button"
          : "button"
      }
      disabled={disabled || loading}
      type="submit"
      onClick={handleClick}
    >
      {loading && <ProgressIndicator />}
      {title}
    </button>
  );
};
