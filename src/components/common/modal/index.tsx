import React from "react";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  heading?: string;
  size?: "sm" | "md" | "lg" | "xl";
  content?: JSX.Element;
  footerContent?: JSX.Element;
  icon?: FontAwesomeIconProps;
  padding?: string;
  iconColor?: string;
}

const Modal: React.FC<ModalProps> = ({
  heading,
  size = "md",
  show,
  content,
  onClose,
  footerContent,
  icon,
  padding = "p-4",
  iconColor = "text-black",
}) => {
  const defaultIcon = <FontAwesomeIcon icon={faTimes} />;
  const modalIcon = icon ? (
    <FontAwesomeIcon {...icon} style={{ color: iconColor }} />
  ) : (
    defaultIcon
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg ${size === "sm" ? "w-1/4" : size === "md" ? "w-1/2" : size === "lg" ? "w-3/4" : "w-full"} ${padding}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">{heading}</h2>
          <div className="flex items-center space-x-2">
        
            <button
              onClick={onClose}
              className="p-2 text-black hover:bg-gray-200 rounded-full"
            >
              {modalIcon}
            </button>
          </div>
        </div>
        <div className={`p-4 ${padding}`}>
          {content ?? <div>Content goes here</div>}
        </div>
        <div className="flex justify-end border-t p-4">
          {footerContent ?? (
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
