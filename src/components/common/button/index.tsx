import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
type propType = {
  label?: string;
  variant?:
    | "primary"
    | "light"
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
    classList = "bg-primary text-white hover:bg-[#ff6e58e1]";
  } else if (variant === "dark") {
    classList = "bg-secondary text-white hover:bg-[#272727]";
  } else if (variant === "dark_hover") {
    classList =
      "bg-secondary border-secondary border text-white hover:bg-white hover:text-black";
  } else if (variant === "light_hover") {
    classList =
      " text-primary border border-primary bg-primary hover:bg-white text-white hover:text-primary";
  } else if (variant === "light") {
    classList =
      "text-primary border border-primary hover:bg-primary hover:text-white";
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
