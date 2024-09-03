import React, { useEffect } from "react";
import {
  ToastCrossIcon,
  ToastSuccessIcon,
  ToastFailIcon,
} from "@/components/ui-icons";

interface ToastMessageProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

function ToastMessage({ type, message, onClose }: ToastMessageProps) {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800`}
      role="alert"
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${
          isSuccess
            ? "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200"
            : "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200"
        } rounded-lg`}
      >
        {isSuccess ? <ToastSuccessIcon /> : <ToastFailIcon />}
        <span className="sr-only">
          {isSuccess ? "Success icon" : "Error icon"}
        </span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <ToastCrossIcon />
      </button>
    </div>
  );
}

export default ToastMessage;
