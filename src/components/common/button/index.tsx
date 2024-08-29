import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
type propType = {
  label?: string;
  variant?:
    | "primary"
    | "secondary"
    | "light_hover"
    | "dark"
    | "basic"
    | "dark_hover";
  className?: string;
  isLoading?: boolean;
  children?: JSX.Element | string;
  onClick?: any;
  disabled?: boolean;
  [key: string]: any;
};

const Button: React.FC<propType> = ({
  label,
  variant,
  className,
  children,
  isLoading,
  onClick,
  ...props
}) => {
  let classList = ``;
  if (!variant || variant === "primary") {
    classList = "bg-primary text-black hover:bg-white hover:text-primary border hover:border-primary font-semibold text-[20px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md py-2 px-4 ";
  } else if (variant === "secondary") {
    classList = "bg-secondary text-white hover:bg-white hover:text-secondary border hover:border-secondary font-semibold text-[20px] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded-md py-2 px-4";
  } 
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!props?.disabled && !isLoading && onClick) {
      onClick(e);
    }
  }
  return (
    <button
      {...props}
      onClick={handleClick}
      className={`flex items-center transition-all duration-300 justify-center gap-2 py-3 px-3 rounded-md ${classList} ${className} disabled:bg-disabled`}
    >
      {label}
      {children}
      {isLoading && (
        <div className="text-inherit text-[20px] animate-spin flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} />
        </div>
      )}
    </button>
  );
};

export default Button;
