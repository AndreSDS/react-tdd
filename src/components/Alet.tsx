import React from "react";

interface CustomAlertProps {
  type: "success" | "error";
  message: string;
}

export const CustomAlert = ({ message, type }: CustomAlertProps) => {
  const success =
    "text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800";
  const error = "text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800";

  const classesAlert = `${
    type === "success" ? success : error
  } w-full p-4 mb-4 mt-4 text-sm rounded-lg`;
  
  return (
    <div className={classesAlert} role="alert">
      {message}
    </div>
  );
};
