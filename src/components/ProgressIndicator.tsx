interface ProgressIndicatorProps {
  color?: string;
  size?: string;
}

export const ProgressIndicator = ({
  color = "zinc",
  size = "6",
}: ProgressIndicatorProps) => {
  return (
    <div
      role="status"
      className={`w-${size} h-${size} border-4 border-dashed rounded-full animate-spin dark:border-${color}-100 mr-3`}
    ></div>
  );
};
