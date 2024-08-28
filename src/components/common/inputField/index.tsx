import React, { ChangeEvent } from "react";

interface CommonInputProps {
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  type?: string;
  id?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  error?: any;
  [x: string]: any;
}

const Input = ({
  disabled,
  name,
  value,
  onChange,
  onPaste,
  type = "text",
  id,
  label,
  placeholder,
  className,
  error,
  ...rest
}: CommonInputProps) => {
  return (
    <div className={`mb-2`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-normal text-secondary mb-4 "
        >
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        id={id}
        disabled={disabled}
        onPaste={onPaste}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-[13px] border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-gray-400"
        } w-full bg-light_gray no-spinners ${className}`}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}{" "}
    </div>
  );
};

export default Input;
