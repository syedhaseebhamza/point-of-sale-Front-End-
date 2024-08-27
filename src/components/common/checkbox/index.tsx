import React from "react";

interface ToggleSwitchProps {
  isOn?: boolean;
  handleToggle?: () => void;
  id?: string;
  label?: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  id,
  label,
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {label && (
        <label htmlFor={id} className="mr-2 text-gray-700">
          {label}
        </label>
      )}
      <div
        id={id}
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
          isOn ? "bg-green-500" : "bg-gray-300"
        }`}
        onClick={handleToggle}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
            isOn ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
