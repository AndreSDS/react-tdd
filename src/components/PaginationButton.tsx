interface PaginationButtonProps {
  handleClick: () => void;
  textButton: string;
}

export const PaginationButton = ({
  handleClick,
  textButton,
}: PaginationButtonProps) => {
  return (
    <button
      className="mr-4 py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      onClick={handleClick}
    >
      {textButton}
    </button>
  );
};
